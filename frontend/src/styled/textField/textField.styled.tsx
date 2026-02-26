import React, { useState, useId } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import { primaryColor } from "../../assets/globals/global-constants";

interface Props {
  placeHolder: string;
  value: string;
  hasError?: boolean;
  errorMessage?: string;
  handleTextChange: Function;
  handleSubmit?: Function;
  disabled?: boolean;
  required?: boolean;
  inputStyles?: any;
  ref?: any;
  showInfo?: boolean;
}

const useStyles: Function = makeStyles({
  root: {
    marginTop: "0px !important",
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#2E2E2E",
    },
  },
});

const TextInput = (props: Props) => {
  const classes = useStyles();
  const id = useId();

  const {
    placeHolder,
    value,
    hasError,
    errorMessage,
    handleTextChange,
    disabled = false,
    required = true,
    inputStyles,
    handleSubmit = () => {},
    ref,
    showInfo = false,
  } = props;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.root}`}
      margin={"normal"}
    >
      <InputLabel id={id} required error={hasError} size="small">
        {placeHolder}
      </InputLabel>
      <OutlinedInput
        id={id}
        value={value}
        error={hasError}
        disabled={disabled}
        label={placeHolder}
        required={required}
        autoComplete="email"
        onKeyUp={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        onChange={(e) => handleTextChange(e.target.value)}
        aria-describedby={`component-error-${placeHolder}`}
        style={inputStyles}
        inputProps={inputStyles}
        ref={ref}
        size={"small"}
        endAdornment={
          showInfo && (
            <InputAdornment position="end">
              <Tooltip title="Introduce yourself in a short video not more than 5 minutes stating your academic and professional background in addition to why you are willing to join this program and why you see yourself fit. ">
                <InfoIcon
                  style={{ color: primaryColor, cursor: "pointer" }}
                  fontSize="small"
                />
              </Tooltip>
            </InputAdornment>
          )
        }
      />
      <FormHelperText
        style={{
          display: hasError ? "block" : "none",
          color: "red",
          fontSize: 10,
        }}
        id={id}
      >
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};

const PasswordInput = (props: Props) => {
  const classes = useStyles();
  const id = useId();

  const {
    placeHolder,
    value,
    hasError,
    errorMessage,
    handleTextChange,
    required = true,
    inputStyles,
    handleSubmit = () => {},
    ref,
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`pb-3 ${classes.root}`}
      margin={"normal"}
    >
      <InputLabel id={id} required error={hasError} size={"small"}>
        {placeHolder}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        error={hasError}
        label={placeHolder}
        required={required}
        size={"small"}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        aria-describedby={`component-error-${placeHolder}`}
        style={inputStyles}
        inputProps={inputStyles}
        ref={ref}
      />
      <FormHelperText
        style={{
          display: hasError ? "block" : "none",
          color: "red",
          fontSize: 10,
        }}
        id={id}
      >
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};

const MobileNumberInput = (props: Props) => {
  const classes = useStyles();
  const id = useId();

  const {
    placeHolder,
    value,
    hasError,
    errorMessage,
    handleTextChange,
    disabled = false,
    required = true,
    inputStyles,
    handleSubmit = () => {},
    ref,
  } = props;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.root}`}
      margin={"normal"}
    >
      <InputLabel id={id} required error={hasError} size="small">
        {placeHolder}
      </InputLabel>
      <OutlinedInput
        id={id}
        value={value}
        error={hasError}
        disabled={disabled}
        label={placeHolder}
        required={required}
        type={"number"}
        onKeyUp={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        onChange={(e) => handleTextChange(e)}
        aria-describedby={`component-error-${placeHolder}`}
        style={inputStyles}
        inputProps={inputStyles}
        ref={ref}
        size={"small"}
        startAdornment={<InputAdornment position="start">201</InputAdornment>}
      />
      <FormHelperText
        style={{
          display: hasError ? "block" : "none",
          color: "red",
          fontSize: 10,
        }}
        id={id}
      >
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};

const NumberInput = (props: Props) => {
  const classes = useStyles();
  const id = useId();

  const {
    placeHolder,
    value,
    hasError,
    errorMessage,
    handleTextChange,
    disabled = false,
    required = true,
    inputStyles,
    handleSubmit = () => {},
    ref,
  } = props;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      className={`${classes.root}`}
      margin={"normal"}
    >
      <InputLabel id={id} required error={hasError} size="small">
        {placeHolder}
      </InputLabel>
      <OutlinedInput
        id={id}
        value={value}
        error={hasError}
        disabled={disabled}
        label={placeHolder}
        required={required}
        type={"number"}
        onKeyUp={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        onChange={(e) => handleTextChange(e)}
        aria-describedby={`component-error-${placeHolder}`}
        style={inputStyles}
        inputProps={inputStyles}
        ref={ref}
        size={"small"}
      />
      <FormHelperText
        style={{
          display: hasError ? "block" : "none",
          color: "red",
          fontSize: 10,
        }}
        id={id}
      >
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
};
export { TextInput, PasswordInput, MobileNumberInput, NumberInput };
