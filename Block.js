/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data) {
		// this is to hold the hash of the current block
		this.hash = "";
		// holds the data in the block. Like transactions in this block
		// However, it can be any data.
		this.body = data;
		// Height = # of blocks before this block in the blockchain.
		this.height = 0;
		// timestamp from the epoch 1st Jan 1970
		// in milliseconds
		this.time = 0;
		// hash of previous block
        this.previousBlockHash = "";
	}
}

module.exports.Block = Block;