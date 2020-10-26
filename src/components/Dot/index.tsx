import React from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { JudgeResult } from "../../model/submission";
import clsx from "clsx";
import { displayMemory } from "../../utils/display";

const useStyles = makeStyles(() =>
  createStyles({
    dotAc: {
      background: "rgb(0, 184, 0)",
      color: "white",
    },
    dotTle: {
      background: "rgb(0, 65, 149)",
      color: "white",
    },
    dotRe: {
      background: "orange",
      color: "white",
    },
    dotMle: {
      background: "rgb(0, 65, 149)",
      color: "white",
    },
    dotCe: {
      background: "rgb(255, 0, 242)",
      color: "white",
    },
    dotIng: {
      background: "black",
      color: "white",
    },
    dotWa: {
      background: "red",
      color: "white",
    },
    caseDotContainer: {
      width: "108px",
      height: "108px",
      margin: "12px",
      cursor: "pointer",
      userSelect: "none",
      alignContent: "baseline",
      display: "flex",
      flexFlow: "column nowrap",
      padding: "3px",
      borderRadius: "6px",
      boxShadow: "2px 2px 10px 3px rgba(0, 0, 0, 0.15)",
      transition: "0.3s all",
      lineHeight: "normal !important",

      "&:hover": {
        boxShadow: "2px 2px 10px 3px rgba(0, 0, 0, 0.3)",
      },
    },
    status: {
      margin: "18px 0 36px 0",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
    },
    performanceContainer: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12px",
    },
    key: {
      fontSize: "12px",
    },
  })
);

interface IProps {
  dot: JudgeResult;
  index: number;
}

const SubmissionDotComponent = ({ dot, index }: IProps) => {
  const classes = useStyles();
  const containerClassList = [classes.caseDotContainer];

  const statusToClassNameMap: { [key: string]: string | undefined } = {
    AC: classes.dotAc,
    TLE: classes.dotTle,
    RE: classes.dotRe,
    MLE: classes.dotMle,
    CE: classes.dotCe,
    WA: classes.dotWa,
    ING: classes.dotIng,
  };

  if (statusToClassNameMap[dot.status]) {
    containerClassList.push(statusToClassNameMap[dot.status]!);
  } else {
    containerClassList.push(classes.dotIng);
  }

  return (
    <div className={clsx(...containerClassList)}>
      <div className={classes.key}>#{index + 1}</div>
      <div className={classes.status}>{dot.status}</div>

      {dot.status !== "ING" && (
        <div className={classes.performanceContainer}>
          {(dot.time_used || dot.status === "AC") && (
            <div>{dot.time_used}ms</div>
          )}
          {dot.status !== "CE" && dot.status !== "RE" && (
            <div>{displayMemory(dot.space_used)}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionDotComponent;
