'use strict'

/**
 * Dumb json lets you be dumb with json
 * Anything before the first { or [ or " are treated as a comment and ignored
 * Don't use { [ " or ' in your comments or they will be parsed
 **/

const { readFile, writeFile, exists } = require('fs')
const { EOL } = require('os')
const path = require('path')

 const curlyBracketRe = new RegExp('{', 'g')
 const squareBracketRe = /\[/
 const quoteRe = new RegExp('"', 'g')
 const singleQuoteRe = new RegExp(`'`, 'g')

 async function fileExists (filePath : string) {
 	return new Promise((resolve : any, reject : any) => {
 		return exists(filePath, (doesExist : boolean) => {
 			return resolve(doesExist)
 		})
 	})
 }

 async function allFileExists (filePath : string) {
	let fullPath : string = path.resolve(filePath)
 	let thisFileExists : any = false

	try {
		thisFileExists = await fileExists(fullPath)
	} catch (err) {
		throw err
	}
	if (!thisFileExists && filePath.indexOf('.djson') === -1) {
		try {
			thisFileExists = await fileExists(`${fullPath}.djson`)
		} catch (err) {
			throw err
		}
	}
	if (!thisFileExists && filePath.indexOf('.json') === -1) {
		try {
			thisFileExists = await fileExists(`${fullPath}.json`)
		} catch (err) {
			throw err
		}
	}
	return thisFileExists
 }

 function hasDataStart (line : string) {
 	let lineChar : string;
	for (let i : number = 0; i < line.length; i++) {
		lineChar = line.charAt(i)
		if (lineChar.match(curlyBracketRe)
			|| lineChar.match(squareBracketRe)
			|| lineChar.match(quoteRe) ) {
			return true
		} 
	}
	return false
 }

module.exports.read = async function read (filePath : string) {
	let fileData : string[]
	let lineChar : any
	let thisFileExists : any = false
	let dataArr : string[] = []
	let dataStr : string;
	let atData : boolean = false

	return new Promise(async (resolve : any, reject : any) => {
		thisFileExists = allFileExists(filePath)
		if (!thisFileExists) {
			return reject(new Error(`This file does not exist: ${filePath}`))
		}
		return readFile(filePath, 'utf8', (err : Error, data : string) => {
			if (err) {
				return reject(err)
			}
			fileData = data.split(EOL)
			for (let line of fileData) {
				if (!atData && hasDataStart(line)) {
					atData = true;
				}
				if (atData) {
					dataArr.push(line)
				}
			}
			dataStr = dataArr.join(EOL)
			return resolve(JSON.parse(dataStr))
		})
	})
}

module.exports.comment = async function read (filePath : string) {
	let fileData : string[]
	let lineChar : any
	let thisFileExists : any = false
	let commentArr : string[] = []
	let commentStr : string;
	let i : number = 0
	let atData : boolean = false

	return new Promise(async (resolve : any, reject : any) => {
		thisFileExists = allFileExists(filePath)
		if (!thisFileExists) {
			return reject(new Error(`This file does not exist: ${filePath}`))
		}
		return readFile(filePath, 'utf8', (err : Error, data : string) => {
			if (err) {
				return reject(err)
			}
			fileData = data.split(EOL)
			for (let line of fileData) {
				if (!atData && hasDataStart(line)) {
					atData = true;
				}
				if (!atData) {
					commentArr.push(line)
				}
			}
			commentStr = commentArr.join(EOL)
			return resolve(commentStr)
		})
	})
}

module.exports.write = async function write (filePath : string, content : any, comment : string = '') {
	const strContent : string = JSON.stringify(content, null, '\t')
	const fileData : string = (comment + '') + EOL + strContent
	return new Promise ((resolve : any, reject : any) => {
		return writeFile(filePath, fileData, 'utf8', (err : Error, res : any) => {
			if (err) {
				return reject(err)
			}
			return resolve(true)
		})
	})
}
