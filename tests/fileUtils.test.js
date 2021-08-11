const { readFile } = require("../src/utils/fileUtils")
const FILE_NAME = __dirname+"/resources/programming-task-example-data.log";

describe("FileUtils test", ()=>{
    test("file utils should return content when proper file is provided", ()=>{
        readFile(FILE_NAME)
        .then(data => expect(data.length).toBeGreaterThan(20))
    });

    test("file utils should return error when proper file is not provided", ()=>{
        readFile("")
        .catch(e => expect(e).toBeDefined());
    })
})
