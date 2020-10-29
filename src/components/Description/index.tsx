import React from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";

import { QuestionDetail } from "../../model/question-detail";
import { ContestQuestion } from "../../model/contest-question";

const useStyles = makeStyles(() =>
  createStyles({
    sample: {
      display: "flex",
      flexFlow: "row",
      margin: "6px 0",
      "& .in, & .out": {
        flexGrow: 1,
        flexShrink: 1,
        margin: "0 12px 0 0",
        borderRadius: "6px",
        padding: "12px",
        background: "#ddf3ff",
        whiteSpace: "pre-line",
      },
    },
  })
);

interface IProps {
  question: QuestionDetail | ContestQuestion;
  isContest: boolean;
}

const DescriptionComponent = ({ question, isContest }: IProps) => {
  const classes = useStyles();

  return (
    <>
      <h3>Description</h3>
      <div id="description">{question.content}</div>
      <h3>Sample</h3>
      {question.sample.map((item, idx) => (
        <div className={classes.sample} key={idx}>
          <div className="in">{item.in}</div>
          <div className="out">{item.out}</div>
        </div>
      ))}
      {!isContest && (
        <div>
          <h3>Statics</h3>
          <div>Submission: {question.attempt}</div>
          <div>
            Accepted: {question.accept} (
            {((question.accept / (question.attempt || 1)) * 100.0).toFixed(2)}%)
          </div>
        </div>
      )}
      <h3>Limitations</h3>
      <div>Time: {question.time_limit}ms</div>
      <div>Space: {question.space_limit.toFixed(2)}MB</div>
      {!isContest && (
        <div>
          <h3>Update Time</h3>
          <div>{question.created_at.toString()}</div>
        </div>
      )}
      {!isContest && (
        <div>
          <h3>Difficulty</h3>
          {question.difficulty === 1 && "Easy"}
          {question.difficulty === 2 && "Medium"}
          {question.difficulty === 3 && "Hard"}
        </div>
      )}
    </>
  );
};

export default DescriptionComponent;
