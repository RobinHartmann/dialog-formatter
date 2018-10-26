'use strict';

const { promisify } = require('util');
const { tmpNameSync } = require('tmp');
const { readFileSync, unlinkSync, writeFileSync } = require('fs');

const exec = promisify(require('child_process').exec);

const FS_OPTIONS = { encoding: 'utf8' };

const LINE_SEPARATOR_REGEX = /\r?\n/;
const ONLY_WHITESPACE_REGEX = /^\s*$/;
const DIALOG_PREFIX_REGEX = /[^\t]*\t+/;

const LINE_SEPARATOR = '\n';
const CHARACTER_TO_DIALOG_SEPARATOR = '\t';

const convert = async (inputFile) => {
  const messageLines = [
    'could not convert input file to a txt file using textutil:',
  ];
  const tmpFile = tmpNameSync();
  let execResult;

  try {
    execResult = await exec(`textutil -convert txt ${inputFile} -output ${tmpFile}`);
  } catch (err) {
    messageLines.push(...[
      `error code ${err.status}:`,
      err.stderr.trim(),
    ]);

    throw new Error(messageLines.join('\n'));
  }

  if (execResult.stderr) {
    messageLines.push(...[
      execResult.stderr.trim(),
    ]);

    throw new Error(messageLines.join('\n'));
  }

  return tmpFile;
};

const consume = (tmpFile) => {
  let text;

  try {
    text = readFileSync(tmpFile, FS_OPTIONS);
  } catch (err) {
    throw new Error(`could not read converted txt file:\n${err}`);
  }

  try {
    unlinkSync(tmpFile);
  } catch (err) {
    console.warn(`could not clean up temporary converted text file at the following location:\n${tmpFile}`);
  }

  return text;
};

const format = (text) => {
  const originalLines = text.split(LINE_SEPARATOR_REGEX);
  const formattedLines = [];
  let currentChar;

  originalLines.forEach((line) => {
    if (ONLY_WHITESPACE_REGEX.test(line)) {
      return;
    }

    if (DIALOG_PREFIX_REGEX.test(line)) {
      if (!currentChar) {
        currentChar = 'NO_CHARACTER_FOUND';
      }

      const newDialogPrefix = currentChar + CHARACTER_TO_DIALOG_SEPARATOR;
      const newLine = line.replace(DIALOG_PREFIX_REGEX, newDialogPrefix);

      formattedLines.push(newLine.trim());
    } else {
      currentChar = line.trim();
    }
  });

  return formattedLines.join(LINE_SEPARATOR);
};

const write = outputFile => (formattedText) => {
  try {
    writeFileSync(outputFile, formattedText);
  } catch (err) {
    throw new Error(`could not write formatted text to output file:\n${err}`);
  }
};

module.exports = (inputFile, outputFile) => convert(inputFile)
  .then(consume)
  .then(format)
  .then(write(outputFile));
