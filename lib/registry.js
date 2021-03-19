module.exports = {
  addRegisterCallback,
  addLogStatisticsCallback,
  getLoggers,
  notifyLogStatistics,
  registerLogger,
  setLevelAll
};

const registeredLoggers = [];
const callbacks = [];
const statsCallback = [];
let globalLevel;

function addRegisterCallback(callback) {
  callbacks.push(callback);
}

function addLogStatisticsCallback(callback){
  statsCallback.push(callback);
}

function notifyLogStatistics(name, level) {
  statsCallback.forEach(callback => {
    if (isFunction(callback)) {
      callback(name, level);
    }
  });
}

function registerLogger(logger) {
  registeredLoggers.push(logger);
  if (globalLevel) {
    logger.setLevel(globalLevel);
  }
  // notify callbacks
  callbacks.forEach(callback => {
    if (isFunction(callback)) {
      callback(logger);
    }
  });
}

function getLoggers() {
  return registeredLoggers;
}

function setLevelAll(level) {
  registeredLoggers.forEach(logger => {
    logger.setLevel(level);
  });
  globalLevel = level;
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
 }