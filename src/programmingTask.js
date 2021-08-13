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
	/**
	 * Reads in the file and returns the output as string
	 * @param {*} filename 
	 * @returns 
	 */
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
	/**
	 * Optional method to search in the string content of the file given a pattern
	 * @param {*} pattern 
	 * @returns 
	 */
	filterPattern: async function(pattern){
		this.symbols = this.fileContent.match(pattern);
		return this;
	},
	/**
	 * Similar to the select statement in sql, used to select parsed attributes
	 * from the log data by providing attributes to select as an array of strings
	 * This function currently supports select one attribute but can be extended to 
	 * select multiple
	 * @param  {...any} attributes 
	 * @returns 
	 */
	select: function(...attributes){
		this.symbols = [];
		if(attributes.length>0 && this.parsedLog.length>0){
			this.symbols = this.parsedLog.flatMap(item => {
				return attributes.map(attribute => {
					let obj = {}
					obj[attribute] = item[attribute]
					return obj;
				});
			});
			return this;
		}else{
			throw new Error("No select attributes provided or parsedLog is empty");
		}
	},
	/**
	 * Similar to the distinct method in sql, returns the unique elements for the attribute specified
	 * in the select clause
	 * @returns 
	 */
	unique: function(attribute){
		let uniqueValues = new Set();
		if(this.symbols && this.symbols.length>0){
		let mappedItems = this.symbols
							.filter(item => attribute in item)
							.map(item => item[attribute])
		for(let symbol of mappedItems){
			uniqueValues.add(symbol);
		}
		return uniqueValues;
		}else{
			throw new Error("No attribute selected for uniqueness")
		}
	},
	/**
	 * Generates the frequency of occurence of the attribute in the select
	 * clause
	 * @returns 
	 */
	frequency: function(attribute){
		let frequencyMap = new Map();
		for(let symbol of this.symbols.map(item => item[attribute])){
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
	/**
	 * Sorts the information selected given the order
	 * Default order is descending
	 */
	sort: function(order="desc"){
		if(this.symbolMap.size>0){
			let tempArray = Array
				.from(this.symbolMap.entries())
				.map(element => {
					return {"key": element[0], "value": element[1]};
				})
				.sort((a,b)=>{
					if(order === "desc"){
						return b.value - a.value;
					}else if(order === "asc"){
						return a.value - b.value;
					}
				});
			this.sortedSymbolMap = tempArray;
			return this;
		}else{
            console.error(`There is nothing to sort`);
            throw new Error("Empty sort error");
        }
	},
	/**
	 * similar to the limit function is sql, limits the results of the output to
	 * the value specified. Currently only works post application of the sort function
	 * @param {*} limitSpec 
	 * @returns 
	 */
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

	/**
	 * similar to groupby in sql, groups output with the provided input
	 * @param {*} attribute 
	 * @returns 
	 */
	groupBy: function(attribute){
		this.select(attribute)
			.frequency(attribute);
		return this;
	},

	/**
	 * This is main parsing function. 
	 * It parses the log file and returns an array of objects containing key value pairs
	 * of fields in the logs.
	 * @returns 
	 */
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
