const fs = require("fs");

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
