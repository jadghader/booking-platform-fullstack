// // ChangePasswordComponent.jsx
// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import axios from "axios";
// import IconButton from "@mui/material/IconButton";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import Avatar from "@mui/material/Avatar";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { primaryColor } from "../../assets/globals/global-constants";
// import { CreateAccountButtonComponent } from "../../styled/button/button.component";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { useDispatch } from "react-redux";
// import { clearUser } from "../../auth/authSlice";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";

// const defaultTheme = createTheme();

// const ChangePasswordComponent: React.FC = () => {
//   const [showAlertFail, setShowAlertFail] = useState<boolean>(false);
//   const [showError, setShowError] = useState("");
//   const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const validationSchema = yup.object({
//     password: yup.string().required("Password is required"),
//     confirmPassword: yup
//       .string()
//       .oneOf([yup.ref("password"), null], "Passwords must match")
//       .required("Confirm Password is required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       try {
//         // Assuming you have an API endpoint for changing the password
//         const response = await axios.post(
//           "/auth/change-password",
//           values
//         );

//         // Handle the response as needed
//         console.log(response.data);

//         // Show success Snackbar and navigate to the desired page
//         setShowSuccessAlert(true);
//         setTimeout(() => {
//           // Redirect after 1.5 seconds (adjust as needed)
//           navigate("/");
//         }, 1500);
//       } catch (error: any) {
//         console.error("API error:", error.message);

//         if (error.response) {
//           console.error("API error:", error.response.data);

//           if (error.response.status === 400) {
//             const errorMessage = error.response.data.message;
//             setShowError(errorMessage);
//             setShowAlertFail(true);

//             formik.setErrors({
//               password: errorMessage.includes("password") ? errorMessage : "",
//               confirmPassword: errorMessage.includes("confirmPassword")
//                 ? errorMessage
//                 : "",
//             });
//           } else {
//             // Handle other error cases
//           }
//         } else if (error.request) {
//           console.error("API error:", "No response received");
//         } else {
//           console.error("API error:", error.message);
//         }
//       }
//     },
//   });

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="sm">
//         <CssBaseline />
//         <Box style={{ alignSelf: "flex-start", marginTop: "10px" }}>
//           <IconButton
//             onClick={() => {
//               dispatch(clearUser());
//               navigate("/");
//             }}
//             sx={{ color: `${primaryColor}` }}
//           >
//             <ArrowBack sx={{ fontSize: "2rem" }} />
//           </IconButton>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: `${primaryColor}` }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Change Password
//           </Typography>
//           <Box
//             component="form"
//             noValidate
//             onSubmit={formik.handleSubmit}
//             sx={{ mt: 1 }}
//           >
//             <Grid container spacing={1}>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   type="password"
//                   label="New Password"
//                   id="password"
//                   autoComplete="new-password"
//                   {...formik.getFieldProps("password")}
//                   error={formik.touched.password && Boolean(formik.errors.password)}
//                   helperText={formik.touched.password && formik.errors.password}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   type="password"
//                   label="Confirm Password"
//                   id="confirmPassword"
//                   autoComplete="new-password"
//                   {...formik.getFieldProps("confirmPassword")}
//                   error={
//                     formik.touched.confirmPassword &&
//                     Boolean(formik.errors.confirmPassword)
//                   }
//                   helperText={
//                     formik.touched.confirmPassword &&
//                     formik.errors.confirmPassword
//                   }
//                 />
//               </Grid>
//             </Grid>
//             {/* Submit button */}
//             <Grid item xs={12} style={{ textAlign: "center" }}>
//               <CreateAccountButtonComponent
//                 buttonName="Submit"
//                 onClick={formik.handleSubmit}
//                 disabled={!formik.isValid}
//               />
//             </Grid>
//           </Box>
//         </Box>
//         {/* Success Snackbar */}
//         <Snackbar
//           open={showSuccessAlert}
//           autoHideDuration={3000}
//           onClose={() => setShowSuccessAlert(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert
//             severity="success"
//             icon={<CheckCircleOutlineIcon fontSize="inherit" />}
//           >
//             Password changed successfully. Redirecting...
//           </Alert>
//         </Snackbar>
//         {/* Error Snackbar */}
//         <Snackbar
//           open={showAlertFail}
//           autoHideDuration={6000}
//           onClose={() => setShowAlertFail(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert severity="error">{showError}</Alert>
//         </Snackbar>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default ChangePasswordComponent;

export {};
