const fs = require('fs');
const path = require('path');

module.exports.parseArguments = function(argv) {
  let harContent = null;
  let justLog = false;

  if (argv[2]) {
    harContent = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv[2])));
  }

  if (Array.from(argv).find(item => item === '--log')) {
    justLog = true;
  }

  return {
    harContent,
    justLog
  }
}
