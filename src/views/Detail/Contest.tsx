import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";

import { displayRelativeTime } from "../../utils/display";
import DescriptionComponent from "../../components/Description";
import SubmitComponent from "../../components/Submit";
import SubmissionDotComponent from "../../components/Dot";
import useDetailContestStyles from "./Contest.style";
import {
  DEFAULT_CLARIFY_LIST,
  DEFAULT_CONTEST,
  DEFAULT_MY_INFO,
  DEFAULT_PROBLEM,
  DEFAULT_SCOREBOARD_LIST,
  DEFAULT_SUBMISSION_LIST,
  INITIAL_PROBLEM_MAP,
  INITIAL_SUNMISSION_CASE_INFO_MAP,
} from "./Contest.data";
import { emitSnackbar } from "../../data/emitter";
import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";
import { ContestClarify } from "../../model/contest-clarify";
import { GeneralResponse } from "../../model/general-response";
import {
  ContestQuestion,
  ContestQuestionItem,
} from "../../model/contest-question";
import { ContestSubmission, Submission } from "../../model/submission";
import { ScoreBoardResponse } from "../../model/score-board";
import { calculatePageCount } from "../../utils/page";
import { ContestMyInfo } from "../../model/contest-my-info";
import { Contest } from "../../model/contest";
import { useTypedSelector } from "../../data";
import { WebsocketMessage } from "../../model/websocket";

interface IHandleSubmitProps {
  language: string;
  code: string;
}

