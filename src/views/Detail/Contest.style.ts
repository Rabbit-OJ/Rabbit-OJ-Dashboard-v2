import { createStyles, makeStyles } from "@material-ui/core/styles";

const useDetailContestStyles = makeStyles(() =>
  createStyles({
    main: {
      margin: "24px 0",
    },
    bodyContainer: {
      padding: "24px",
    },
    heading: {
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    fullHeading: {
      flexBasis: "100%",
      flexShrink: 0,
      flexGrow: 1,
    },
    secondaryHeading: {
      color: "gray",
    },
    refreshTimeContainer: {
      marginTop: "12px",
      display: "flex",
      justifyContent: "flex-end",
    },
    acBlock: {
      backgroundColor: "#d3ffc7c8",
    },
    acNobugBlock: {
      backgroundColor: "#b3f9a2c8",
    },
    myselfBlock: {
      backgroundColor: "#c0fff6c8",
    },
    waBlock: {
      backgroundColor: "#ffbcbcc8",
    },
    rankContainer: {
      fontSize: "smaller",
      color: "gray",
    },
    usernameItem: {
      margin: "0",
    },
    questionsContainer: {
      margin: "12px 0",
      padding: "12px",
    },
    questionSubtitleTip: {
      margin: "0 0 0 1em",
    },
    timeContainer: {
      textAlign: "center",
    },
    statusContainer: {
      marginTop: "-24px",
      fontSize: "smaller",
    },
    socketOk: {
      color: "rgb(0, 184, 0)",
    },
    socketFail: {
      color: "red",
    },
    contestOk: {
      color: "orange",
    },
    scoreBoardBlockedNotice: {
      display: "flex",
      justifyContent: "center",
      margin: "12px 0",
    },
    btnContainer: {
      display: "flex",
      "& button": {
        margin: "0 12px 0 0",
      },
    },
    problemDetailContainer: {
      display: "flex",
      flexGrow: 1,
      flexShrink: 1,
      flexFlow: 'column',
    },
    caseDotListContainer: {
      display: "flex",
      flexFlow: "row wrap",
    }
  })
);

export default useDetailContestStyles;
