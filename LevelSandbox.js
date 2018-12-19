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
                    reject("Not found in DB! for key: " + key);
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
            // adding value to DB as a string instead of an object.
            self.db.put(key, JSON.stringify(value), function (err, value) {
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
            let dataSet = [];
                self.db.createReadStream()
                .on('data', function (data) {
                    dataSet.push(data);
                })
                .on('error', function (err) {
                    // reject with error
                    reject(err);
                })
                .on('close', function () {
                    // resolve with the count value
                    resolve(dataSet.length);
                });
            });
    }
}

module.exports.LevelSandbox = LevelSandbox;