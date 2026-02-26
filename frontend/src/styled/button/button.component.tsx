import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { StyledButton } from "./button.styled";
import {
  blue1,
  greenColor,
  primaryColor,
  textColor,
  white,
} from "../../assets/globals/global-constants";
import {
  IButtonProps,
  ISubmitButtonProps,
  IUploadButtonProps,
  IOutlinedButtonProps,
  ISubmitViewButtonProps,
} from "./button.interface";

const useStyles = makeStyles({
  btnRoot: {
    backgroundColor: `${primaryColor} !important`,
    color: "white !important",
  },
});
const useStylesUpload = makeStyles({
  btnRoot: {
    backgroundColor: `${primaryColor} !important`,
    color: "white !important",
    boxShadow: "unset !important",
  },
});

const useStylesUploadWhite = makeStyles({
  btnRoot: {
    color: `${primaryColor} !important`,
    backgroundColor: "white !important",
    boxShadow: "unset !important",
  },
});
const useStylesOutlined = makeStyles({
  btnRoot: {
    border: `1px solid ${primaryColor} !important`,
    height: "40px",
    color: `${primaryColor} !important`,
    background: `${white} !important`,
    boxShadow: "unset !important",
    margin: "0 !important",
  },
});
const useStylesLink = makeStyles({
  btnRoot: {
    height: "40px",
    color: `${primaryColor} !important`,
    background: `${white} !important`,
    boxShadow: "unset !important",
    margin: "0 !important",
    fontSize: "11px !important",
  },
});

const ButtonComponent = ({
  buttonName,
  className,
  onClick,
  id,
}: IButtonProps) => {
  const classes = useStyles();

  return (
    <Button
      onClick={onClick}
      classes={{ root: classes.btnRoot }}
      className={className}
      id={id}
    >
      {buttonName}
    </Button>
  );
};

export const CategoriesButtonComponent = ({
  buttonName,
  disabled = false,
  onClick,
  className,
}: IOutlinedButtonProps) => {
  return (
    <Button
      variant="contained"
      size="small"
      type="submit"
      disabled={disabled}
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.12)" : `${primaryColor}`,
        color: disabled ? "rgba(0, 0, 0, 0.26)" : `${white}`,
        borderRadius: 12,
        margin: "10px",
        textTransform: "none",
      }}
    >
      {buttonName}
    </Button>
  );
};

export const CreateAccountButtonComponent = ({
  onClick,
  buttonName,
  disabled = false,
  className,
}: IButtonProps) => {
  return (
    <StyledButton disabled={disabled} className={className} onClick={onClick}>
      {buttonName}
    </StyledButton>
  );
};

export const SubmitButtonComponent = ({
  buttonName,
  disabled = false,
  className,
  onClick,
}: IButtonProps) => {
  return (
    <Button
      variant="contained"
      size="large"
      type="submit"
      disabled={disabled}
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.12)" : `${primaryColor}`,
        color: disabled ? "rgba(0, 0, 0, 0.26)" : `${white}`,
        textTransform: "none",
      }}
    >
      {buttonName}
    </Button>
  );
};

export const ViewMoreButtonComponent = ({
  buttonName,
  disabled = false,
  className,
  endIcon,
}: ISubmitViewButtonProps) => {
  return (
    <Button
      variant="contained"
      size="large"
      type="submit"
      endIcon={endIcon}
      disabled={disabled}
      className={className}
      sx={{
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.12)" : `${primaryColor}`,
        color: disabled ? "rgba(0, 0, 0, 0.26)" : `${white}`,
        textTransform: "none",
        "&:hover": {
          backgroundColor : "rgb(255, 130, 92)",
        },
      }}
    >
      {buttonName}
    </Button>
  );
};

export const SubmitButtonWhiteComponent = ({
  buttonName,
  disabled = false,
  className,
}: ISubmitButtonProps) => {
  return (
    <Button
      variant="contained"
      size="small"
      type="submit"
      fullWidth
      disabled={disabled}
      className={className}
      style={{
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.12)" : "white",
        color: disabled ? "rgba(0, 0, 0, 0.26)" : `${primaryColor}`,
        height: "30px",
        boxShadow: "unset",
        padding: "20px",
        textTransform: "none",
      }}
    >
      {buttonName}
    </Button>
  );
};

export const UploadButtonComponent = ({
  buttonName,
  style,
  onChange,
  accept,
}: IUploadButtonProps) => {
  const classes = useStylesUpload();

  return (
    <Button
      variant="contained"
      component="label"
      classes={{ root: classes.btnRoot }}
      style={style}
      size="small"
    >
      {buttonName}
      <input hidden accept={accept} type="file" onChange={onChange} />
    </Button>
  );
};

export const UploadButtonWhiteComponent = ({
  buttonName,
  style,
  onChange,
  accept,
}: IUploadButtonProps) => {
  const classes = useStylesUploadWhite();

  return (
    <Button
      variant="contained"
      component="label"
      classes={{ root: classes.btnRoot }}
      style={style}
      size="small"
    >
      {buttonName}
      <input hidden accept={accept} type="file" onChange={onChange} />
    </Button>
  );
};

export const OutlinedButtonComponent = ({
  buttonName,
  onClick,
  className,
}: IOutlinedButtonProps) => {
  const classes = useStylesOutlined();

  return (
    <Button
      variant="contained"
      classes={{ root: classes.btnRoot }}
      size="small"
      fullWidth
      onClick={onClick}
      className={className}
    >
      {buttonName}
    </Button>
  );
};

export const LinkButtonComponent = ({
  buttonName,
  onClick,
  className,
}: IOutlinedButtonProps) => {
  const classes = useStylesLink();

  return (
    <Button
      variant="text"
      classes={{ root: classes.btnRoot }}
      size="small"
      onClick={onClick}
      className={className}
    >
      {buttonName}
    </Button>
  );
};

export default ButtonComponent;
