/* eslint-disable no-console */
const fs = require('fs');
const StorageMap = require('./StorageMap');
const PartitionIndex = require('./PartitionIndex');
const config = require('config');
const debug = require('debug')('gleipnir/Partition');

class Partition {

	constructor(fileprefix) {
		let headerMagic = {
			application: 'gleipnir',
			type: 'partition',
			version: config.get('partition.version'),
			compression: 'gzip'
		};
		let filename = fileprefix + '.store';
		let proTest = new Promise(function(resolve, reject) {resolve('blubberblargh');});
		proTest.then(function(e){console.log(e);});
		this.whenFileReady = new Promise((resolve, reject) => {
			resolve('blubberschurb');
			try {
				let file = fs.openSync(filename, 'r+');
				resolve(file);
			} catch (err) {
				if (err.code === 'ENOENT') {
					let headerBuffer = Buffer.from(JSON.stringify(headerMagic));
					let headerMagicBuffer = Buffer.alloc(headerBuffer.length + 4);
					headerMagicBuffer.writeInt32BE(headerBuffer.length);
					headerMagicBuffer.fill(headerBuffer, 4);
					try {
						fs.writeFileSync(filename, headerMagicBuffer);
						let file = fs.openSync(filename, 'r+');
						console.log('done with file', file);
						resolve(file);
						console.log('resolved file', file);
					} catch (err2) {
						console.log('error with file', err2);
						debug(err2);
						reject(err2);
					}
				} else {
					debug(err);
					reject(err);
				}
			}
		});
		this.whenFileReady.then(file => console.log('file:', file)).catch(err => console.log(err))
		this.map = new StorageMap(fileprefix + '.map', this);
		this.index = new PartitionIndex(fileprefix + '.map', this);
	}

	getHeader() {
		return new Promise((resolve, reject) => {
			this.whenFileReady.then(file => {
				console.log(file);
				let headerSizeBuffer = Buffer.alloc(4);
				fs.readSync(file, headerSizeBuffer, 0, 4, 0);
				console.log(headerSizeBuffer);
				console.log(headerSizeBuffer.readInt32BE());
				let headerBuffer = Buffer.alloc(headerSizeBuffer.readInt32BE());
				fs.readSync(file, headerBuffer, 0, headerBuffer.length, 4);
				resolve(headerBuffer.toString());
			});
		});
	}

	retrieveObject(objectKey) {
		return this.index.getObjectPositionAndSize(objectKey).then(position => this.__retrieveData(position));
	}

	insertObject(object) {

	}

	__retrieveData({position, length}) {
	}

	__writeData({data, position}) {
	}

	close() {
		this.whenFileReady.then(file => fs.close(file));
	}

}

module.exports = Partition;