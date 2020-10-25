import React, { useState } from "react";

import { Link, useHistory, useParams } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

import { QuestionItem } from "../../model/question-list";

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
  const url = `/detail/problem/${item.tid}`;

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
  const [pageCount, setPageCount] = useState(10);
  const { page } = useParams<{ page: string }>();
  const history = useHistory();

  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    history.push(`/list/problem/${newPage}`);
  };

  return (
    <>
      {list.map((item) => (
        <ProblemComponent key={item.tid} item={item} />
      ))}
      <Pagination
        className="pagination"
        count={pageCount}
        page={+page}
        variant="outlined"
        color="primary"
        onChange={handlePaginationChange}
      />
    </>
  );
};

export default ProblemListComponent;
