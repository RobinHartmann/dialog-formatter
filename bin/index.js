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
    const errors = [];

    if (!config.input) {
        errors.push('input must be specified');
    }

    if (!config.output) {
        errors.push('output must be specified');
    }

    if (errors.length) {
        console.error(errors.join('\n'))
        console.log(cli.help);
        process.exit(1);
    }

    return config;
}

parseArgs(helpMessage)
    .then((config) => {
        console.log('running formatter...');
        return runProcessor(config.input, config.output);
    })
    .then(() => console.log('formatter finished successfully'))
    .catch((reason) => {
        console.error(reason.message);
        process.exit(1);
    });