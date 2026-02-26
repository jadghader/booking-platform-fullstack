import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import "react-phone-number-input/style.css";
import { Alert, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../assets/images/BMS.svg";
import { setEmail, setCredentials, setUser } from "../../auth/authSlice";
import { useDispatch } from "react-redux";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { withTranslation } from "react-i18next";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Book My Service BMS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

interface SignUpProps {
  userType: string;
  handleBack: any;
  t: any;
}

const SignUp: React.FC<SignUpProps> = ({ userType, handleBack, t }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAlertFail, setShowAlertFail] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showError, setShowError] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationSchema = yup.object({
    username: yup
      .string()
      .required("User Name is required")
      .matches(/^\S*$/, "No spaces are allowed"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    phone_number: yup.string().required("Phone number is required"),
    location: yup.string().notRequired(),
  });

  useEffect(() => {
    const getCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude},${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser");
      }
    };

    // Fetch the user's current location when the component mounts
    getCurrentLocation();
  }, []);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phone_number: "",
      location: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const role = userType === "provider" ? "provider" : "consumer";

      const requestData = {
        ...values,
        role: role,
        location: location, // Use the fetched location or the manually entered one
      };

      try {
        const response = await axios.post(
          "/user/register",
          requestData
        );

        // Verify the user token
        const verifyResponse = await axios.get(
          "/auth/user-verify",
          {
            withCredentials: true,
          }
        );
        console.log(verifyResponse);

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

        dispatch(setEmail({ email: values.email }));
        dispatch(setCredentials({ token: verifyResponse.data.accessToken }));
        dispatch(setUser({ user: response.data.user }));
        // Store the access token in session storage

        // Show success Snackbar and navigate to email verification
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate("/email-verification");
        }, 1500); // Redirect after 3 seconds (adjust as needed)
      } catch (error: any) {
        // Handle errors from the API call
        if (error.response) {
          console.error("API error:", error.response.data);

          if (error.response.status === 400) {
            const errorMessage = error.response.data.message;
            setShowError(errorMessage);
            setShowAlertFail(true);

            formik.setErrors({
              username: errorMessage.includes("username") ? errorMessage : "",
              email: errorMessage.includes("email") ? errorMessage : "",
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
        <Box>
          <img
            src={LogoImage} // Replace with the actual path to your logo image
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: "110px",
            }}
          />
        </Box>
        <Box>
          <IconButton onClick={handleBack} sx={{ color: `${primaryColor}` }}>
            <ArrowBack sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "auto",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: `${primaryColor}` }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {userType === "provider"
              ? t("Provider Sign up")
              : t("Consumer Sign up")}
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
                  id="username"
                  label={t("Username")}
                  autoComplete="user-name"
                  {...formik.getFieldProps("username")}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("Email Address")}
                  autoComplete="email"
                  {...formik.getFieldProps("email")}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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
                          e.preventDefault(); // Prevent the default behavior
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Link>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <PhoneInput
                  country={"lb"} // Set the default country
                  countryCodeEditable={false}
                  value={formik.values.phone_number}
                  onChange={(value) =>
                    formik.setFieldValue("phone_number", value)
                  }
                  inputStyle={{
                    width: "100%",
                    height: "3.4375em",
                    border: "1px solid #ccc",
                  }}
                />
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <Typography variant="body2" color="error">
                    {formik.errors.phone_number}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t("Location")}
                  type="location"
                  id="location"
                  autoComplete="location"
                  {...formik.getFieldProps("location")}
                  value={location}
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
            </Grid>
            {/* Create account button */}
            <Grid
              item
              xs={12}
              style={{ textAlign: "center", marginTop: "25px" }}
            >
              <CreateAccountButtonComponent
                buttonName={t("Create Account")}
                onClick={formik.handleSubmit}
                disabled={!formik.isValid}
              />
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="login" variant="body2">
                  {t("Already have an account? Sign in")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={3000} // 3 seconds (adjust as needed)
          onClose={() => setShowSuccessAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          >
            {t(
              "User registered successfully. Redirecting to email verification..."
            )}
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
    </ThemeProvider>
  );
};

export default withTranslation()(SignUp);
