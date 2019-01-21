import React from 'react'
import { Block, InlineBlock, Row, Inline } from 'jsxstyle'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'
import ArticleHeader from '../styled/ArticleHeader'
import ArticleHeading from '../styled/ArticleHeading'
import slug from '@okmarvin/slug'
import i18n from '../i18n'
const PostContentHeader = ({
  title,
  author,
  datePublished,
  tags,
  siteConfig: { lang }
}) => (
  <ArticleHeader>
    <ArticleHeading>{title}</ArticleHeading>
    <Block fontSize='0.889rem' marginBottom='1rem' color='#666'>
      by <span>{author}</span> on&nbsp;
      <InlineBlock props={{ dateTime: datePublished }} component='time'>
        {format(datePublished, 'YYYY-MM-DD')}
      </InlineBlock>
      {tags && tags.length ? (
        <Row>
          <span>{i18n('Topics: ', lang)}</span>
          <Inline component='span'>&nbsp;</Inline>{' '}
          {tags.map(tag => (
            <InlineBlock
              marginRight={10}
              key={tag}
              component={Link}
              props={{ to: `/topics/${encodeURIComponent(slug(tag))}/` }}
            >
              <Inline component='span' beforeContent="'#'">
                {tag}
              </Inline>
            </InlineBlock>
          ))}
        </Row>
      ) : null}
    </Block>
  </ArticleHeader>
)
PostContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  datePublished: PropTypes.number.isRequired,
  tags: PropTypes.array
}
export default PostContentHeader
