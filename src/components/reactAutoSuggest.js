import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { Button } from "@material-ui/core";
import EmailCard from "./replyEmailsCard";

let TopEmailData = [];

const suggestions = [
  { name: "shubham.kamra@innovaccer.com" },
  { name: "mrinalini.mittal@innovaccer.com" },
  { name: "ankit.maheshwari@innovaccer.com" },
  { name: "ambuj.singh@innovaccer.com" },
  { name: "satyajit.menon@innovaccer.com" },
  { name: "hr@innovaccer.com" },
  { name: "animesh.sharma@innovaccer.com" },
  { name: "garima.rawal@innovaccer.com" },
];

function renderInput(inputProps) {
  const { value, onChange, chips, ref, ...other } = inputProps;

  return (
    <ChipInput
      clearInputValueOnChange
      onUpdateInput={onChange}
      value={chips}
      inputRef={ref}
      {...other}
      variant="outlined"
      alwaysShowPlaceholder
      placeholder="Type your Priorities"
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      onMouseDown={(e) => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <span key={String(index)}>{part.text}</span>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter((suggestion) => {
        const keep =
          count < 5 &&
          suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: "relative",
  },
  suggestionsContainerOpen: {
    position: "absolute",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  suggestion: {
    display: "block",
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  textField: {
    width: "100%",
  },
});

class ReactAutosuggest extends Component {
  state = {
    // value: '',
    suggestions: [],
    value: [],
    textFieldInput: "",
    signal: 0,
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handletextFieldInputChange = (event, { newValue }) => {
    this.setState({
      textFieldInput: newValue,
    });
  };

  handleAddChip(chip) {
    if (this.props.allowDuplicates || this.state.value.indexOf(chip) < 0) {
      this.setState(({ value }) => ({
        value: [...value, chip],
        textFieldInput: "",
      }));
      TopEmailData.push(chip);
      // console.log("email Data is ", TopEmailData);
    }
  }

  handleDeleteChip(chip, index) {
    this.setState(({ value }) => {
      const temp = value.slice();
      temp.splice(index, 1);
      return {
        value: temp,
      };
    });
    TopEmailData.splice(index, 1);
  }

  handleOnSave = () => {
    // console.log(JSON.parse(window.localStorage.getItem("topEmails")));
    let topEmails = {};
    let count = 1;
    TopEmailData.forEach((element) => {
      topEmails["email" + count] = element;
      count += 1;
    });
    window.localStorage.setItem("topEmails", JSON.stringify(topEmails));
    this.setState({ signal: this.state.signal + 1 });
  };

  componentDidMount() {
    TopEmailData = [];
    let emailData = JSON.parse(window.localStorage.getItem("topEmails"));
    for (let email in emailData) {
      if (
        this.props.allowDuplicates ||
        this.state.value.indexOf(emailData[email]) < 0
      ) {
        this.setState(({ value }) => ({
          value: [...value, emailData[email]],
          textFieldInput: "",
        }));
        TopEmailData.push(emailData[email]);
      }
    }
  }

  render() {
    const { classes, ...other } = this.props;

    return (
      <React.Fragment>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={(e, { suggestionValue }) => {
            this.handleAddChip(suggestionValue);
            e.preventDefault();
          }}
          focusInputOnSuggestionClick
          inputProps={{
            chips: this.state.value,
            value: this.state.textFieldInput,
            onChange: this.handletextFieldInputChange,
            onAdd: (chip) => this.handleAddChip(chip),
            onDelete: (chip, index) => this.handleDeleteChip(chip, index),
            ...other,
          }}
        />
        <br></br>
        <Button variant="contained" color="inherit" onClick={this.handleOnSave}>
          Save
        </Button>
        <EmailCard signal={this.state.signal}></EmailCard>
      </React.Fragment>
    );
  }
}

export const ReactAutosuggestExample = withStyles(styles)(ReactAutosuggest);
// export const EmailData = TopEmailData;
