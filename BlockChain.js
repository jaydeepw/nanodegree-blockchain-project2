/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.levelDBWrapper = new LevelSandbox.LevelSandbox();
        this.checkThenAddGenesisBlock();
    }

    // Check if the genesis block does not exist already in the Blockchain
    // else add.
    checkThenAddGenesisBlock() {
        let self = this;
        this.levelDBWrapper.getBlocksCount().then((count) => {
            if(count == 0) {
                console.log("Adding GENESIS block");
                this.addGenesisBlock();
            } else {
                console.log("Genesis block exists. Not adding!");
            }
        }).catch((err) => {
            console.log(err);
        });;
    }

    /**
     * Create an in-memory genesis block.
     */
    getGenesisBlock() {
        const block = new Block.Block("GENESIS BLOCK");
        block.time = new Date().getTime();
        block.height = 0;
        // not setting previousBlockHash, as it will be empty for
        // Genesis block
        block.hash = SHA256(JSON.stringify(block)).toString();
        return block;
    }

    /**
     * Add genesis/first block to the blockchain
     */
    addGenesisBlock() {
        const block = this.getGenesisBlock();

        // uncomment below test our block representation by logging it
        // on the console.
        // console.log(JSON.stringify(block));
        this.levelDBWrapper.addLevelDBData(block.height, block).then((message) => {
            console.log(message);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Get block height, it is auxiliar method that return the height of the blockchain
    getBlockHeight() {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.levelDBWrapper.getBlocksCount().then((count) => {
                let height = count - 1;
                // height will be one less than the count of blocks
                resolve(height);
            }).catch((err) => {
                reject(err);
            });    
        });        
    }

    // Add new block
    addBlock(block) {
        // Add your code here
        console.log(block);
    }

    // Get Block By Height
    getBlock(height) {
        return this.levelDBWrapper.getLevelDBData(height);
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
    }

    // Validate Blockchain
    validateChain() {
        // Add your code here
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;