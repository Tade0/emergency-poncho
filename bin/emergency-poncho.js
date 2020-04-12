#!/usr/bin/env node

const {parseArguments} = require('../src/cli');
const {main} = require('../src/index');

const arguments = parseArguments(process.argv);

main(arguments);
