import React, { useState } from "react";

import { Link, useHistory, useParams } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

import { QuestionItem } from "../../model/question-list";

interface IProblemListComponentProps {
  list: Array<QuestionItem>;
  onPageChange?: (newPage: number) => void;
  page: number;
  pageCount: number;
}

interface IProblemComponentProps {
  item: QuestionItem;
}

const useStyles = makeStyles(() =>
  createStyles({
    infoContainer: {
      color: "gray",
      fontSize: "12px",
      marginLeft: "6px",
    },
  })
);

const ProblemComponent = ({ item }: IProblemComponentProps) => {
  const classes = useStyles();
  const url = `/detail/problem/${item.tid}`;

  return (
    <div>
      <div>
        <Link to={url} className="router-link">
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

const ProblemListComponent = ({
  list,
  onPageChange,
  page,
  pageCount,
}: IProblemListComponentProps) => {
  return (
    <>
      {list.map((item) => (
        <ProblemComponent key={item.tid} item={item} />
      ))}
      <Pagination
        className="pagination"
        count={pageCount}
        page={page}
        variant="outlined"
        color="primary"
        onChange={(_, newPage) => {
          onPageChange && onPageChange(newPage);
        }}
      />
    </>
  );
};

export default ProblemListComponent;
