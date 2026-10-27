const debug = require("debug")("EleventySass");
const { red } = require("kleur");

let pluginClean;

let isEnabled = false;

let outputPathMap = new Map();

const updateFileRecord = (inputPath) => {
  if (!isEnabled)
    return;

  let outputPath = outputPathMap.get(inputPath);
  if (outputPath)
    updateFileRecord(outputPath, inputPath);
};

const createOrUpdateFileRecord = (outputPath, inputPath) => {
  if (!isEnabled)
    return;

  if (!outputPathMap.get(inputPath))
    updateFileRecord(outputPath, inputPath);
  outputPathMap.set(inputPath, outputPath);
};

const clean = {
  enabled: () => isEnabled,
  setEnabled: async (newValue) => {
    debug(`clean.enabled = ${ newValue }`);
    if (newValue) {
      try {
        pluginClean = require("eleventy-plugin-clean");
      } catch {
        try {
          pluginClean = await import("eleventy-plugin-clean");
        } catch(e) {
          console.error(red(`eleventy-sass failed to enable cleaning. ${ e }`));
          newValue = false;
        }
      }
    } else {
      outputPathMap.clear();
    }
    isEnabled = newValue;
  },
  updateFileRecord,
  createOrUpdateFileRecord
};

module.exports = clean;
