const {ProgrammingTask} = require("../src/programmingTask.js");
const FILE_NAME = __dirname+"/resources/programming-task-example-data.log";
const EMPTY_FILE_NAME = __dirname+"/resources/emptyLogFile.log";

describe("Positive scenarios for programming task", ()=>{
	beforeEach(async()=>{
		await ProgrammingTask.readFileContentsAsString(FILE_NAME);
	});
	test("should return fileContent if file is found", async ()=>{
		let content = await ProgrammingTask.readFileContentsAsString(__dirname+"/resources/programming-task-example-data.log");
		expect(content.fileContent).toEqual(expect.stringContaining("GET"));
	});

	test("it should return IP address array from the log file given an IP address search", async ()=>{
		let ips = await ProgrammingTask.filterPattern(/([0-2]?[0-9][0-9]?)\.([0-2]?[0-9][0-9]?)\.([0-2]?[0-9][0-9]?)\.([0-2]?[0-9][0-9]?)/g);
		let ip = ips.symbols.filter(item => item === "168.41.191.9");
		expect(ip.length).toBe(2);
	});

	test("it should return unique IP addresses given a log file", ()=>{
		let uniqueIps = ProgrammingTask
							.parseLogData()
							.select("ip")
							.unique("ip");
		expect(uniqueIps.size).toBe(11);
	});

	test("it should return selected attribute map",()=>{
		let selectedMap = ProgrammingTask
							.parseLogData()
							.select("ip","url")
							.unique("ip")
		expect(selectedMap.size).toBe(11)
	})

	test("it should return parsed log items", () => {
		let ips = ProgrammingTask
			.parseLogData()
			.select(["ip"]).symbols;
		expect(ips.length).toBe(23);
		let urls = ProgrammingTask.select(["url"]);
		expect(urls.symbols.length).toBe(23);
	});


});

describe("Test end to end flow", ()=>{
	beforeEach(async ()=>{
		await ProgrammingTask
			.readFileContentsAsString(FILE_NAME);
	});
	test("it should return the number unique ips", async ()=>{
		let uniqueIps = ProgrammingTask
			.parseLogData()           
			.select("ip")
			.unique("ip");
                        
		expect(uniqueIps.size).toBe(11);
	});

	test("it should return the top 3 most active IP addresses", ()=>{
		let symbolFrequency = ProgrammingTask
			.parseLogData()
			.select("ip")
			.frequency("ip")
			.sort()
			.limit(3);
		expect(symbolFrequency[0].key).toBe("168.41.191.40");
       
	});

	test("it should return top 3 most visited urls", ()=>{
		let urlFrequency = ProgrammingTask
			.parseLogData()
			.select(["url"])
			.frequency("url")
			.sort()
			.limit(3);
		expect(urlFrequency[0].key).toEqual(expect.stringContaining("GET /docs/manage-websites"));

	});

	test("it should return top 3 most visited urls using groupBy", ()=>{
		let urlFrequency = ProgrammingTask
			.parseLogData()
			.groupBy("url")
			.sort()
			.limit(3);
		expect(urlFrequency[0].key).toEqual(expect.stringContaining("GET /docs/manage-websites"));

	});

	test("it should returned items sorted by ascending order",()=>{
		let searchString="intranet-analytics";
		let urlFrequency = ProgrammingTask
			.parseLogData()
			.groupBy("url")
			.sort("asc")
			.limit(3);
		let filteredValue = urlFrequency.filter(item => item["key"].search(searchString)!==-1);
		
		expect(filteredValue[0]["key"]).toEqual(expect.stringContaining(searchString));
	})
});


describe("Negative scenarios for programming task", ()=>{
	test("readFileContentAsString should return an error when file is not found",async ()=>{
		try{
			await ProgrammingTask.readFileContentsAsString("");
		}catch(e){
			expect(e.message).toBe("File not found error");
		}
	});

	test("parseLogData should throw an error when log file is empty",async ()=>{
		await ProgrammingTask.readFileContentsAsString(EMPTY_FILE_NAME);
		try{
			ProgrammingTask.parseLogData();
		}catch(e){
			expect(e.message).toBe("Empty log file");
		}
	});

    test("sort should throw an error when there is nothing to sort", async ()=> {
        try{
            ProgrammingTask
                .sort()
            
		}catch(e){
			expect(e.message).toBe("Empty sort error");
		}
    });

    test("limit should throw an error when no limit is specified", ()=>{
        try{
            ProgrammingTask.limit()
        }catch(e){
            expect(e.message).toBe("No Limit Specified");
        }
    });

	test("select should throw an eror when no attribute is selected", ()=>{
		try{
			ProgrammingTask.select()
		}catch(e){
			expect(e.message).toBe("No select attributes provided or parsedLog is empty");
		}
	});

	test("expect unique to throw an error if called without a select clause",()=>{
		try{
			ProgrammingTask.unique("ip");
		}catch(e){
			expect(e.message).toBe("No attribute selected for uniqueness");
		}
	})
});
