import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { primaryColor } from "../../assets/globals/global-constants";
import { CreateAccountButtonComponent } from "../../styled/button/button.component";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import "react-phone-number-input/style.css";
import { Alert, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LogoImage from "../../assets/images/BMS.svg";
import { useDispatch } from "react-redux";
import { setCredentials, setUser, setEmail } from "../../auth/authSlice";
import ArrowBack from "@mui/icons-material/ArrowBack";
import BackdropComponent from "../../styled/backdrop/backdrop.component";
import { withTranslation } from "react-i18next";
interface Props {
  t: any;
}
function SignIn({ t }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlertFail, setShowAlertFail] = useState(false);
  const [showError, setShowError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const dispatch = useDispatch();
  const [openLoad, setopenLoad] = useState(false);

  const navigate = useNavigate();

  const validationSchema = yup.object({
    usernameOrEmail: yup.string().required("Username or Email is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "/auth/login",
          values,
          {
            withCredentials: true,
          }
        );

        // Log the entire response to see all headers

        // Verify the user token
        const verifyResponse = await axios.get(
          "/auth/user-verify",
          {
            withCredentials: true,
          }
        );

        // Handle verification status as needed
        if (
          verifyResponse.status === 200 &&
          verifyResponse.statusText === "OK"
        ) {
          // The token is verified
          console.log("User token is verified");
        } else {
          // The token is not verified
          console.log("User token is not verified");
          // Handle accordingly, e.g., show an error message
        }
        dispatch(setEmail({ email: response.data.user.email }));
        dispatch(setCredentials({ token: response.data.accessToken }));
        dispatch(setUser({ user: response.data.user }));

        setShowSuccessAlert(true);
        setopenLoad(true);
        if (!response.data.user.emailValidate) {
          // User email is not verified, navigate to /verify-email
          setTimeout(() => {
            navigate("/email-verification");
          }, 1500);
        } else {
          // User email is verified, navigate to /
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
        // Handle the response as needed
      } catch (error: any) {
        console.error("API error:", error.message);

        if (error.response) {
          console.error("API error:", error.response.data);
          const errorMessage = error.response.data.message;
          setShowError(errorMessage);
          setShowAlertFail(true);

          if (
            error.response.status === 401 &&
            errorMessage.includes(
              "Email not verified. Please verify your email before logging in."
            )
          ) {
            const errorMessage = error.response.data.message;

            formik.setErrors({
              usernameOrEmail: errorMessage.includes("usernameOrEmail")
                ? errorMessage
                : "",
            });

            setShowError(errorMessage);
            setShowAlertFail(true);
            setTimeout(() => {
              navigate("/email-verification");
            }, 1500);
          }
        } else if (error.request) {
          console.error("API error:", "No response received");
        } else {
          console.error("API error:", error.message);
        }

        console.error("Error message:", error.message);
      }
    },
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box style={{ alignSelf: "flex-start", marginTop: "10px" }}>
          <img
            src={LogoImage}
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: "110px",
            }}
          />
        </Box>
        <Box>
          <IconButton
            onClick={() => navigate("/")}
            sx={{ color: `${primaryColor}` }}
          >
            <ArrowBack sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: `${primaryColor}` }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("Login")}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="usernameOrEmail"
                  label={t("Username or Email")}
                  autoComplete="usernameOrEmail"
                  {...formik.getFieldProps("usernameOrEmail")}
                  error={
                    formik.touched.usernameOrEmail &&
                    Boolean(formik.errors.usernameOrEmail)
                  }
                  helperText={
                    formik.touched.usernameOrEmail &&
                    formik.errors.usernameOrEmail
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t("Password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  {...formik.getFieldProps("password")}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <Link
                        component="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Link>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center", marginTop: 5 }}>
              <CreateAccountButtonComponent
                buttonName={t("Login")}
                onClick={formik.handleSubmit}
                disabled={!formik.isValid}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Grid item xs={9}>
                <Link href="signup" variant="body2">
                  {t("Don't have an account? Sign up")}
                </Link>
              </Grid>
              <Grid item xs={3}>
                <Link href="/forgotpassword" variant="body2">
                  {t("Forgot Password?")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={1500}
          onClose={() => setShowSuccessAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success">
            {t("Logged in successfully. Redirecting to home page...")}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showAlertFail}
          autoHideDuration={6000}
          onClose={() => setShowAlertFail(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error">{showError}</Alert>
        </Snackbar>
      </Container>
      <BackdropComponent open={openLoad} />
    </ThemeProvider>
  );
}

export default withTranslation()(SignIn);
