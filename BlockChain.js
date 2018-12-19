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

    // Add new block to the chain.
    addBlock(block) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.getBlockHeight().then((height) => {
                console.log("height: " + height);
                if(height == -1) {
                    // height of a blockchain that does not have a single
                    // block will be -1;
                    // At this point, there SHOULD DEFINITELY be a 
                    // Genesis block inserted into the blockchain.
                    reject("fatal error! Invalid Height of the " +
                    "initialized blockchain. Height: " + height);

                    // add the genesis block if not exists in the chain.
                    self.addGenesisBlock();
                    // now the height of the chain will increase
                    height++;
                }

                // to get the previous block hash, we get previous block
                self.getBlock(height).then((previousBlock) => {
                    let previousBlockObject = JSON.parse(previousBlock);
                   // good to go. Now save it in low level storage.
                    block.height = height + 1;
                    block.time = new Date().getTime();
                    block.previousBlockHash = previousBlockObject.hash;
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    self.levelDBWrapper.addLevelDBData(block.height, block);
                    resolve(block); 
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.levelDBWrapper.getLevelDBData(height).then((block) => {
                if(block) {
                    resolve(block);
                } else {
                    reject("Invalid block");    
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.getBlock(height).then((block) => {
                // lets convert block to object.
                let blockFromChain = JSON.parse(block);

                // this will be the same block, but before its hash was set.
                // So we will have to copy values from chain's block to this one
                // WITHOUT setting the hash.
                let blockToCompare = new Block.Block(blockFromChain.body);
                // set hash to empty coz this was the state of the chain's block
                // before setting this hash property.
                blockToCompare.hash = "";

                // copy chain's block values.
                blockToCompare.time = blockFromChain.time;
                blockToCompare.height = blockFromChain.height;
                blockToCompare.previousBlockHash = blockFromChain.previousBlockHash;

                // now we have the hash of the block with empty hash property.
                let blockHash = SHA256(JSON.stringify(blockToCompare)).toString();
                /* console.log("blockHash: " + blockHash);
                console.log("block.hash: " + blockFromChain.hash); */
                if(!blockFromChain || !blockFromChain.hash) {
                    reject("Bad block for height: " + height);
                } else if(blockHash === blockFromChain.hash) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    // Validate Blockchain
    validateChain() {
        let self = this;
        return new Promise(function(resolve, reject) {
            let errorLog = [];
            // tried using Promise.all(promises).then((results) => { ... });
            // here but was not able to figure out how to use it.
            // Didnt spend too much time on making it work as I already
            // gave this project a lot of time. Went with a simpler approach.
            self.levelDBWrapper.getBlocksCount().then((count) => {
                console.log("Validating total " + count + " blocks!");
                for (let i = 0; i < count; i++) {
                    self.getBlock(i).then((block) => {
                        self.validateBlock(i).then((valid) => {
                            let previousBlockHash = null;
                            let currentBlockPrevHash = null;
                            let blockObject = JSON.parse(block);
                            currentBlockPrevHash = blockObject.previousBlockHash;
                            console.log("Block #" + i);
                            console.log("currentBlockPrevHash: " + currentBlockPrevHash);
                            console.log("previousBlockHash: " + previousBlockHash);
                            if(valid) {
                                console.log("valid block " + valid);
                                // now check the links between the blocks
                                if(i != 0) {
                                    // any block other than GENESIS block
                                    if(currentBlockPrevHash === previousBlockHash) {
                                        // valid link
                                        console.log("Valid link");
                                    } else {
                                        errorLog.push("The link between block at height: " + i +
                                    " and height: " + (i - 1) + " does not match");
                                    }
                                } else {
                                    // in case of genesis block
                                    if(previousBlockHash) {
                                        // previous hash will be empty
                                        errorLog.push("previousBlockHash should be equal to \"\" for a GENESIS BLOCK");
                                    }

                                    if(!blockObject.hash) {
                                        // should have a valid hash
                                        errorLog.push("Invalid hash for the GENESIS BLOCK");
                                    }
                                }
                            } else {
                                errorLog.push("Invalid block at height: " + i);
                            }

                            previousBlockHash = blockObject.hash;

                            // ensure that we are coming to a 
                            // decision about the validity of the chain
                            // only when we have scanned through the entire
                            // chain and no more blocks remain.
                            if(i == count - 1) {
                                resolve(errorLog);
                            }
                        }).catch((err) => {
                            console.log(err);
                            errorLog.push(err);
                        });

                        /* if(valid) {
                            // block is valid.
                            console.log("Valid block #" + i);
                        } else {
                            // collect all invalid blocks in the list
                            errorLog.push("Invalid block #" + i);
                        } */
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                    });
                }   // end for
            }).catch((err) => {
                console.log(err);
                reject(error);
            });
        });
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