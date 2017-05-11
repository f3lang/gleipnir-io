class PartitionIndex {

	constructor(filename, partition) {
		this.filename = filename;
		this.partition = partition;
	}

	getObjectPositionAndSize(objectIndex) {
		return new Promise((resolve, reject) => {
			resolve({position: 0, length: 0});
		});
	}

	getObjectPositionAndSizeSync() {
		return {position: 0, length: 0};
	}

}

module.exports = PartitionIndex;