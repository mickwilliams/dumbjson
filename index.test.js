'use strict'

const djson = require('./index.js')
const fs = require('fs')
const execRaw = require('child_process').exec

async function exec (cmd) {
	return new Promise((resolve, reject) => {
		return execRaw(cmd, (err, stdio, stderr) => {
			if (err) return reject(err)
			return resolve(stdio)
		})
	})
}

async function mktemp () {
	const cmd = 'mktemp'
	let tmp
	try {
		tmp = await exec(cmd)
	} catch (err) {
		log.error('Error getting temporary file')
	}
	return tmp
}

async function write (filePath, fileData) {
    return new Promise((resolve, reject) => {
        return fs.writeFile(filePath, fileData, 'utf8', (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
}

async function read (filePath) {
	return new Promise((resolve, reject) => {
		return fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return reject(err)
			}
			return resolve(data)
		})
	})
}

const objTest = `
This is comment data above an object

{
	"a" : true
}
`

const objTest2 = `
{
	"a": true
}`

const arrTest = `
This is comment data above an array.
This too

[
	true
]
`

const arrTest2 = `
[
	true
]`

const strTest = `
This is comment data above a string.
This too
Also this 

"string"
`

const strTest2 = `
"string"`

test('djson contains read method when imported', () => {
	expect(typeof djson.read).toBe('function')
})

test('djson contains write method when imported', () => {
	expect(typeof djson.write).toBe('function')
})

test('djson contains comment method when imported', () => {
	expect(typeof djson.comment).toBe('function')
})

/* djson.read (without djson.write) */

test('djson reads a file with comments above an object', async () =>{
	const tmp = await mktemp()
	await write(tmp, objTest)
	const obj = await djson.read(tmp)
	expect(obj.a).toBe(true)
})

test('djson reads a file with comments above an array', async () =>{
	const tmp = await mktemp()
	await write(tmp, arrTest)
	const arr = await djson.read(tmp)
	expect(arr[0]).toBe(true)
})

test('djson reads a file with comments above a string', async () =>{
	const tmp = await mktemp()
	await write(tmp, strTest)
	const arr = await djson.read(tmp)
	expect(arr).toBe('string')
})

/* djson.write (without djson.read) */

test('djson writes a file with an object as input', async () =>{
	const tmp = await mktemp()
	const obj = { a : true }
	let testStr
	await djson.write(tmp, obj)
	testStr = await read(tmp)
	expect(testStr).toBe(objTest2)
})

test('djson writes a file with array as input', async () =>{
	const tmp = await mktemp()
	const arr = [ true ]
	let testStr
	await djson.write(tmp, arr)
	testStr = await read(tmp)
	expect(testStr).toBe(arrTest2)
})

test('djson writes a file with string as input', async () =>{
	const tmp = await mktemp()
	const str = 'string'
	let testStr
	await djson.write(tmp, str)
	testStr = await read(tmp)
	expect(testStr).toBe(strTest2)
})

/* djson.write and djson.read */
test('djson writes a file with comments and reads object back', async () =>{
	const comment = 'This is my comment'
	const obj = { a : true }
	const tmp = await mktemp()
	let testObj
	await djson.write(tmp, obj, comment)
	testObj = await djson.read(tmp)
	expect(typeof testObj).toBe('object')
	expect(testObj.a).toBe(true)
})

test('djson writes a file with comments and reads array back', async () =>{
	const comment = `This is comment data above an array.
This too`
	const arr = [ true ]
	const tmp = await mktemp()
	let testArr
	await djson.write(tmp, arr, comment)
	testArr = await djson.read(tmp)
	expect(typeof testArr).toBe('object')
	expect(testArr[0]).toBe(true)
})

test('djson writes a file with comments and reads string back', async () =>{
	const comment = `This is comment data above a string.
This too
Also this`
	const str = `string`
	const tmp = await mktemp()
	let testStr
	await djson.write(tmp, str, comment)
	testStr = await djson.read(tmp)
	expect(typeof testStr).toBe('string')
	expect(testStr).toBe(str)
})
/* djson.write and djson.comment*/

test('djson writes a file with comments above an object', async () =>{
	const comment = 'This is my comment'
	const obj = { a : true }
	const tmp = await mktemp()
	let testComment
	await djson.write(tmp, obj, comment)
	testComment = await djson.comment(tmp)
	expect(testComment).toBe(comment)
})

test('djson writes a file with comments above an array', async () =>{
	const comment = `This is comment data above an array.
This too`
	const arr = [ true ]
	const tmp = await mktemp()
	let testComment
	await djson.write(tmp, arr, comment)
	testComment = await djson.comment(tmp)
	expect(testComment).toBe(comment)
})

test('djson writes a file with comments above an string', async () =>{
	const comment = `This is comment data above a string.
This too
Also this`
	const str = `string`
	const tmp = await mktemp()
	let testComment
	await djson.write(tmp, str, comment)
	testComment = await djson.comment(tmp)
	expect(testComment).toBe(comment)
})
