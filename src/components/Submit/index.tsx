import React, { useState } from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { QuestionDetail } from "../../model/question-detail";
import { LanguageResponse } from "../../model/language";
import { ContestQuestion } from "../../model/contest-question";

interface IProps {
  question: QuestionDetail | ContestQuestion;
}

const DEFAULT_LANGUAGE: LanguageResponse = [
  { name: "C++/17", value: "cpp17" },
  { name: "C++/20", value: "cpp20" },
];

const useStyles = makeStyles(() =>
  createStyles({
    submitContainer: {
      display: "flex",
      width: "100%",
      flexFlow: "row wrap",
    },
    codeSubmit: {
      width: "100%",
      margin: "24px 0",
    },
    selectContainter: {
      minWidth: "192px"
    }
  })
);

const SubmitComponent = ({ question }: IProps) => {
  const classes = useStyles();
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE[0].value);

  const handleSubmit = () => {};
  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const { value } = event.target;
    setLanguage(value as string);
  };

  return (
    <div className={classes.submitContainer}>
      <FormControl>
        <InputLabel>Language</InputLabel>
        <Select value={language} onChange={handleLanguageChange} className={classes.selectContainter}>
          {DEFAULT_LANGUAGE.map((item, idx) => (
            <MenuItem key={idx} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Code"
        variant="outlined"
        className={classes.codeSubmit}
        multiline
        rows="24"
      />
      <Button
        id="submit"
        color="primary"
        variant="contained"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default SubmitComponent;
