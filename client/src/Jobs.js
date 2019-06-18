import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import Job from "./Job";
import JobModal from "./JobModal";


export default function Jobs({ jobs }) {
  // pagination
  const numJobs = jobs.length;
  const numPages = Math.ceil(numJobs / 50);
  const [activeStep, setActiveStep] = React.useState(0);
  const jobsOnPage = jobs.slice(activeStep * 50, activeStep * 50 + 50);
  //TODO:
  //scroll up to top when calling handleNext or handleBack
  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  // modal
  const [open, setOpen] = React.useState(false);
  const [selectedJob, changeSelectedJob] = React.useState({});
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  console.log(jobs[0]);

  return (
    <div className="jobs">
      <JobModal open={open} job={selectedJob} handleClose={handleClose} />

      <Typography variant="h4" component="h1">
        Entry Level Software Jobs
      </Typography>
      <Typography variant="h6" component="h2">
        Found {numJobs} Jobs
      </Typography>
      {jobsOnPage.map((job, i) => {
        return (
          <Job
            key={i}
            job={job}
            onClick={() => {
              changeSelectedJob(job);
              handleClickOpen();
            }}
          />
        );
      })}
      <div>
        Page {activeStep + 1} of {numPages}
      </div>
      <MobileStepper
        variant="dots"
        steps={numPages}
        position="static"
        activeStep={activeStep}
        // className={classes.root}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
}
