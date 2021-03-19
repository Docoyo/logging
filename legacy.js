const Logger = require('./lib/logger.js');

module.exports = function(name){
  return new Logger(name);
}
