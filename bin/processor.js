'use strict';

const textract = require('textract');
const fs = require('fs');

const TEXTTRACT_CONFIG = { preserveLineBreaks: true };

const LINE_SEPARATOR_REGEX = /\r?\n/;
const ONLY_WHITESPACE_REGEX = /^\s*$/;
const DIALOG_PREFIX_REGEX = /^(\s*\d+[.:]\d+(\s*[-–]\s*\d+[.:]\d+)?\s*)|(\s+(?=\S+))/;

const LINE_SEPARATOR = '\n';
const CHARACTER_TO_DIALOG_SEPARATOR = '\t';

const read = async (inputFile) => new Promise((resolve, reject) =>
    textract.fromFileWithPath(inputFile, TEXTTRACT_CONFIG, (err, text) =>
        err
            ? reject(new Error('could not extract text from input file, because of the following error:\n' + err.message))
            : resolve(text)
    )
);

const write = (outputFile) => (text) => new Promise((resolve, reject) =>
    fs.writeFile(outputFile, text, (err) =>
        err
            ? reject(new Error('could not write output file, because of the following error:\n' + err.message))
            : resolve()
    )
);

const format = (text) => {
    const originalLines = text.split(LINE_SEPARATOR_REGEX);
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
            const newLine = line.replace(DIALOG_PREFIX_REGEX, newDialogPrefix)

            formattedLines.push(newLine.trim());
        } else {
            currentChar = line.trim();
        }
    }

    return formattedLines.join(LINE_SEPARATOR);
};

module.exports = (input, output) =>
    read(input)
        .then(format)
        .then(write(output));