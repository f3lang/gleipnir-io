class StorageMap {

	constructor(filename, partition) {
		this.filename = filename;
		this.partition = partition;
	}

	/**
	 *
	 * @param {Buffer} data
	 */
	getFreePosition(data) {
		return new Promise((resolve, reject) => {
			resolve({position: 0});
		});
	}

	fillPosition({postition, length}) {

	}

	addEmptyPosition({position, length}){

	}

}

module.exports = StorageMap;