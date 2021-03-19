"use strict";

const path = require("path");

const LOG_LEVELS = [
  "disabled",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
];
const DISPLAY_LEVELS = [
  "DISABLED",
  "FATAL",
  "ERROR",
  "WARN ",
  "INFO ",
  "DEBUG",
  "TRACE",
];
const LEVEL_BY_NAME = createLevelMap();

const chalk = require("chalk");

chalk.level = 2; // Force coloring for Docker logs

const CHALK_BY_LEVEL = [
  {
    chalk: chalk.white,
  },
  {
    chalk: chalk.red.bold,
  },
  {
    chalk: chalk.red,
  },
  {
    chalk: chalk.yellow,
  },
  {
    chalk: chalk.green,
  },
  {
    chalk: chalk.magenta,
  },
  {
    chalk: chalk.cyan,
  },
];

/**
 * Internal helper function to create a fast lookup table for the log levels
 */
function createLevelMap() {
  let levelMap = {};
  for (let index = 0; index < LOG_LEVELS.length; index++) {
    const name = LOG_LEVELS[index];
    levelMap[name] = index;
  }
  return levelMap;
}

const DEFAULT_LOG_LEVEL = "info";
const registry = require("./registry.js");

function log(name, targetLogLevel, ...args) {
  if (typeof(window) == 'undefined') {
    console.log(
      CHALK_BY_LEVEL[targetLogLevel].chalk(formatDate(new Date())),
      CHALK_BY_LEVEL[targetLogLevel].chalk(`${DISPLAY_LEVELS[targetLogLevel]}`),
      CHALK_BY_LEVEL[targetLogLevel].chalk(`${name} -`),
      ...args
    );
    registry.notifyLogStatistics(name, LOG_LEVELS[targetLogLevel])
  } else {
    console.log(
      CHALK_BY_LEVEL[targetLogLevel].chalk(formatShortTime(new Date())),
      `${DISPLAY_LEVELS[targetLogLevel]} ${name} -`,
      ...args
    );
  
  }
}

/**
 * This Logger class is the external interface to the logger.
 */
class Logger {
  constructor(name = "unnamed", initialLogLevel = "info") {
    this.setLevel(initialLogLevel);
    this.name = name;
    registry.registerLogger(this);
  }

  /**
   * Extends the logger's name based on the specified file name. The path and file extension will be removed.
   * @param {string} fileName absolute path or just file name
   */
  extendNameByFile(fileName) {
    this.name =
      this.name + "." + path.basename(fileName).replace(/\.ts$|\.js$/, "");
    return this;
  }

  setLevel(levelName) {
    let _level = (levelName && levelName.toLowerCase()) || DEFAULT_LOG_LEVEL;
    this.level =
      LEVEL_BY_NAME[_level] !== undefined
        ? LEVEL_BY_NAME[_level]
        : LEVEL_BY_NAME["info"];
  }

  getLevelName() {
    return LOG_LEVELS[this.level];
  }

  trace(...args) {
    if (this.level >= LEVEL_BY_NAME.trace) {
      log(this.name, LEVEL_BY_NAME.trace, ...args);
    }
  }

  debug(...args) {
    if (this.level >= LEVEL_BY_NAME.debug) {
      log(this.name, LEVEL_BY_NAME.debug, ...args);
    }
  }

  info(...args) {
    if (this.level >= LEVEL_BY_NAME.info) {
      log(this.name, LEVEL_BY_NAME.info, ...args);
    }
  }

  warn(...args) {
    if (this.level >= LEVEL_BY_NAME.warn) {
      log(this.name, LEVEL_BY_NAME.warn, ...args);
    }
  }

  error(...args) {
    if (this.level >= LEVEL_BY_NAME.error) {
      log(this.name, LEVEL_BY_NAME.error, ...args);
    }
  }

  fatal(...args) {
    if (this.level >= LEVEL_BY_NAME.fatal) {
      log(this.name, LEVEL_BY_NAME.fatal, ...args);
    }
  }
}

function formatDate(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    "." +
    pad(date.getMilliseconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
}

function formatShortTime(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };
  return (
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    "." +
    pad(date.getMilliseconds())
  );
}

module.exports = Logger;

