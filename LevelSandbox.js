/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(key, function(err, block) {
                if (err) {
                    reject("Not found in DB!");
                } else {
                    resolve(block);
                }
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value.toString(), function (err, value) {
                if (err) {
                  if (err.notFound) {
                    // handle a 'NotFoundError' here
                    reject("Not found");
                  }
                  // I/O or other error, pass it up the callback chain
                  reject(err);
                }
               
                resolve("Added value to DB successuflly");
              });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember un Promises you need to resolve() or reject()
        });
    }
        

}

module.exports.LevelSandbox = LevelSandbox;