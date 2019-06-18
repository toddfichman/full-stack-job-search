import React from 'react';
import Jobs from './Jobs';
import './App.css';

const JOB_API_URL = 'http://localhost:3001/jobs'


async function fetchJobs(updateCallback) {
  const res = await fetch(JOB_API_URL);
  const json = await res.json()

  //updating jobs list using updateJobs
  updateCallback(json)

  console.log(json)
}

function App() {

  const [jobList, updateJobs] = React.useState([]);

  // when passing empty array as 2nd arg, 
  // makes useEffect act just like componentDidMount
  React.useEffect(() => {
    fetchJobs(updateJobs)
  }, [])

  return (
    <div className="App">
      <Jobs jobs={jobList}/>
    </div>
  );
}

export default App;
