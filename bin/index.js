#!/usr/bin/env node

'use strict';

const meow = require('meow');
const runProcessor = require('./processor');

const parseArgs = async () => {
  const cli = meow(`
  Usage
    $ dialog-formatter <input> <output>

  Example
    $ dialog-formatter input.docx output.txt`);
  const config = {
    input: cli.input[0],
    output: cli.input[1],
  };
  const errors = [];

  if (!config.input) {
    errors.push('input must be specified');
  }

  if (!config.output) {
    errors.push('output must be specified');
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    console.log(cli.help);
    process.exit(1);
  }

  return config;
};

parseArgs()
  .then((config) => {
    console.log('running formatter...');
    return runProcessor(config.input, config.output);
  })
  .then(() => console.log('formatter finished successfully'))
  .catch((reason) => {
    console.error(reason.message);
    process.exit(1);
  });
