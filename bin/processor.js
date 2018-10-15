'use strict';

const textract = require('textract');
const fs = require('fs');

const TEXTTRACT_CONFIG = { preserveLineBreaks: true };

const DIALOG_PREFIX_REGEX = /^\d\d:\d\d\s*/;
const ONLY_WHITESPACE_REGEX = /^\s*$/;

const LINE_SEPARATOR = '\n';
const CHARACTER_TO_DIALOG_SEPARATOR = '\t';

const read = async (inputFile) => new Promise((resolve, reject) =>
    textract.fromFileWithPath(inputFile, TEXTTRACT_CONFIG, (err, text) =>
        err
            ? reject('Could not extract text from input file, because of the following error:\n' + err.message)
            : resolve(text)
    )
);

const write = (outputFile) => (text) => new Promise((resolve, reject) =>
    fs.writeFile(outputFile, text, (err) =>
        err
            ? reject('Could not write output file, because of the following error:\n' + err.message)
            : resolve()
    )
);

const format = (text) => {
    const originalLines = text.split(LINE_SEPARATOR);
    const formattedLines = [];
    let currentChar;

    for (const line of originalLines) {
        if (ONLY_WHITESPACE_REGEX.test(line)) {
            continue;
        } 
        
        if (DIALOG_PREFIX_REGEX.test(line)) {
            if (!currentChar) {
                currentChar = 'NO_CHARACTER_FOUND';
            }

            const newDialogPrefix = currentChar + CHARACTER_TO_DIALOG_SEPARATOR;

            formattedLines.push(line.replace(DIALOG_PREFIX_REGEX, newDialogPrefix));
        } else {
            currentChar = line;
        }
    }

    return formattedLines.join(LINE_SEPARATOR);
};

module.exports = (input, output) =>
    read(input)
        .then(format)
        .then(write(output));