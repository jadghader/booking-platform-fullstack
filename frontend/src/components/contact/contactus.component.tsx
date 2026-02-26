import React from "react";
import { useFormik } from "formik";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Footer from "../../components/Footer";
import { primaryColor } from "../../assets/globals/global-constants";
import { SubmitButtonComponent } from "../../styled/button/button.component";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { Slide, Zoom } from "react-awesome-reveal";
import Header from "../../components/Header";
import { withTranslation } from "react-i18next";

interface Props {
  t: any;
}
const ContactUs = ({ t }: Props) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      category: "",
      message: "",
    },
    onSubmit: handleSubmit,
    validate: validateForm,
  });

  const [showAlertFail, setShowAlertFail] = React.useState(false);
  const [showError, setShowError] = React.useState("");
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

  async function handleSubmit() {
    try {
      const response = await axios.post(
        "/user/submit-form",
        formik.values
      );

      console.log(response.data);
      setShowSuccessAlert(true);
      formik.resetForm();
    } catch (error: any) {
      console.error("API error:", error.message);

      if (error.response) {
        console.error("API error:", error.response.data);
        const errorMessage = error.response.data.message;
        setShowError(errorMessage);
        setShowAlertFail(true);
      } else if (error.request) {
        console.error("API error:", "No response received");
      } else {
        console.error("API error:", error.message);
      }

      console.error("Error message:", error.message);
    }
  }

  function validateForm(values: any) {
    const errors: { [key: string]: string } = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.category) {
      errors.category = "Category is required";
    }

    if (!values.message) {
      errors.message = "Message is required";
    }

    return errors;
  }

  return (
    <>
      <Zoom>
        <Header />
        <Box sx={{ backgroundColor: `${primaryColor}`, padding: "20px 0" }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#ffffff" }}
          >
            {t("Contact Us")}
          </Typography>
        </Box>
      </Zoom>
      <Slide>
        <Container
          maxWidth={false}
          disableGutters
          style={{ backgroundColor: "#fff" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
            }}
          >
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={formik.handleSubmit}
              sx={{
                width: "100%",
                maxWidth: "600px",
                margin: "auto",
                padding: "16px",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                textAlign="center"
              >
                {t("Hello, what's on your mind?")}
              </Typography>
              <Typography
                variant="subtitle1"
                marginBottom={3}
                textAlign="center"
              >
                {t(
                  "Got questions or feedback? We’re here to listen and help..."
                )}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("Name")}
                    variant="outlined"
                    required
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={
                      formik.touched.name
                        ? (formik.errors.name as React.ReactNode)
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("Email")}
                    variant="outlined"
                    required
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={
                      formik.touched.email
                        ? (formik.errors.email as React.ReactNode)
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t("Select Category")}</InputLabel>
                    <Select
                      defaultValue=""
                      label={t("Select Category")}
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                    >
                      <MenuItem value={"Features & Improvements"}>
                        {t("Features & Improvements")}
                      </MenuItem>
                      <MenuItem value={"Bugs Report"}>
                        {t("Bugs Report")}
                      </MenuItem>
                      <MenuItem value={"Give Feedback"}>
                        {t("Give Feedback")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("Message")}
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.message && Boolean(formik.errors.message)
                    }
                    helperText={
                      formik.touched.message
                        ? (formik.errors.message as React.ReactNode)
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <SubmitButtonComponent
                    buttonName={t("Submit")}
                    onClick={handleSubmit}
                    disabled={formik.isSubmitting}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Slide>
      <Footer />
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={1500}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{t("Form filled successfully")}</Alert>
      </Snackbar>
      <Snackbar
        open={showAlertFail}
        autoHideDuration={6000}
        onClose={() => setShowAlertFail(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">{showError}</Alert>
      </Snackbar>
    </>
  );
};

export default withTranslation()(ContactUs);