const DetailContest = () => {
  const { cid } = useParams<{ cid: string }>();

  const [contest, setContest] = useState(DEFAULT_CONTEST);
  const [myInfo, setMyInfo] = useState(DEFAULT_MY_INFO);
  const [socketStatus, setSocketStatus] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [remainTime, setRemainTime] = useState("");
  const [clarifyList, setClarifyList] = useState(DEFAULT_CLARIFY_LIST);
  const [clarifyRead, setClarifyRead] = useState(0);
  const [submissionList, setSubmissionList] = useState(DEFAULT_SUBMISSION_LIST);
  const [submissionCaseInfo, setSubmissionCaseInfo] = useState(
    INITIAL_SUNMISSION_CASE_INFO_MAP()
  );
  const [problemList, setProblemList] = useState(DEFAULT_PROBLEM);
  const [scoreboardBlocked, setScoreboardBlocked] = useState(false);
  const [scoreboardPage, setScoreboardPage] = useState(1);
  const [scoreboardPageCount, setScoreboardPageCount] = useState(10);
  const [scoreboardList, setScoreboardList] = useState(DEFAULT_SCOREBOARD_LIST);
  const [scoreboardRefreshTime, setScoreboardRefreshTime] = useState(
    new Date()
  );
  const [questionRefreshTime, setQuestionRefreshTime] = useState(new Date());
  const [submissionRefreshTime, setSubmissionRefreshTime] = useState(
    new Date()
  );
  const [clarifyRefreshTime, setClarifyRefreshTime] = useState(new Date());
  const [infoRefreshTime, setInfoRefreshTime] = useState(new Date());
  const [problemMap, setProblemMap] = useState(INITIAL_PROBLEM_MAP());
  const { isLogin, isAdmin, uid } = useTypedSelector((state) => ({
    isLogin: state.user.isLogin,
    isAdmin: state.user.isAdmin,
    uid: state.user.uid,
  }));
  const contestWebsocket = useRef<null | WebSocket>(null);
  const classes = useDetailContestStyles();

  const renderRemainTime = useCallback(() => {
    const now = new Date();
    const endContest = new Date(contest.end_time);
    setRemainTime(
      displayRelativeTime(((endContest.getTime() - now.getTime()) / 1000) | 0)
    );
  }, [contest]);
  const fetchContestInfo = useCallback(async () => {
    const { code, message } = await RabbitFetch<GeneralResponse<Contest>>(
      API_URL.CONTEST.GET_INFO(cid),
      {
        method: "GET",
      }
    );

    if (code === 200) {
      const nextState = {
        ...message,
        start_time: message.start_time.toLocaleString(),
        block_time: message.block_time.toLocaleString(),
        end_time: message.end_time.toLocaleString(),
      };
      setContest(nextState);
      return nextState;
    } else {
      emitSnackbar(message, { variant: "error" });
      return Promise.reject(message);
    }
  }, [cid]);
  const fetchMyInfo = useCallback(
    async (showNotice: boolean = false) => {
      if (!isLogin) return;

      try {
        const { code, message } = await RabbitFetch<
          GeneralResponse<ContestMyInfo>
        >(API_URL.CONTEST.GET_MY_INFO(cid), {
          method: "GET",
        });

        if (code === 200) {
          setMyInfo(message);
        } else {
          emitSnackbar(message, { variant: "error" });
        }

        if (showNotice) emitSnackbar("Personal info updated");
      } catch (e) {
        console.error(e);
      } finally {
        setInfoRefreshTime(new Date());
      }
    },
    [cid, isLogin]
  );
  const fetchScoreBoard = useCallback(
    async (showNotice: boolean = false) => {
      if (!isLogin) return;

      try {
        const { code, message } = await RabbitFetch<
          GeneralResponse<ScoreBoardResponse>
        >(API_URL.CONTEST.GET_SCORE_BOARD(cid, scoreboardPage.toString()), {
          method: "GET",
        });

        if (code === 200) {
          const { list, blocked, count } = message;
          setScoreboardList(list);
          setScoreboardBlocked(blocked);
          setContest((prev) => ({
            ...prev,
            participants: count,
          }));
          setScoreboardPageCount(calculatePageCount(count));
        } else {
          emitSnackbar(message, { variant: "error" });
        }

        if (showNotice) emitSnackbar("Scoreboard updated");
      } catch (e) {
        console.error(e);
      } finally {
        setScoreboardRefreshTime(new Date());
      }
    },
    [cid, scoreboardPage, isLogin]
  );
  const fetchClarifyList = useCallback(
    async (showNotice: boolean = false) => {
      if (!isLogin) return;

      try {
        const { code, message } = await RabbitFetch<
          GeneralResponse<Array<ContestClarify<Date>>>
        >(API_URL.CONTEST.GET_CLARIFY(cid), {
          method: "GET",
        });

        if (code === 200) {
          setClarifyList(
            message.map((item) => ({
              ...item,
              created_at: new Date(item.created_at).toLocaleString(),
            }))
          );
        } else {
          emitSnackbar(message, { variant: "error" });
        }
        if (showNotice) emitSnackbar("Clarification updated");
      } catch (e) {
        console.error(e);
      } finally {
        setClarifyRefreshTime(new Date());
      }
    },
    [cid, isLogin]
  );
  const fetchProblems = useCallback(
    async (showNotice: boolean = false) => {
      if (!isLogin) return;

      try {
        const { code, message } = await RabbitFetch<
          GeneralResponse<Array<ContestQuestion>>
        >(API_URL.CONTEST.GET_QUESTIONS(cid), {
          method: "GET",
        });

        if (code === 200) {
          const problemMap = new Map<number, ContestQuestionItem>();
          message.forEach((item) => {
            problemMap.set(item.tid, { id: item.id, subject: item.subject });
          });

          setProblemList(message);
          setProblemMap(problemMap);
        } else {
          emitSnackbar(message, { variant: "error" });
        }

        if (showNotice) emitSnackbar("Problem list updated");
      } catch (e) {
        console.error(e);
      } finally {
        setQuestionRefreshTime(new Date());
      }
    },
    [cid, isLogin]
  );
  const fetchSubmissionList = useCallback(
    async (showNotice: boolean = false) => {
      if (!isLogin) return;

      try {
        const { code, message } = await RabbitFetch<
          GeneralResponse<Array<ContestSubmission>>
        >(API_URL.CONTEST.GET_SUBMISSION_LIST(cid), {
          method: "GET",
        });

        if (code === 200) {
          setSubmissionList(message);
        } else {
          emitSnackbar(message, { variant: "error" });
        }

        if (showNotice) emitSnackbar("Submission list updated");
      } catch (e) {
        console.error(e);
      } finally {
        setSubmissionRefreshTime(new Date());
      }
    },
    [cid, isLogin]
  );
  const connectContestSocket = useCallback(() => {
    if (!isLogin || !myInfo.registered) return;

    contestWebsocket.current = new WebSocket(
      API_URL.CONTEST.SOCKET(cid.toString(), uid.toString())
    );
    contestWebsocket.current.onopen = () => {
      setSocketStatus(true);
      console.log("contest ws opened");
    };
    contestWebsocket.current.onmessage = (e) => {
      const { type, message } = JSON.parse(e.data) as WebsocketMessage;
      if (type === "clarify") {
        setClarifyList((prevClarifyList) => [
          ...prevClarifyList,
          {
            cid: +cid,
            created_at: new Date().toLocaleString(),
            message,
          },
        ]);

        emitSnackbar(`[Clarify] ${message}`, { variant: "warning" });
      }
    };
    contestWebsocket.current.onerror = (e) => {
      console.error("ws error", e);
      setSocketStatus(false);
      emitSnackbar("WebSocket connect failed!", { variant: "error" });
    };
  }, [isLogin, myInfo.registered, cid, uid]);
  const fetchSubmissionInfo = useCallback(
    async (sid: number) => {
      const { code, message } = await RabbitFetch<
        GeneralResponse<ContestSubmission>
      >(API_URL.CONTEST.GET_SUBMISSION_ONE(cid.toString(), sid.toString()), {
        method: "GET",
      });

      if (code === 200) {
        setSubmissionList((previousSubmissionList) => {
          const nextSubmissionList = previousSubmissionList.map((item) => {
            if (item.sid === sid) {
              return {
                ...message,
                created_at: message.created_at.toLocaleString(),
              } as ContestSubmission<string>;
            } else {
              return item;
            }
          });

          return nextSubmissionList;
        });
      } else {
        emitSnackbar(message, { variant: "error" });
      }
    },
    [cid]
  );
  const socketContestSubmissionInfo = useCallback(
    (sid: number) => {
      const ws = new WebSocket(API_URL.SUBMISSION.SOCKET(sid.toString()));
      ws.onopen = () => {
        console.log("ws opened");
      };
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data) as { ok: number };
        if (data.ok === 1) {
          fetchSubmissionInfo(sid);
          ws.close();
        }
      };

      ws.onerror = (e) => {
        console.error("ws error", e);
        emitSnackbar(
          "WebSocket error, you may not be noticed about latest submission result!",
          { variant: "error" }
        );
      };
    },
    [fetchSubmissionInfo]
  );

  useEffect(() => {
    const cleanFunctions: Array<() => any> = [];
    fetchContestInfo().then((currentContest) => {
      if (currentContest.status === 0 && isAdmin) {
        fetchProblems();
      }

      if (currentContest.status > 0) {
        fetchMyInfo();
        fetchScoreBoard();
        fetchClarifyList();
        fetchProblems();
        fetchSubmissionList();
      }

      if (currentContest.status === 1) {
        if (myInfo.registered) {
          connectContestSocket();
          const handleFetchScheduledScoreboard = setInterval(() => {
            fetchScoreBoard();
          }, 10 * 60 * 1000);
          cleanFunctions.push(() => {
            clearInterval(handleFetchScheduledScoreboard);
          });
        }

        const handleRenderRemainTime = setInterval(() => {
          renderRemainTime();
        }, 500);
        cleanFunctions.push(() => {
          clearInterval(handleRenderRemainTime);
        });
      }

      setScoreboardPageCount(currentContest.participants);
    });

    return () => {
      cleanFunctions.forEach((fn) => fn());
    };
  }, [
    isAdmin,
    fetchContestInfo,
    fetchProblems,
    fetchMyInfo,
    fetchScoreBoard,
    fetchClarifyList,
    fetchSubmissionList,
    renderRemainTime,
    connectContestSocket,
    myInfo.registered,
  ]);
  useEffect(() => {
    return () => {
      console.log("will dispose contest ws connection.");
      contestWebsocket.current?.close();
    };
  }, [contestWebsocket]);

  const handleTabChange = useCallback(
    (_: React.ChangeEvent<{}>, newValue: number) => {
      if (newValue === 3) {
        setClarifyRead(clarifyList.length);
      }
      setTabIndex(newValue);
    },
    [clarifyList]
  );
  const handleRegister = useCallback(
    (action: "reg" | "cancel") => async () => {
      const { code, message } = await RabbitFetch<
        GeneralResponse<ContestMyInfo>
      >(API_URL.CONTEST.POST_REGISTER(cid, action), {
        method: "GET",
      });

      if (code === 200) {
        emitSnackbar("Operate Successful!", { variant: "success" });
        fetchMyInfo();
      } else {
        emitSnackbar(message, { variant: "error" });
      }
    },
    [cid, fetchMyInfo]
  );

  const ScoreboardComponent = () => {
    const handleScoreboardPageChange = (
      _: React.ChangeEvent<unknown>,
      newPage: number
    ) => {
      setScoreboardPage(newPage);
    };

    return (
      <>
        {!scoreboardBlocked && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th" align="center">
                    Username
                  </TableCell>
                  <TableCell align="center">Score</TableCell>
                  {problemList.map((item) => (
                    <TableCell key={item.id} align="center">
                      T{item.id}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreboardList.map((item) => (
                  <TableRow key={item.uid}>
                    <TableCell component="th" align="center">
                      <div>#{item.rank}</div>
                      <div>
                        {item.rank === 1 && <span>🥇</span>}
                        {item.rank === 2 && <span>🥈</span>}
                        {item.rank === 3 && <span>🥉</span>} {item.username}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div>{item.score}</div>
                      <div>{displayRelativeTime(item.total_time)}</div>
                    </TableCell>
                    {problemList.map((_, i) => {
                      const cellClassNames: string[] = [];
                      if (
                        item.progress[i].status === 1 &&
                        item.progress[i].bug !== 0
                      ) {
                        cellClassNames.push(classes.acBlock);
                      }
                      if (
                        item.progress[i].status === 1 &&
                        item.progress[i].bug === 0
                      ) {
                        cellClassNames.push(classes.acNobugBlock);
                      }
                      if (
                        item.progress[i].status === 0 &&
                        item.progress[i].bug !== 0
                      ) {
                        cellClassNames.push(classes.waBlock);
                      }

                      return (
                        <TableCell
                          align="center"
                          className={clsx(...cellClassNames)}
                        >
                          {item.progress[i].bug !== 0 && (
                            <div>🐛{item.progress[i].bug}</div>
                          )}
                          {item.progress[i].status === 1 && (
                            <div>
                              {displayRelativeTime(item.progress[i].total_time)}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              className="pagination"
              count={scoreboardPageCount}
              page={scoreboardPage}
              variant="outlined"
              color="primary"
              onChange={handleScoreboardPageChange}
            />
          </TableContainer>
        )}
        {scoreboardBlocked && (
          <div className={classes.scoreBoardBlockedNotice}>
            Invisible ranklist
          </div>
        )}
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button
              variant="text"
              color="primary"
              onClick={() => fetchScoreBoard}
            >
              Last Updated: {scoreboardRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };
  const ProblemsComponent = () => {
    const [submittingList, setSubmittingList] = useState(new Set<string>());

    const handleSubmit = useCallback(
      (tid: string) => async ({ language, code }: IHandleSubmitProps) => {
        if (language === "") {
          emitSnackbar("Select a language first!", { variant: "error" });
          return;
        }

        if (submittingList.has(tid)) {
          emitSnackbar(
            "Last submission hasn't done yet, please wait for a while.",
            { variant: "error" }
          );
          return;
        }

        setSubmittingList((previousSubmittingList) => {
          previousSubmittingList.add(tid);
          return previousSubmittingList;
        });
        try {
          const { code: stautsCode, message } = await RabbitFetch<
            GeneralResponse<number>
          >(API_URL.CONTEST.POST_SUBMIT(cid, tid), {
            method: "POST",
            body: { language, code },
          });

          if (stautsCode === 200) {
            socketContestSubmissionInfo(message);

            const currentSubmissionItem: ContestSubmission<string> = {
              sid: message,
              cid: +cid,
              uid,
              tid: +tid,
              status: 0,
              total_time:
                ((new Date().getTime() -
                  new Date(contest.start_time).getTime()) /
                  1000) |
                0,
              created_at: new Date().toLocaleString(),
            };
            setSubmissionList((previousSubmissionList) => [
              ...previousSubmissionList,
              currentSubmissionItem,
            ]);
          } else {
            emitSnackbar(`Submission failed: ${message}`, { variant: "error" });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setSubmittingList((previousSubmittingList) => {
            previousSubmittingList.delete(tid);
            return previousSubmittingList;
          });
        }
      },
      [submittingList]
    );
    return (
      <>
        {problemList.map((item, i) => (
          <Accordion key={item.tid} TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                [T{(i + 1).toString()}] {item.subject}
              </Typography>
              <Typography className={classes.secondaryHeading}>
                🌟 {item.score}
                {myInfo && myInfo.progress[i] && myInfo.progress[i].bug > 0 && (
                  <span className={classes.questionSubtitleTip}>
                    🐛 {myInfo.progress[i].bug}
                  </span>
                )}
                {myInfo &&
                  myInfo.progress[i] &&
                  myInfo.progress[i].status === 1 && (
                    <span className={classes.questionSubtitleTip}>
                      ✅ {displayRelativeTime(myInfo.progress[i].total_time)}
                    </span>
                  )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.problemDetailContainer}>
                <DescriptionComponent question={item} isContest={true} />
                <h3>Submit</h3>
                <SubmitComponent
                  tid={item.tid.toString()}
                  onSubmit={handleSubmit(item.tid.toString())}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button
              variant="text"
              color="primary"
              onClick={() => fetchProblems}
            >
              Last Updated: {questionRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };
  const SubmissionsComponent = () => {
    const handleExpanded = (sid: number) => async (
      _: React.ChangeEvent<{}>,
      expanded: boolean
    ) => {
      if (!expanded) return;

      if (
        submissionCaseInfo.has(sid) &&
        submissionCaseInfo.get(sid)!.status === "ING"
      ) {
        const { code, message } = await RabbitFetch<
          GeneralResponse<Submission>
        >(API_URL.SUBMISSION.GET_DETAIL(sid.toString()), {
          method: "GET",
        });

        if (code === 200) {
          setSubmissionCaseInfo((previousSubmissionCaseInfo) => {
            previousSubmissionCaseInfo.set(sid, message);
            return previousSubmissionCaseInfo;
          });
        } else {
          emitSnackbar(message, { variant: "error" });
        }
      }
    };

    return (
      <>
        {submissionList.map((item) => (
          <Accordion
            key={item.sid}
            TransitionProps={{ unmountOnExit: true }}
            onChange={handleExpanded(item.sid)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                [T{(problemMap.get(item.tid)?.id ?? -1) + 1}]{" "}
                {problemMap.get(item.tid)?.subject ?? ""}
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {item.status === 1 && (
                  <span className={classes.questionSubtitleTip}>
                    ✅ {displayRelativeTime(item.total_time)}
                  </span>
                )}
                {item.status === -1 && (
                  <span className={classes.questionSubtitleTip}>
                    🐛 {displayRelativeTime(item.total_time)}
                  </span>
                )}
                {item.status === 0 && (
                  <span className={classes.questionSubtitleTip}>
                    ⌛️ {displayRelativeTime(item.total_time)}
                  </span>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {submissionCaseInfo.has(item.sid) && (
                <div className={classes.caseDotListContainer}>
                  {submissionCaseInfo
                    .get(item.sid)!
                    .judge.map((caseItem, caseIdx) => (
                      <SubmissionDotComponent
                        key={caseIdx}
                        dot={caseItem}
                        index={caseIdx}
                      />
                    ))}
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button
              variant="text"
              color="primary"
              onClick={() => fetchSubmissionList}
            >
              Last Updated: {submissionRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };
  const ClarificationsComponent = () => {
    return (
      <>
        {clarifyList.map((item) => (
          <Accordion key={item.cid}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.fullHeading}>
                {item.created_at.toString()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.message}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button
              variant="text"
              color="primary"
              onClick={() => fetchClarifyList}
            >
              Last Updated: {clarifyRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };
  const InformationComponent = () => {
    return (
      <>
        {(contest.status === 0 || !myInfo.registered) && (
          <div>
            <h3>Operations</h3>
            <div className={classes.btnContainer}>
              {!myInfo.registered && (
                <Button
                  id="register"
                  color="primary"
                  variant="contained"
                  onClick={handleRegister("reg")}
                >
                  Register
                </Button>
              )}
              {contest.status === 0 && myInfo.registered && (
                <Button
                  id="unregister"
                  color="secondary"
                  variant="contained"
                  onClick={handleRegister("cancel")}
                >
                  Unregister
                </Button>
              )}
            </div>
            {myInfo.registered && (
              <div>
                <h3>My Information</h3>
                <div>Score: {myInfo.score}</div>
                <div>Time Used: {displayRelativeTime(myInfo.total_time)}</div>
                {myInfo.rank !== 0 && <div>Rank: {myInfo.rank}</div>}
              </div>
            )}
            <div>
              <h3>Contest Information</h3>
              <div>Start Time: {contest.start_time}</div>
              <div>Rank Invisible Time: {contest.block_time}</div>
              <div>End Time: {contest.end_time}</div>
              <div>Penalty Time: {displayRelativeTime(contest.penalty)}</div>
            </div>
          </div>
        )}
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button variant="text" color="primary" onClick={() => fetchMyInfo}>
              Last Updated: {infoRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };

  const clarificationBadage = (
    <Badge badgeContent={clarifyList.length - clarifyRead} color="primary">
      CLARIFICATIONS
    </Badge>
  );

  return (
    <>
      <h1>
        {myInfo.rank === 1 && <span>🥇</span>}
        {myInfo.rank === 2 && <span>🥈</span>}
        {myInfo.rank === 3 && <span>🥉</span>}
        {contest.name}
      </h1>
      {isLogin && (
        <div className={classes.statusContainer}>
          {contest.status === 1 && socketStatus && (
            <div className={clsx(classes.socketOk, classes.statusContainer)}>
              Remain Time: {remainTime}
              {scoreboardBlocked && ", Ranklist hidden"}
            </div>
          )}
          {contest.status === 1 && !socketStatus && (
            <div className={clsx(classes.socketFail, classes.statusContainer)}>
              WebSocket failed to connect, Remain Time: {remainTime}
              {scoreboardBlocked && ", Ranklist hidden"}
            </div>
          )}
          {contest.status === 3 && (
            <div className={clsx(classes.contestOk, classes.statusContainer)}>
              Contest ended, analysising...
            </div>
          )}
        </div>
      )}

      <Paper className={classes.main}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Scoreboard" />
          <Tab label="Problems" />
          <Tab label="Submissions" />
          <Tab label={clarificationBadage} />
          <Tab label="Information" />
        </Tabs>
        <div className={classes.bodyContainer}>
          {tabIndex === 0 && <ScoreboardComponent />}
          {tabIndex === 1 && <ProblemsComponent />}
          {tabIndex === 2 && <SubmissionsComponent />}
          {tabIndex === 3 && <ClarificationsComponent />}
          {tabIndex === 4 && <InformationComponent />}
        </div>
      </Paper>
    </>
  );
};

export default DetailContest;
