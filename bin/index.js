#!/usr/bin/env node
'use strict';

const meow = require('meow');
const runProcessor = require('./processor');

const helpMessage = `
    Usage
      $ index <input> <output>
 
    Example
      $ index input.docx output.txt
`;

const parseArgs = async (helpMessage) => {
    const cli = meow(helpMessage);
    const config = {
        input: cli.input[0],
        output: cli.input[1],
    };
    let areArgsValid = true;

    if (!config.input) {
        areArgsValid = false;
        console.error('Input must be specified');
    }

    if (!config.output) {
        areArgsValid = false;
        console.error('Output must be specified');
    }

    if (!areArgsValid) {
        console.log(cli.help);
        process.exit(1);
    }

    return config;
}

parseArgs(helpMessage)
    .then((config) => {
        console.log('Running formatter...');
        return runProcessor(config.input, config.output);
    })
    .then(() => console.log('Formatter finished successfully'))
    .catch((reason) => {
        console.error(reason);
        process.exit(1);
    });