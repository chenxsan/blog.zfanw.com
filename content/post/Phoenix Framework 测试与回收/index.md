---
title: Phoenix Framework 测试与回收
date: 2018-11-26
permalink: /phoenix-framework-conn-test-recycling
tags:
  - Phoenix
toc: false
---

如果你看过 [Programming Phoenix 一书](https://pragprog.com/book/phoenix14/programming-phoenix-1-4)，你可能已经知道，书里在测试时，为了通过 `Auth` 模块的检查，推荐使用 `conn = assign(conn, :current_user, user)` 来模拟已登录状态。

然而我照猫画虎，在给我的 Phoenix 控制器代码写测试时，发现一个奇怪问题：同一个 `test` 块，前后两行代码， `conn.assigns` 值却是不一致的：

```elixir
  defp log_in_user(%{conn: conn, log_in_as: email}) do
    role = role_fixture()
    user = user_fixture(role, email: email)
    conn = assign(conn, :current_user, user) # <- 模拟登录
    {:ok, conn: conn, user: user}
  end
  describe "delete site" do
    setup [:log_in_user, :create_site]

    @tag log_in_as: "sam"
    test "deletes chosen site", %{conn: conn, site: site} do
      conn = delete(conn, Routes.site_path(conn, :delete, site))
      assert redirected_to(conn) == Routes.site_path(conn, :index)

      assert_error_sent 404, fn ->
         # <- 此时 conn.assigns.current_user 还有 %User{} 值
        get(conn, Routes.site_path(conn, :show, site)) # <- 这里 302 了，而不是预期的 404，经检查发现 current_user 值丢失
      end
    end
  end
```
也就是说，`get(conn, Routes.site_path(conn, :show, site))` 这一行代码里，`conn.assigns` 值变了。

站在一个普通用户角度说，这让人费解，这一行代码并非登出，为什么会导致 `conn.assigns` 变化？

类似的困惑我们可以在很多地方看到：

1. [https://elixirforum.com/t/troubleshooting-a-failed-test-302-redirect-instead-of-200/8779/4](https://elixirforum.com/t/troubleshooting-a-failed-test-302-redirect-instead-of-200/8779/4)
2. [https://stackoverflow.com/questions/50110449/phoenix-controller-test-case-loses-current-user](https://stackoverflow.com/questions/50110449/phoenix-controller-test-case-loses-current-user)
3. [https://stackoverflow.com/questions/46363292/losing-conn-assigns-in-the-middle-of-a-test](https://stackoverflow.com/questions/46363292/losing-conn-assigns-in-the-middle-of-a-test)

翻开源代码，我们来看看那一行 `get` 代码内部究竟发生了什么。

首先来看 `get` [方法](https://github.com/phoenixframework/phoenix/blob/f6e541a002dd732b3b679d569a6d38d00926b127/lib/phoenix/test/conn_test.ex#L167)的定义：

```elixir
@http_methods [:get, :post, :put, :patch, :delete, :options, :connect, :trace, :head]

for method <- @http_methods do
  @doc """
  Dispatches to the current endpoint.
  See `dispatch/5` for more information.
  """
  defmacro unquote(method)(conn, path_or_action, params_or_body \\ nil) do
    method = unquote(method)
    quote do
      Phoenix.ConnTest.dispatch(unquote(conn), @endpoint, unquote(method),
                                unquote(path_or_action), unquote(params_or_body))
    end
  end
end
```
这是一段 [Elixir 宏](https://elixir-lang.org/getting-started/meta/macros.html)。不熟悉或者不知道都没关系，我们看见它在调用 [`Phoenix.ConnTest.dispatch`](https://github.com/phoenixframework/phoenix/blob/f6e541a002dd732b3b679d569a6d38d00926b127/lib/phoenix/test/conn_test.ex#L222) 就行：

```elixir
def dispatch(conn, endpoint, method, path_or_action, params_or_body \\ nil)
def dispatch(%Plug.Conn{} = conn, endpoint, method, path_or_action, params_or_body) do
  if is_nil(endpoint) do
    raise "no @endpoint set in test case"
  end

  if is_binary(params_or_body) and is_nil(List.keyfind(conn.req_headers, "content-type", 0)) do
    raise ArgumentError, "a content-type header is required when setting " <>
                          "a binary body in a test connection"
  end

  conn
  |> ensure_recycled()
  |> dispatch_endpoint(endpoint, method, path_or_action, params_or_body)
  |> Conn.put_private(:phoenix_recycled, false)
  |> from_set_to_sent()
end
def dispatch(conn, _endpoint, method, _path_or_action, _params_or_body) do
  raise ArgumentError, "expected first argument to #{method} to be a " <>
                        "%Plug.Conn{}, got #{inspect conn}"
end
```
`dispatch` 里则调用了 `ensure_recycled`：

```elixir
  def ensure_recycled(conn) do
    if conn.private[:phoenix_recycled] do
      conn
    else
      recycle(conn)
    end
  end
```

追踪 `recycle` 方法：

```elixir
  def recycle(conn) do
    build_conn()
    |> Map.put(:host, conn.host)
    |> Plug.Test.recycle_cookies(conn)
    |> Plug.Test.put_peer_data(Plug.Conn.get_peer_data(conn))
    |> copy_headers(conn.req_headers, ~w(accept authorization))
  end
```
再看看 `build_conn` 的定义：

```elixir
  def build_conn(method, path, params_or_body \\ nil) do
    Plug.Adapters.Test.Conn.conn(%Conn{}, method, path, params_or_body)
    |> Conn.put_private(:plug_skip_csrf_protection, true)
    |> Conn.put_private(:phoenix_recycled, true)
  end
```
这样，我们就弄明白，测试代码里执行一个 `get` 发生了什么：一个全新的 `%Plug.Conn{}` 结构被创建出来，并且拷入旧 `conn` 的 cookie 及 `accept`、`authorization` 两个请求头 - 换句话说，旧 `conn` 只有部分数据被保留，`conn.assigns` 不保留 - 因此 `conn.assigns.current_user` 为 `nil`。

Phoenix 把上面这种行为叫做[回收](https://hexdocs.pm/phoenix/1.4.0/Phoenix.ConnTest.html#module-recycling)？可是，为什么要有这个回收机制？

这是因为 Phoenix 在尝试模拟浏览器的一个机制：一个请求的响应里若设定 cookie，则下一次请求应自动携带 cookie。

了解工作原理后，我们的问题就有了解决办法：手动回收 `conn`，并拷贝旧的 `conn.assigns` 数据到新的 `conn` 上：

```elixir
conn =
  conn
  |> cycle()
  |> Map.put(:assigns, conn.assigns)
```
当然，这个方案不直观，让人觉得莫名其妙。

我们还有一种方案，不采用 Programming Phoenix 一书建议的模拟登录方案，直接调用登录接口：

```elixir
@tag log_in_as: "sam"
test "deletes chosen site", %{conn: conn, site: site, user: user} do
  # 此处执行登录
  # 有两种登录方式，可以二选一
  # 第一种，直接请求 session_path
  conn =
    post(conn, Routes.session_path(conn, :create),
      session: %{email: user.email, password: "123456"}
    )
  # 第二种，我个人认为比第一种更优雅
  # conn = Plug.Test.init_test_session(conn, user_id: user.id)

  conn = delete(conn, Routes.site_path(conn, :delete, site))
  assert redirected_to(conn) == Routes.site_path(conn, :index)

  # 注释掉手动回收代码，因为我们不再需要了
  # conn =
  #   conn
  #   |> recycle()
  #   |> Map.put(:assigns, conn.assigns)

  assert_error_sent 404, fn ->
    get(conn, Routes.site_path(conn, :show, site))
  end
end
```
可是你说，这一种方案里，Phoenix 同样要回收 `conn`，为什么没有出现文章一开始提到的那种问题？这是因为，我们在 session 里存储了 `user_id`，而 Phoenix 的 [session](https://phoenixframework.org/blog/sessions) 默认是通过 cookie 实现 - 还记得吗，Phoenix 的回收保留了 cookie，这样 `Auth` 就匹配到另一条路径：

```elixir
  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)

    cond do
      conn.assigns[:current_user] -> # <- Programming Phoenix 书里推荐的方案匹配的路径
        conn

      user = user_id && Accounts.get_user(user_id) -> # <- post Routes.session_path 方案匹配的路径
        assign(conn, :current_user, user)

      true ->
        assign(conn, :current_user, nil)
    end
  end
```
至于为什么 Programming Phoenix 没有推荐后面这种方案？大概是因为开销更大，毕竟有一个 `Accounts.get_user` 要执行。

## 相关链接

1. [Why Phoenix recycling](https://elixirforum.com/t/why-phoenix-recycling/18201)