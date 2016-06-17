const readFileSync = require('fs').readFileSync
const execSync = require('child_process').execSync
const inInstall = require('in-publish').inInstall
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

if (inInstall())
  process.exit(0)

const exec = (command) =>
  execSync(command, { stdio: 'inherit' })

exec('npm run build-cjs')
exec('npm run build-umd')
exec('npm run build-min')

console.log(
  '\ngzipped, the UMD build is ' + prettyBytes(
    gzipSize.sync(readFileSync('umd/http-client.min.js'))
  )
)
