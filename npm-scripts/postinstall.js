var stat = require('fs').stat
var execSync = require('child_process').execSync

stat('lib', function (error, stat) {
  if (error || !stat.isDirectory())
    execSync('npm run build', { stdio: 'inherit' })
})
