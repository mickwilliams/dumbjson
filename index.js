'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Dumb json lets you be dumb with json
 * Anything before the first { or [ or " are treated as a comment and ignored
 * Don't use { [ " or ' in your comments or they will be parsed
 **/
const { readFile, writeFile, exists } = require('fs');
const { EOL } = require('os');
const path = require('path');
const curlyBracketRe = new RegExp('{', 'g');
const squareBracketRe = /\[/;
const quoteRe = new RegExp('"', 'g');
const singleQuoteRe = new RegExp(`'`, 'g');
function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            return exists(filePath, (doesExist) => {
                return resolve(doesExist);
            });
        });
    });
}
function allFileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let fullPath = path.resolve(filePath);
        let thisFileExists = false;
        try {
            thisFileExists = yield fileExists(fullPath);
        }
        catch (err) {
            throw err;
        }
        if (!thisFileExists && filePath.indexOf('.djson') === -1) {
            try {
                thisFileExists = yield fileExists(`${fullPath}.djson`);
            }
            catch (err) {
                throw err;
            }
        }
        if (!thisFileExists && filePath.indexOf('.json') === -1) {
            try {
                thisFileExists = yield fileExists(`${fullPath}.json`);
            }
            catch (err) {
                throw err;
            }
        }
        return thisFileExists;
    });
}
function hasDataStart(line) {
    let lineChar;
    for (let i = 0; i < line.length; i++) {
        lineChar = line.charAt(i);
        if (lineChar.match(curlyBracketRe)
            || lineChar.match(squareBracketRe)
            || lineChar.match(quoteRe)) {
            return true;
        }
    }
    return false;
}
module.exports.read = function read(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileData;
        let lineChar;
        let thisFileExists = false;
        let dataArr = [];
        let dataStr;
        let atData = false;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            thisFileExists = allFileExists(filePath);
            if (!thisFileExists) {
                return reject(new Error(`This file does not exist: ${filePath}`));
            }
            return readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                fileData = data.split(EOL);
                for (let line of fileData) {
                    if (!atData && hasDataStart(line)) {
                        atData = true;
                    }
                    if (atData) {
                        dataArr.push(line);
                    }
                }
                dataStr = dataArr.join(EOL);
                return resolve(JSON.parse(dataStr));
            });
        }));
    });
};
module.exports.comment = function read(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileData;
        let lineChar;
        let thisFileExists = false;
        let commentArr = [];
        let commentStr;
        let i = 0;
        let atData = false;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            thisFileExists = allFileExists(filePath);
            if (!thisFileExists) {
                return reject(new Error(`This file does not exist: ${filePath}`));
            }
            return readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                fileData = data.split(EOL);
                for (let line of fileData) {
                    if (!atData && hasDataStart(line)) {
                        atData = true;
                    }
                    if (!atData) {
                        commentArr.push(line);
                    }
                }
                commentStr = commentArr.join(EOL);
                return resolve(commentStr);
            });
        }));
    });
};
module.exports.write = function write(filePath, content, comment = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const strContent = JSON.stringify(content, null, '\t');
        const fileData = (comment + '') + EOL + strContent;
        return new Promise((resolve, reject) => {
            return writeFile(filePath, fileData, 'utf8', (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    });
};
