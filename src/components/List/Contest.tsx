import React, { useState } from "react";

import { Link, useHistory, useParams } from "react-router-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

import { Contest } from "../../model/contest";

interface IContestListComponentProps {
  list: Array<Contest>;
}

interface IContestComponentProps {
  item: Contest;
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

const renderStatus = (status: 0 | 1 | 2 | 3) => {
  if (status === 0) {
    return "未开始";
  } else if (status === 1) {
    return "进行中";
  } else {
    return "已结束";
  }
}

const ContestComponent = ({ item }: IContestComponentProps) => {
  const classes = useStyles();
  const url = `/detail/contest/${item.cid}`;

  return (
    <div>
      <div>
        <Link to={url} className={classes.questionTitle}>
          {item.name}
        </Link>
      </div>
      <div className={classes.infoContainer}>
      { renderStatus(item.status) }
      </div>
    </div>
  );
};


const ContestListComponent = ({ list }: IContestListComponentProps) => {
  const [pageCount, setPageCount] = useState(10);
  const { page } = useParams<{ page: string }>();
  const history = useHistory();

  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    history.push(`/list/contest/${newPage}`);
  };

  return (
    <>
      {list.map((item) => (
        <ContestComponent key={item.cid} item={item} />
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

export default ContestListComponent;
