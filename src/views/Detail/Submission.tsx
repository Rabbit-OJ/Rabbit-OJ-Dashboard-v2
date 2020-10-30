import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import { JudgeStatus, Submission } from "../../model/submission";
import API_URL from "../../utils/url";
import SubmissionDotComponent from "../../components/Dot";
import RabbitFetch from "../../utils/fetch";
import { displayMemory } from "../../utils/display";
import { GeneralResponse } from "../../model/general-response";
import { emitSnackbar } from "../../data/emitter";

const DEFAULT_SUBMISSION: Submission = {
  sid: 0,
  uid: 0,
  tid: 0,
  question_title: "Loading ...",
  status: "AC",
  language: "cpp",
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
    caseDotListContainer: {
      display: "flex",
      flexFlow: "row wrap",
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
      <div>
        Problem:{" "}
        <Link to={`/detail/problem/${submission.tid}`} className="router-link">
          {submission.question_title}
        </Link>
      </div>
      <div>
        Status:{" "}
        <span className={clsx(...statusClassName)}>{submission.status}</span>
      </div>
      <div>Language: {submission.language}</div>
      <div>Space Used: {displayMemory(submission.space_used)}</div>
      <div>Time Used: {submission.time_used}ms</div>
      <div>Submit Time: {submission.created_at.toLocaleString()}</div>
      <h3>Test Cases Info</h3>
      <div className={classes.caseDotListContainer}>
        {submission.judge.map((item, idx) => (
          <SubmissionDotComponent key={idx} dot={item} index={idx} />
        ))}
      </div>
    </>
  );
};

interface ICodeComponentProps {
  sid: string;
  codeSegment: string;
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

const CodeComponent = ({ sid, codeSegment }: ICodeComponentProps) => {
  const handleDownload = () => {
    const token = localStorage.getItem("token");
    const tempForm = document.createElement("form");
    tempForm.action = API_URL.SUBMISSION.POST_CODE(sid);
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
  const { sid } = useParams<{ sid: string }>();
  const [tabIndex, setTabIndex] = useState(0);
  const [submission, setSubmission] = useState(DEFAULT_SUBMISSION);
  const [submissionStatus, setSubmissionStatus] = useState("AC" as JudgeStatus);
  const [codeSegment, setCodeSegment] = useState("");
  const ws = useRef<null | WebSocket>(null);

  const fetchCode = useCallback(async () => {
    const res = await RabbitFetch<string>(
      API_URL.SUBMISSION.POST_CODE(sid.toString()),
      {
        method: "POST",
        body: `token=${localStorage.getItem("token")}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "string",
      }
    );

    setCodeSegment(res);
  }, [sid]);

  const fetchSubmissionInfo = useCallback(async () => {
    const { code, message } = await RabbitFetch<GeneralResponse<Submission>>(
      API_URL.SUBMISSION.GET_DETAIL(sid.toString()),
      {
        method: "GET",
      }
    );

    if (code === 200) {
      setSubmission(message);
      setSubmissionStatus(message.status);
    } else {
      emitSnackbar(message, { variant: "error" });
    }
  }, [sid]);
  useEffect(() => {
    if (submissionStatus === "ING") {
      ws.current = new WebSocket(API_URL.SUBMISSION.SOCKET(sid));
      ws.current.onopen = () => {
        console.log("ws opened");
      };
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data) as { ok: number };
        if (data.ok === 1) {
          fetchSubmissionInfo();
          ws.current?.close();
        }
      };
      ws.current.onerror = (e) => {
        console.error("ws error", e);
        emitSnackbar(
          "WebSocket error, you may not be noticed about latest submission result!",
          { variant: "error" }
        );
      };

      return () => {
        ws.current?.close();
        ws.current = null;
      };
    }
  }, [sid, submissionStatus, fetchSubmissionInfo]);
  useEffect(() => {
    fetchCode();
    fetchSubmissionInfo();
  }, [sid, fetchCode, fetchSubmissionInfo]);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const classes = useStyles();
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
          {tabIndex === 1 && (
            <CodeComponent sid={sid.toString()} codeSegment={codeSegment} />
          )}
        </div>
      </Paper>
    </>
  );
};

export default DetailSubmission;
