# ProgrammingTask
The program parses a log file in the format specified by the file ./programming-task.log
The code is structured in a way that the consumers can use a fluid domain specific language
to analyse the information provided in a log file.

## Programming language
 NodeJs v14.16.0

## Sample usage.
1. To get the list of unique URLs in the log file.<br>
    `await ProgrammingTask.readFileContentsAsString("programming-task-example-data.log");`<br>
   Once the file is read use the DSL to extract required information<br>
                `ProgrammingTask`<br>
                &nbsp;&nbsp;&nbsp;&nbsp`.parseLogData()`      
                &nbsp;&nbsp;&nbsp;&nbsp `.select(["url"])`<br>
                &nbsp;&nbsp;&nbsp;&nbsp`.unique();`
  <br>
   will yield the following
   <p>{
  'GET /intranet-analytics/ HTTP/1.1',
  'GET http://example.net/faq/ HTTP/1.1',
  'GET /this/page/does/not/exist/ HTTP/1.1',
  'GET http://example.net/blog/category/meta/ HTTP/1.1',
  'GET /blog/2018/08/survey-your-opinion-matters/ HTTP/1.1',
  'GET /docs/manage-users/ HTTP/1.1',
  'GET /blog/category/community/ HTTP/1.1',
  'GET /faq/ HTTP/1.1',
  'GET /docs/manage-websites/ HTTP/1.1',
  'GET /faq/how-to-install/ HTTP/1.1',
  'GET /asset.js HTTP/1.1',
  'GET /to-an-error HTTP/1.1',
  'GET / HTTP/1.1',
  'GET /docs/ HTTP/1.1',
  'GET /moved-permanently HTTP/1.1',
  'GET /temp-redirect HTTP/1.1',
  'GET /faq/how-to/ HTTP/1.1',
  'GET /translations/ HTTP/1.1',
  'GET /newsletter/ HTTP/1.1',
  'GET /hosting/ HTTP/1.1',
  'GET /download/counter/ HTTP/1.1',
  'GET /asset.css HTTP/1.1'
}</p>

# Setting up
1. Install dependencies by running the following command from the project root where the package.json exists <br>
    `npm install`
## Running the code
`npm start`<br>
The above command will execute the code and print the following ouput on the console.
1. The number of unique IP addresses in the log file. 
2. The top 3 most visited URLs in the log file.
3. The top 3 most active IP addresses in the log file.

## Testing the code
The project uses jest to test the code. The following command runs unit tests along with code coverage.<br>
`npm test`<br>
The code coverage report can be found under the coverage folder
