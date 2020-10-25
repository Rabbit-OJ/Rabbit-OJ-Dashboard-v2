import React, { useState } from "react";

import { Link, useHistory, useParams } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

import { SubmissionLite } from "../../model/submission";
import { displayMemory } from "../../utils/display";

interface ISubmissionListComponentProps {
  list: Array<SubmissionLite>;
}

interface ISubmissionComponentProps {
  item: SubmissionLite;
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

const SubmissionComponent = ({ item }: ISubmissionComponentProps) => {
  const classes = useStyles();
  const url = `/detail/submission/${item.tid}`;

  return (
    <div>
      <div>
        <Link to={url} className={classes.questionTitle}>
          {item.question_title}
        </Link>
      </div>
      <div className={classes.infoContainer}>
        {item.language}, {item.time_used}ms, {displayMemory(item.space_used)},{" "}
        {item.created_at.toLocaleString()}
      </div>
    </div>
  );
};

const SubmissionListComponent = ({ list }: ISubmissionListComponentProps) => {
  const [pageCount, setPageCount] = useState(10);
  const { page } = useParams<{ page: string }>();
  const history = useHistory();

  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    history.push(`/list/submission/${newPage}`);
  };

  return (
    <>
      {list.map((item) => (
        <SubmissionComponent key={item.tid} item={item} />
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

export default SubmissionListComponent;
