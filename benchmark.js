const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
const exec = require('child_process').exec
suite
  .add('build', function () {
    exec('npm run build')
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()
