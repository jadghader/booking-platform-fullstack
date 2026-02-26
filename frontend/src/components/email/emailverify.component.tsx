// EmailVerificationComponent.jsx

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { primaryColor } from "../../assets/globals/global-constants";
import { CreateAccountButtonComponent } from "../../styled/button/button.component";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux"; // Import useSelector
import { clearUser, selectCurrentEmail } from "../../auth/authSlice"; // Adjust the import path
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";

interface Props {
  t: any;
}
const defaultTheme = createTheme();

const EmailVerification: React.FC = ({ t }: Props) => {
  const [showAlertFail, setShowAlertFail] = useState<boolean>(false);
  const [showError, setShowError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector(selectCurrentEmail); // Get the email from the Redux store

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    verificationCode: yup.string().required("Verification code is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: userEmail,
      verificationCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "/auth/email-verify",
          values
        );

        // Handle the response as needed

        // Show success Snackbar and navigate to the desired page
        setShowSuccessAlert(true);
        setTimeout(() => {
          // Redirect after 1.5 seconds (adjust as needed)
          navigate("/");
        }, 1500);
      } catch (error: any) {
        console.error("API error:", error.message);

        if (error.response) {
          console.error("API error:", error.response.data);

          if (error.response.status === 400) {
            const errorMessage = error.response.data.message;
            setShowError(errorMessage);
            setShowAlertFail(true);

            formik.setErrors({
              email: errorMessage.includes("email") ? errorMessage : "",
              verificationCode: errorMessage.includes("verificationCode")
                ? errorMessage
                : "",
            });
          } else {
            // Handle other error cases
          }
        } else if (error.request) {
          console.error("API error:", "No response received");
        } else {
          console.error("API error:", error.message);
        }
      }
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box style={{ alignSelf: "flex-start", marginTop: 25 }}>
          <IconButton
            onClick={() => {
              dispatch(clearUser()); // Update login status after the timeout
              navigate("/");
            }}
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
            Email Verification
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
                  label="Verification Code"
                  id="verificationCode"
                  autoComplete="off"
                  {...formik.getFieldProps("verificationCode")}
                  error={
                    formik.touched.verificationCode &&
                    Boolean(formik.errors.verificationCode)
                  }
                  helperText={
                    formik.touched.verificationCode &&
                    formik.errors.verificationCode
                  }
                />
              </Grid>
            </Grid>
            {/* Submit button */}
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <CreateAccountButtonComponent
                buttonName="Submit"
                onClick={formik.handleSubmit}
                disabled={!formik.isValid}
              />
            </Grid>
          </Box>
        </Box>
        {/* Success Snackbar */}
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={3000}
          onClose={() => setShowSuccessAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          >
            Email verified successfully. Redirecting...
          </Alert>
        </Snackbar>
        {/* Error Snackbar */}
        <Snackbar
          open={showAlertFail}
          autoHideDuration={6000}
          onClose={() => setShowAlertFail(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error">{showError}</Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default withTranslation()(EmailVerification);
