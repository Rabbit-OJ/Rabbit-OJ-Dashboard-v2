import React from "react";
import { Link } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

import { Contest } from "../../model/contest";

interface IContestListComponentProps {
  list: Array<Contest>;
  onPageChange?: (newPage: number) => void;
  page: number;
  pageCount: number;
}

interface IContestComponentProps {
  item: Contest;
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

const renderStatus = (status: 0 | 1 | 2 | 3) => {
  if (status === 0) {
    return "Coming";
  } else if (status === 1) {
    return "Doing";
  } else {
    return "Finished";
  }
};

const ContestComponent = ({ item }: IContestComponentProps) => {
  const classes = useStyles();
  const url = `/detail/contest/${item.cid}`;

  return (
    <div className="list-container">
      <div>
        <Link to={url} className="router-link">
          {item.name}
        </Link>
      </div>
      <div className={classes.infoContainer}>{renderStatus(item.status)}</div>
    </div>
  );
};

const ContestListComponent = ({
  list,
  onPageChange,
  page,
  pageCount,
}: IContestListComponentProps) => {
  return (
    <>
      {list.map((item) => (
        <ContestComponent key={item.cid} item={item} />
      ))}
      {pageCount >= 2 && (
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
      )}
    </>
  );
};

export default ContestListComponent;
