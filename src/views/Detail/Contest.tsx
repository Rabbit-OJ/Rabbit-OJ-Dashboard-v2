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
import {
  useDetailContestStyles,
  useSubmissionDotListComponentStyles,
} from "./Contest.style";
import {
  DEFAULT_CLARIFY_LIST,
  DEFAULT_CONTEST,
  DEFAULT_MY_INFO,
  DEFAULT_PROBLEM,
  DEFAULT_SCOREBOARD_LIST,
  DEFAULT_SUBMISSION_LIST,
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
import {
  ContestSubmission,
  JudgeResult,
  Submission,
} from "../../model/submission";
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

interface IRemainTimeComponentProps {
  contest: Contest<string>;
  scoreboardBlocked: boolean;
  socketStatus: boolean;
}

interface ICaseDotListContainer {
  sid: number;
}

const SubmissionDotListComponent = ({ sid }: ICaseDotListContainer) => {
  const [judge, setJudge] = useState<JudgeResult[]>([]);

  const fetchJudgeInfo = useCallback(async () => {
    const { code, message } = await RabbitFetch<GeneralResponse<Submission>>(
      API_URL.SUBMISSION.GET_DETAIL(sid.toString()),
      {
        method: "GET",
        suppressLoading: true, // todo
      }
    );
    if (code === 200) {
      setJudge(message.judge);
    } else {
      emitSnackbar(message, { variant: "error" });
    }
  }, [sid]);

  useEffect(() => {
    fetchJudgeInfo();
  }, [fetchJudgeInfo]);

  const classes = useSubmissionDotListComponentStyles();
  return (
    <>
      <div className={classes.caseDotListContainer}>
        {judge.map((caseItem, caseIdx) => (
          <SubmissionDotComponent
            key={caseIdx}
            dot={caseItem}
            index={caseIdx}
          />
        ))}
      </div>
    </>
  );
};

const DetailContest = () => {
  const { cid } = useParams<{ cid: string }>();

  const [contest, setContest] = useState(DEFAULT_CONTEST);
  const [myInfo, setMyInfo] = useState(DEFAULT_MY_INFO);
  const [socketStatus, setSocketStatus] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [clarifyList, setClarifyList] = useState(DEFAULT_CLARIFY_LIST);
  const [clarifyRead, setClarifyRead] = useState(0);
  const [submissionList, setSubmissionList] = useState(DEFAULT_SUBMISSION_LIST);
  const [problemList, setProblemList] = useState(DEFAULT_PROBLEM);
  const [scoreboardBlocked, setScoreboardBlocked] = useState(false);
  const [scoreboardPage, setScoreboardPage] = useState(1);
  const [scoreboardPageCount, setScoreboardPageCount] = useState(1);
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
  const [problemMap, setProblemMap] = useState(
    new Map<number, ContestQuestionItem>()
  );
  const { isLogin, isAdmin, uid } = useTypedSelector((state) => ({
    isLogin: state.user.isLogin,
    isAdmin: state.user.isAdmin,
    uid: state.user.uid,
  }));
  const contestWebsocket = useRef<null | WebSocket>(null);
  const classes = useDetailContestStyles();

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

        if (showNotice) {
          emitSnackbar("Personal info updated", { variant: "info" });
        }

        return message;
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

        if (showNotice) emitSnackbar("Scoreboard updated", { variant: "info" });
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
        if (showNotice)
          emitSnackbar("Clarification updated", { variant: "info" });
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

        if (showNotice)
          emitSnackbar("Problem list updated", { variant: "info" });
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

        if (showNotice)
          emitSnackbar("Submission list updated", { variant: "info" });
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

        emitSnackbar(`[Clarify] ${message}`, { variant: "info" });
      }
    };
    contestWebsocket.current.onerror = (e) => {
      console.error("ws error", e);
      setSocketStatus(false);
      emitSnackbar("WebSocket connect failed!", { variant: "error" });
    };
  }, [isLogin, myInfo.registered, cid, uid]);
  const fetchSubmissionInfo = useCallback(
    async (sid: number, notice: boolean = false) => {
      const { code, message } = await RabbitFetch<
        GeneralResponse<ContestSubmission>
      >(API_URL.CONTEST.GET_SUBMISSION_ONE(cid.toString(), sid.toString()), {
        method: "GET",
      });

      if (code === 200) {
        if (notice) {
          const submissionStatus = message.status;
          if (submissionStatus === 1) {
            emitSnackbar(`Submission (#${sid}) for T${message.tid} Accepted!`, {
              variant: "success",
            });
          } else if (submissionStatus === -1) {
            emitSnackbar(
              `Submission (#${sid}) for T${message.tid} Unaccepted!`,
              { variant: "warning" }
            );
          }
        }

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
          fetchSubmissionInfo(sid, true);
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

  useEffect(
    () => {
      const cleanFunctions: Array<() => any> = [];
      fetchContestInfo().then((currentContest) => {
        if (currentContest.status === 0 && isAdmin) {
          fetchProblems();
        }

        if (currentContest.status > 0) {
          if (currentContest.status === 1) {
            fetchMyInfo().then((myCurrentInfo) => {
              if (myCurrentInfo?.registered) {
                connectContestSocket();

                // todo: order problem
                const handleFetchScheduledScoreboard = setInterval(() => {
                  fetchScoreBoard();
                }, 10 * 60 * 1000);

                cleanFunctions.push(() => {
                  clearInterval(handleFetchScheduledScoreboard);
                });
              }
            });
          } else {
            fetchMyInfo();
          }
          fetchScoreBoard();
          fetchClarifyList();
          fetchProblems();
          fetchSubmissionList();
        }

        setScoreboardPageCount(currentContest.participants);
      });

      return () => {
        cleanFunctions.forEach((fn) => fn());
      };
    },

    // eslint-disable-next-line
    [cid, isAdmin, isLogin]
  );
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
        method: "POST",
      });

      if (code === 200) {
        emitSnackbar("Operate Successful!", { variant: "success" });
        fetchMyInfo();
      } else {
        emitSnackbar(message, { variant: "error" });
      }
    },
    // eslint-disable-next-line
    [cid]
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
                          key={i}
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
            {scoreboardPageCount >= 2 && (
              <Pagination
                className="pagination"
                count={scoreboardPageCount}
                page={scoreboardPage}
                variant="outlined"
                color="primary"
                onChange={handleScoreboardPageChange}
              />
            )}
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
              onClick={() => fetchScoreBoard(true)}
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
            emitSnackbar(`T${tid} code submitted`, { variant: "info" });
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
              currentSubmissionItem,
              ...previousSubmissionList,
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
                [T{(item.id + 1).toString()}] {item.subject}
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
              onClick={() => fetchProblems(true)}
            >
              Last Updated: {questionRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };

  const SubmissionsComponent = () => {
    const [expanded, setExpanded] = React.useState(-1);
    const handleChange = (panel: number) => (
      _: React.ChangeEvent<{}>,
      isExpanded: boolean
    ) => {
      setExpanded(isExpanded ? panel : -1);
    };

    return (
      <>
        {submissionList.map((item) => (
          <Accordion
            key={item.sid}
            TransitionProps={{ unmountOnExit: true }}
            expanded={expanded === item.sid}
            onChange={handleChange(item.sid)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                [T{(problemMap.get(item.tid)?.id ?? 0) + 1}]{" "}
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
              <SubmissionDotListComponent sid={item.sid} />
            </AccordionDetails>
          </Accordion>
        ))}
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button
              variant="text"
              color="primary"
              onClick={() => fetchSubmissionList(true)}
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
              onClick={() => fetchClarifyList(true)}
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
          </div>
        )}
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
        {contest.status === 1 && (
          <div className={classes.refreshTimeContainer}>
            <Button
              variant="text"
              color="primary"
              onClick={() => fetchMyInfo(true)}
            >
              Last Updated: {infoRefreshTime.toLocaleString()}
            </Button>
          </div>
        )}
      </>
    );
  };
  const RemainTimeComponent = ({
    contest,
    scoreboardBlocked,
    socketStatus,
  }: IRemainTimeComponentProps) => {
    const calcRemainTime = (endTime: string) => {
      const now = new Date();
      const endContest = new Date(endTime);

      return displayRelativeTime(
        ((endContest.getTime() - now.getTime()) / 1000) | 0
      );
    };

    const [remainTime, setRemainTime] = useState(
      calcRemainTime(contest.end_time)
    );
    useEffect(() => {
      const handleRenderRemainTime = setInterval(() => {
        setRemainTime(calcRemainTime(contest.end_time));
      }, 500);
      return () => {
        clearInterval(handleRenderRemainTime);
      };
    }, [contest.end_time]);

    return (
      <div className={classes.statusContainer}>
        {contest.status === 1 && socketStatus && (
          <div className={clsx(classes.socketOk, classes.statusContainer)}>
            WebSocket online, Remain Time: {remainTime}
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
        <RemainTimeComponent
          contest={contest}
          socketStatus={socketStatus}
          scoreboardBlocked={scoreboardBlocked}
        />
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
