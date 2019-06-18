const fetch = require("node-fetch");

var redis = require("redis"),
  client = redis.createClient();
const { promisify } = require("util");
 
const setAsync = promisify(client.set).bind(client);

const baseUrl = "https://jobs.github.com/positions.json";

//getting jobs from github jobs
async function fetchGithub() {
  let resultsCount = 1;
  let onPage = 0;
  const allJobs = [];

  // fetch all pages
  while (resultsCount > 0 ) { //&& allJobs.length < 250
    const res = await fetch(`${baseUrl}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultsCount = jobs.length;
    console.log("got", jobs.length, " jobs");
    onPage++;
  }

  console.log("total jobs ", allJobs.length);

  // filter algorithm
  const jrJobs = allJobs.filter(job => {
    const jobTilte = job.title.toLowerCase();
    let isJunior = true;
    //TODO: 
      //filter by other perameters (year of experience, description, ect)

    //algo logic
    if (
      jobTilte.includes("senior") ||
      jobTilte.includes("lead") ||
      jobTilte.includes("manager") ||
      jobTilte.includes("sr.") ||
      jobTilte.includes("architect") ||
      jobTilte.includes("test") ||
      jobTilte.includes("back end") ||
      jobTilte.includes("backend") ||
      jobTilte.includes("back-end") ||
      jobTilte.includes(".net") ||
      jobTilte.includes("security") ||
      jobTilte.includes("cloud") ||
      jobTilte.includes("president") ||
      jobTilte.includes("officer") 
      
    ) {
      isJunior = false;
    }
      return isJunior;
  });

  console.log("filtered jobs ", jrJobs.length);
  // console.log("jr jobs 0", jrJobs[0]);
  // uniq = [...new Set(array)];
  let uniqueJobs = getUnique(jrJobs, 'id')
  console.log("final jobs ", uniqueJobs.length);
  //writing to redis DB with key 'github' and value of allJobs
  //TODO: 
    // sort final jobs array by date before writing to redis DB
  const success = await setAsync("github", JSON.stringify(uniqueJobs));

  console.log(success);
}

fetchGithub();

function getUnique(arr, comp) {

  const unique = arr
       .map(e => e[comp])

     // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

   return unique;
}

module.exports = fetchGithub;
