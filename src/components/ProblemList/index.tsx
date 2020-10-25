import React from "react";

import { Link } from "react-router-dom";

import { QuestionItem } from "../../model/question-list";
import { createStyles, makeStyles } from "@material-ui/core/styles";

interface IProblemListComponentProps {
  list: Array<QuestionItem>;
}

interface IProblemComponentProps {
  item: QuestionItem;
}

const useStyles = makeStyles(() =>
  createStyles({
    questionTitle: {
      cursor: "pointer",
      textDecoration: "none",
      color: "black",
    },
    infoContainer: {
      color: "gray",
      fontSize: "12px",
      marginLeft: "6px",
    },
  })
);

const ProblemComponent = ({ item }: IProblemComponentProps) => {
  const classes = useStyles();
  const url = `/detail/${item.tid}`;

  return (
    <div>
      <div>
        <Link to={url} className={classes.questionTitle}>
          {item.subject}
        </Link>
      </div>
      <div className={classes.infoContainer}>
        {item.accept} / {item.attempt},{" "}
        {((item.accept / (item.attempt || 1)) * 100.0).toFixed(2)}%
      </div>
    </div>
  );
};

const ProblemListComponent = ({ list }: IProblemListComponentProps) => {
  return (
    <>
      {list.map((item) => (
        <ProblemComponent key={item.tid} item={item} />
      ))}
    </>
  );
};

export default ProblemListComponent;
