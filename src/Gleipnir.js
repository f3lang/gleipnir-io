const filesizeParser = require('filesize-parser');
const uuid = require('uuid').v4;
const debug = require('debug')('gleipnir');

/**
 * Gleipnir. The fast and consistent object storage.
 *
 * Gleipnir creates multiple files in order to optimize read and writes. When you initialize it, you have to commit
 * a filenamePrefix. With this prefix, the storage will be created.
 * E.g.: If you define the filenamePrefix as "/home/foo/gleipnirIsAwesome/mystorage", just use the standard id index
 * and partitioning (in this case we have now a total of 2 partitions), it will create these files:
 * - The configuration file: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.conf
 * - The object index: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.id.idx
 * - The partition index for partition 1: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.p1.idx
 * - The partition index for partition 2: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.p2.idx
 * - The storage map for partition 1: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.p1.map
 * - The storage map for partition 2: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.p2.map
 * - The storage for partition 1: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.p1.store
 * - The storage for partition 1: /home/foo/gleipnirIsAwesome/mystorage.gleipnir.p2.store
 */
class Gleipnir {

	/**
	 * @param {string} filenamePrefix The prefix of the files to save. Must include a full file path.
	 * @param {object} options Options for the initialization of gleipnir.
	 * @param {array} [options.indexes=['id']] An array of object properties to create an index on
	 * @param {boolean} [options.forceIndexes=true] Force the creation of an index over the defined index properties.
	 * If you try to add an object, that doesn't include all of the index properties, it will be rejected.
	 * @param {boolean} [options.checksum=false] Creates a checksum over the datafiles in order to check for
	 * corrupted files. Only use this, when you handle few data.
	 * This will get slow very soon, if you handle more and more data.
	 * @param {string} [options.partitionSize="0b"] Defines the maximum size of a single partition.
	 * "0b" means no partitioning at all. The partition size should be at least the size of your biggest object.
	 * Else, the partition with this object will exceed the defined limit.
	 */
	constructor(filenamePrefix, options) {
		this.prefix = filenamePrefix;
		// Check first, if the storage already exists. We do this by checking, if the storage description exists.
		// If the storage description exists, we validate

		this.indexes = options.indexes || ['id'];
		this.forceIndexes = options.forceIndexes || true;
		this.checksum = options.checksum || false;
		this.partitionSize = filesizeParser(options.partitionSize) || 0;

	}

	ensureIndex(idx) {

	}

	addObject(object, upsert = false) {
		return new Promise((resolve, reject) => {
			if (object.__gleipnirId && !upsert) {
				let message = 'Object with gleipnirId ' + object.__gleipnirId + ' is already in storage and upsert ' +
					'is set to false. Please use gleipnir.update(object) or set upsert to true.';
				reject(message);
				debug(message);
			}
			let objectKeys = Object.keys(object);
			let missingKey = this.indexes.find(key => objectKeys.indexOf(key) < 0);
			if (this.forceIndexes && missingKey) {
				let message = 'Object is missing the keys' +
					JSON.stringify(this.indexes.reduce(
						(missingKeys, key) => {
							if (objectKeys.indexOf(key) < 0) {
								missingKeys.push(key);
							}
							return missingKeys;
						},
						{}
					)) + '. Index enforcing is enabled in this storage. Adding an Object which doesn\'t include ' +
					'all indexed fields is not possible in this mode.';
				reject(message);
				debug(message);
			}
			if (!object.__gleipnirId) {
				object.__gleipnirId = uuid();
				resolve(this.__appendObjectToStorage(object));
			} else {
				resolve(this.__updateObjectInStorage(object));
			}
		});
	}

	addObjectSync(object, upsert = false) {

	}

	getObject() {
		let obj = {};
		delete obj.__gleipnirId;
	}

	getObjectSync() {

	}

	__appendObjectToStorage(object) {

	}

	__updateObjectInStorage(object) {

	}

	__retrieveObjectFromStorage(index){

	}

}

module.exports = Gleipnir;