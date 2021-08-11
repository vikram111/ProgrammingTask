const fs = require("fs");
/**
 * Converts the node js fs.readFile into a promise
 * @param {*} filename 
 * @param {*} encoding 
 * @returns 
 */
function readFile(filename, encoding="utf-8"){
	return new Promise((resolve, reject)=>{
		fs.readFile(filename, encoding, (err,data)=>{
			if(err){
				return reject(err);
			}else{
				return resolve(data);
			}
		});
	});
}

module.exports = {
	readFile
};
