import React, { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { createStyles, makeStyles } from "@material-ui/core/styles";

import { Submission } from "../../model/submission";
import API_URL from "../../utils/url";

const DEFAULT_SUBMISSION: Submission = {
  sid: 0,
  uid: 0,
  tid: 0,
  question_title: "A + B Problem",
  status: "AC",
  language: "php",
  time_used: 0,
  space_used: 0,
  created_at: new Date(),
  judge: [],
};

const useStyles = makeStyles(() =>
  createStyles({
    bodyContainer: {
      padding: "24px",
    },
    main: {
      margin: "24px 0",
    },
  })
);

interface ISubmissionDetailComponentProps {
  submission: Submission;
}

const useDetailSubmissionStyles = makeStyles(() =>
  createStyles({
    statusSubmission: {
      fontWeight: 700,
    },
    statusSubmissionIng: {
      color: "black",
    },
    statusSubmissionOk: {
      color: "greenyellow",
    },
    statusSubmissionNo: {
      color: "red",
    },
  })
);

const SubmissionDetailComponent = ({
  submission,
}: ISubmissionDetailComponentProps) => {
  const classes = useDetailSubmissionStyles();

  const statusClassName = [classes.statusSubmission];
  if (submission.status === "ING") {
    statusClassName.push(classes.statusSubmissionIng);
  } else if (submission.status === "AC") {
    statusClassName.push(classes.statusSubmissionOk);
  } else {
    // no
    statusClassName.push(classes.statusSubmissionNo);
  }

  return (
    <>
      <h3>Basic Information</h3>
      <p>
        Problem:{" "}
        <Link to={`/detail/problem/${submission.tid}`} className="router-link">
          {submission.question_title}
        </Link>
      </p>
      <p>
        Status: <span className={clsx(...statusClassName)}>{submission.status}</span>
      </p>
      <p>Language: {submission.language}</p>
      <p>Space Used: {submission.space_used}</p>
      <p>Time Used: {submission.time_used}ms</p>
      <p>Submit Time: {submission.created_at.toLocaleString()}</p>
      <h3>Test Cases Info</h3>
    </>
  );
};

interface ICodeComponentProps {
  submission: Submission;
}

const useCodeComponentStyles = makeStyles(() =>
  createStyles({
    downloadContainer: {
      display: "flex",
      justifyContent: "center",
    },
    downloadBtn: {
      margin: "12px",
    },
    codeDownload: {
      width: "100%",
      minHeight: "480px",
    },
  })
);

const CodeComponent = ({ submission }: ICodeComponentProps) => {
  const handleDownload = () => {
    const token = localStorage.getItem("token");
    const tempForm = document.createElement("form");
    tempForm.action = API_URL.SUBMISSION.POST_CODE(submission.sid.toString());
    tempForm.target = "_blank";
    tempForm.method = "POST";
    tempForm.style.display = "none";

    const tokenElement = document.createElement("textarea");
    tokenElement.name = "token";
    tokenElement.value = token!;
    tempForm.appendChild(tokenElement);

    document.body.appendChild(tempForm);
    tempForm.submit();
    tempForm.remove();
  };

  const classes = useCodeComponentStyles();
  const [codeSegment, setCodeSegment] = useState("");
  return (
    <>
      <div className={classes.downloadContainer}>
        <Button
          variant="contained"
          className={classes.downloadBtn}
          id="download"
          color="primary"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <div>
        <TextField
          label="Code"
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          className={classes.codeDownload}
          multiline
          rows="24"
          value={codeSegment}
        />
      </div>
    </>
  );
};

const DetailSubmission = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [submission, setSubmission] = useState(DEFAULT_SUBMISSION);
  const classes = useStyles();

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <h1>Submission Status - {submission.question_title}</h1>
      <Paper className={classes.main}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Detail" />
          <Tab label="Codes" />
        </Tabs>
        <div className={classes.bodyContainer}>
          {tabIndex === 0 && (
            <SubmissionDetailComponent submission={submission} />
          )}
          {tabIndex === 1 && <CodeComponent submission={submission} />}
        </div>
      </Paper>
    </>
  );
};

export default DetailSubmission;
