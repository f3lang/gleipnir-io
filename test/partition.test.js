/* eslint-env and, mocha */
/* eslint-disable no-unused-vars */

const expect = require('chai').expect;
const Partition = require('../src/Partition/Partition');
const path = require('path');
const fs = require('fs');

let debug_env = process.env.DEBUG;
describe('Partition', function () {

	before(function () {
		process.env.DEBUG = '*,-not_this';
	});

	after(function () {
		process.env.DEBUG = debug_env;
	});

	describe('will init new file correctly', function () {
		return new Promise((resolve, reject) => {
			let proTest = new Promise((resolve, reject) => {resolve('testblubberblargh');});
			proTest.then(e => console.log(e));
			let targetPath = path.join(__dirname, 'partition', 'partition.test');
			fs.unlink(targetPath + '.store');
			let partition = new Partition(targetPath);
			partition.getHeader().then(header => console.log(header)).catch(err => console.log(err));
			expect(fs.existsSync(targetPath + '.store')).to.equal(true);
		});
		/*partition = new Partition(targetPath);
		partition.getHeader().then(header => console.log(header)).catch(err => console.log(err));
		partition.close();*/
		//fs.unlink(targetPath + '.store');
	});
});