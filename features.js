module.exports = (function featuresFn() {
  'use strict';

  var fs = require('fs');
  var config = require('./config');

  function features(callback) {
    return fs.readdir(config.base, function readdir(err, files) {
      callback(files.map(reviewFile));
    });
  }

  function analize(info) {
    var featureMatch = info.content.match(/Feature: /g);
    var scenarioMatch = info.content.match(/Scenario: /g);
    var stepsMatch = info.content.match(/Given |And |When |Then /g);
    var describeMatch = info.content.match(/describe\('/g);
    var itMatch = info.content.match(/it\('/g);
    info.features = featureMatch ? featureMatch.length : 0;
    info.scenarios = scenarioMatch ? scenarioMatch.length : 0;
    info.steps = stepsMatch ? stepsMatch.length : 0;
    info.describes = describeMatch ? describeMatch.length : 0;
    info.its = itMatch ? itMatch.length : 0;
    return info;
  }

  function reviewFile(name) {
    var path = config.base + name;
    var stats = fs.statSync(path);
    var isDir = stats.isDirectory();
    var info = {
      name: name,
      stats: stats,
      isDir: isDir,
      content: '',
      features: 0,
      scenarios: 0,
      steps: 0,
      describes: 0,
      its: 0
    };

    if (isDir) {
      return info;
    }

    info.content = fs.readFileSync(path, { encoding: 'utf8' });
    return analize(info);
  }

  return features;
})();
