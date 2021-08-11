/**
 * This is the starting point for the assignment
 */

const { ProgrammingTask } = require("./programmingTask");
const OUTPUT_SEPERATOR="\n******************************";
async function main(){
    await ProgrammingTask.readFileContentsAsString("programming-task-example-data.log");

    let uniqueIps = ProgrammingTask
                            .parseLogData()                            
                            .select(["ip"])
                            .unique();
    console.log("Number of unique Ips are", uniqueIps.size);

    let top3MostVisitedUrls = ProgrammingTask
                              .parseLogData()
                              .groupBy("url")
                              .sort("desc")
                              .limit(3)
    console.log(OUTPUT_SEPERATOR)
    console.log("Top 3 Most Visited URLs are\n")
    top3MostVisitedUrls.forEach(url => console.log(url.key));


    let top3MostActiveIps = ProgrammingTask
                              .parseLogData()
                              .groupBy("ip")
                              .sort("desc")
                              .limit(3)
    console.log(OUTPUT_SEPERATOR)
    console.log("Top 3 most active IPs are \n")
    top3MostActiveIps.forEach(url => console.log(url.key));
}

main();
