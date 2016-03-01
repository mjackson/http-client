var execSync = require('child_process').execSync
var readFileSync = require('fs').readFileSync
var prettyBytes = require('pretty-bytes')
var gzipSize = require('gzip-size')

function exec(command) {
  execSync(command, { stdio: 'inherit' })
}

exec('npm run build')

console.log(
  '\ngzipped, the UMD build is ' + prettyBytes(
    gzipSize.sync(readFileSync('umd/HTTPClient.min.js'))
  )
)
