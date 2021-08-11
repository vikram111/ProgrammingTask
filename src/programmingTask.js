const {readFile} = require("./utils/fileUtils");
const NEW_LINE = "\n";
const ITEM_SPLIT_PATTERN = /["]/gi;
const CLEAN_PATTERN = /["\[\]]/g;
const ProgrammingTask = {
    
	fileContent: null,
	symbols: [],
	parsedLog: [],
	symbolMap: new Map(),
	sortedSymbolMap: null,

    init: function(){
        this.symbols = []
        this.parsedLog = []
        this.symbolMap = []
        this.sortedSymbolMap = null
    },
	readFileContentsAsString: async function(filename="programming-task-example-data.log"){
		try{
            this.init()
			this.fileContent =  await readFile(filename, "utf-8");
			return this;
		}catch(e){
			console.error(`There was an error when reading the file ${filename} with error ${e}`);
			throw new Error("File not found error");
		}
	},
	filterPattern: async function(pattern){
		this.symbols = this.fileContent.match(pattern);
		return this;
	},
	select: function(...attributes){
		this.symbols = [];
		if(attributes.length>0 && this.parsedLog.length>0){
			this.symbols = this.parsedLog.flatMap(item => {
				return attributes.map(attribute => item[attribute]);
			}
			);
			return this;
		}
	},
	unique: function(){
		let uniqueValues = new Set();
		for(let symbol of this.symbols){
			uniqueValues.add(symbol);
		}
		return uniqueValues;
	},
	frequency: function(){
		let frequencyMap = new Map();
		for(let symbol of this.symbols){
			if(frequencyMap.has(symbol)){
				let currVal = frequencyMap.get(symbol);
				frequencyMap.set(symbol, currVal+1);
			}else{
				frequencyMap.set(symbol,1);
			}
		}
		this.symbolMap = frequencyMap;
		return this;
	},
	sort: function(){
		if(this.symbolMap.size>0){
			let tempArray = Array
				.from(this.symbolMap.entries())
				.map(element => {
					return {"key": element[0], "value": element[1]};
				})
				.sort((a,b)=>{
					return b.value - a.value;
				});
			this.sortedSymbolMap = tempArray;
			return this;
		}else{
            console.error(`There is nothing to sort`);
            throw new Error("Empty sort error");
        }
	},
	limit: function(limitSpec){
		let limitedMap = [];
		if(limitSpec>0){
			for(let i=0; i<limitSpec; i++){
				limitedMap.push(this.sortedSymbolMap[i]);
			}
		}else{
           throw new Error("No Limit Specified");
        }
		return limitedMap;
	},
	groupBy: function(attribute){
		this.select([attribute])
			.frequency();
		return this;
	},
	parseLogData: function(){
		this.parsedLog=[];
		try{
			if(this.fileContent && this.fileContent.length>0){
				let returned = this.fileContent.trim().split(NEW_LINE)
					.map(line => line.trim().replace(/- -/, "-").split(ITEM_SPLIT_PATTERN));

				let nice = returned
					.map(element => element
						.map(item => item
							.trim()
							.replace(CLEAN_PATTERN, "")))
					.map(item => {
						return {
							"ipAndTimestamp": item[0],
							"url": item[1],
							"returnCode": item[2],
							"userAgent": item[5]
						};
					});
            
				for (const item of nice) {
					let val = item["ipAndTimestamp"].trim().split(/-/g);
					delete item["ipAndTimestamp"];
					item["ip"] = val[0].trim();
					item["userAndTimestamp"] = val[1].trim();
					this.parsedLog.push(item);
				}
			}else{
				console.error("The filecontent is null or empty");
				throw new Error("Empty log file");
			}
		}catch(e){
			console.error(`There was an error when parsing the file with error ${e}`);
			return null;
		}
		return this;
	}
};




module.exports = {
	ProgrammingTask
};
