/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

let myBlockChain = new BlockChain.Blockchain();

setTimeout(function () {
	// not understanding the use of this method
	// console.log("Waiting...");
	/* let blockTest = new Block.Block("Test Block - 00");
	blockTest.height = 3;
	blockTest.time = new Date().getTime();
	blockTest.previousBlockHash = "";
	blockTest.hash = "";
	myBlockChain._modifyBlock(blockTest.height, blockTest).then((blockModified) => {
		console.log("blockModified: " + blockModified);
		validateBlockChain();
	}); */

	validateBlockChain();
}, 10);

/******************************************
 ** Function for Create Tests Blocks   ****
 ******************************************/


(function theLoop (i) {
	setTimeout(function () {
		let blockTest = new Block.Block("Test Block - " + (i + 1));
		// Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
		/* myBlockChain.addBlock(blockTest).then((result) => {
			// console.log(result);
			i++;
			if (i < 200) theLoop(i);
		}); */
	}, 10);
  })(0);


/***********************************************
 ** Function to get the Height of the Chain ****
 ***********************************************/

// Be careful this only will work if `getBlockHeight` method in Blockchain.js file return a Promise
myBlockChain.getBlockHeight().then((height) => {
	console.log("height of the chain: " + height);
}).catch((err) => {
	console.log(err);
});


/***********************************************
 ******** Function to Get a Block  *************
 ***********************************************/

// Be careful this only will work if `getBlock` method in Blockchain.js file return a Promise
/* myBlockChain.getBlock(1).then((block) => {
	let blockObject = JSON.parse(block);
	console.log("hash " + blockObject.hash);
	console.log("prevHash " + blockObject.previousBlockHash);
}).catch((err) => {
	console.log(err);
}); */


/***********************************************
 ***************** Validate Block  *************
 ***********************************************/


// Be careful this only will work if `validateBlock` method in Blockchain.js file return a Promise
/* let blockNumer = 99;
myBlockChain.validateBlock(blockNumer).then((valid) => {
	if(valid) {
		console.log("Block #" + blockNumer + " is VALID!");
	} else {
		console.log("Block #" + blockNumer + " is NOT VALID!");
	}
}).catch((error) => {
	console.log(error);
}); */


/** Tampering a Block this is only for the purpose of testing the validation methods */
/*
myBlockChain.getBlock(5).then((block) => {
	let blockAux = block;
	blockAux.body = "Tampered Block";
	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
		if(blockModified){
			myBlockChain.validateBlock(blockAux.height).then((valid) => {
				console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
			})
			.catch((error) => {
				console.log(error);
			})
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});

myBlockChain.getBlock(6).then((block) => {
	let blockAux = block;
	blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
		if(blockModified){
			console.log("The Block was modified");
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});

/***********************************************
 ***************** Validate Chain  *************
 ***********************************************/

// Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
function validateBlockChain() {
	myBlockChain.validateChain().then((errorLog) => {
		if(errorLog.length > 0) {
			console.log("The chain is not valid:");
			errorLog.forEach(error => {
				console.log(error);
			});
		} else {
			console.log("No errors found, The chain is Valid!");
		}
	}).catch((error) => {
		console.log(error);
	})
}
