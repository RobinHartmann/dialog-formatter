# dialog-formatter
CLI app for extracting and formatting dialog scripts from `.docx` to `.txt`

![Usage](docs/images/usage.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

#### Software

* [Node.js](https://nodejs.org) - JavaScript run-time environment

#### VS Code Extensions

This project is intended to be used with Visual Studio Code and the following extensions are recommended:

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Integrates ESLint JavaScript into VS Code

## Deployment

### Prerequisites

* [textutil](https://ss64.com/osx/textutil.html) - Command line text utility
  * comes with OS X/macOS 10.4 or newer
* [Node.js](https://nodejs.org) - JavaScript run-time environment

### Installation and Usage

```bash
# run without installation
npx dialog-formatter

# install globally and run
npm i -g dialog-formatter && dialog-formatter

# install locally and run
npm i dialog-formatter && npx dialog-formatter
```

## Document Format

### Input `.docx`

* lines only containing whitespace are ignored
* if a line contains at least one tab, then the text after the last tab is interpreted as dialog
* otherwise the entire content of the line is interpreted as the name of the character currently speaking

#### Example

```
                  DEEP THOUGHT
21:42:30: Alright. The answer to the ultimate question ...

                  LUNKWILL
21:42:33: Yes ...

                  DEEP THOUGHT
21:42:35: ... of Life, the Universe, and Everything ...

                  FOOK
21:42:38: Yes!

                  DEEP THOUGHT
21:42:39: ... is ...

                  CROWD
21:42:41: Yes ...!

                  DEEP THOUGHT
21:42:42: Forty two.
```

### Output `.txt`

* each line of dialog from the input `.docx` produces one line in the output `.txt`
* each line has the format `<speaking-character>  <dialog>`
  * whitespace at the beginning and end of both the speaking character and the dialog are removed beforehand

#### Example

```
DEEP THOUGHT Alright. The answer to the ultimate question ...
LUNKWILL Yes ...
DEEP THOUGHT ... of Life, the Universe, and Everything ...
FOOK Yes!
DEEP THOUGHT ... is ...
CROWD Yes ...!
DEEP THOUGHT Forty two.
```

## Built With

* [meow](https://github.com/sindresorhus/meow) - CLI app helper
* [tmp](https://github.com/raszi/node-tmp) - Temporary file and directory creator for node.js

## Authors

* **Robin Hartmann** - *Initial work* - [robin-hartmann](https://github.com/robin-hartmann)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
