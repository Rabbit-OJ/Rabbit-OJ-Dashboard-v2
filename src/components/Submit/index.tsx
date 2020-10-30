import React, { useEffect, useState } from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { useTypedSelector } from "../../data";

interface IProps {
  tid: string;
  onSubmit?: (args: { language: string; code: string }) => any;
}

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
      minWidth: "192px",
    },
  })
);

const SubmitComponent = ({ tid, onSubmit }: IProps) => {
  const classes = useStyles();
  const { languages } = useTypedSelector((state) => ({
    languages: state.language,
  }));

  const [language, setLanguage] = useState(languages[0]?.value ?? "");
  const [code, setCode] = useState("");

  useEffect(() => {
    const previousCode = localStorage.getItem(tid);
    if (previousCode) {
      setCode(previousCode);
    }
  }, [tid]);
  useEffect(() => {
    const handle = setInterval(() => {
      localStorage.setItem(tid, code);
    }, 1500);

    return () => {
      clearInterval(handle);
    };
  });

  const handleSubmit = () => {
    onSubmit && onSubmit({ code, language });
  };
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
        <Select
          value={language}
          onChange={handleLanguageChange}
          className={classes.selectContainter}
        >
          {languages.map((item, idx) => (
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
        value={code}
        onChange={(e) => setCode(e.target.value)}
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
