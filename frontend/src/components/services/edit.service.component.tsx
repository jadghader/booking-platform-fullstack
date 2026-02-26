import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

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
  Snackbar,
  Alert,
} from "@mui/material";
import { SubmitButtonComponent } from "../../styled/button/button.component";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../auth/authSlice";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { primaryColor } from "../../assets/globals/global-constants";
import dayjs from "dayjs";
import React from "react";
import BackdropComponent from "../../styled/backdrop/backdrop.component";
import { withTranslation } from "react-i18next";

interface Props {
  t: any;
}

const EditServiceComponent: React.FC = ({ t }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const authToken = useSelector(selectCurrentToken);
  const formik = useFormik({
    initialValues: {
      category: "",
      title: "",
      description: "",
      price: "",
      bookingTimes: [
        {
          start_time: null,
          end_time: null,
          start_date: null,
          end_date: null,
        },
      ],
    },
    onSubmit: handleEditService,
    validate: validateForm,
  });

  const [showAlertFail, setShowAlertFail] = useState(false);
  const [showError, setShowError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const categories = [
    t("Home Services"),
    t("Personal Services"),
    t("Event Services"),
    t("Health and Wellness"),
    t("Automotive Services"),
    t("Educational Services"),
    t("Technology Services"),
    t("Business Services"),
    t("Delivery and Logistics"),
    t("Repair and Maintenance"),
  ];
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          `/service/services/${serviceId}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        const serviceData = response.data;
        console.log(serviceData);
        // Set form values based on fetched data
        formik.setValues((prevValues: any) => ({
          ...prevValues,
          category: serviceData.category,
          title: serviceData.title,
          description: serviceData.description,
          price: String(serviceData.price),
          bookingTimes: serviceData.bookingTimes || [], // Ensure it's an array
        }));
      } catch (error: any) {
        console.error("Error fetching service data:", error.message);
        // Handle error as needed
      }
    };

    fetchServiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, authToken]);

  async function handleEditService() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const price = parseFloat(formik.values.price);

      const bookingTimes = formik.values.bookingTimes.map((time: any) => {
        return {
          start_date: formatDate(time.start_date),
          end_date: formatDate(time.end_date),
          start_time: time.start_time,
          end_time: time.end_time,
        };
      });

      const response = await axios.put(
        `/service/edit/${serviceId}`,
        {
          category: formik.values.category,
          title: formik.values.title,
          description: formik.values.description,
          price,
          bookingTimes,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      setShowSuccessAlert(true);
      setOpenLoad(true);
      setTimeout(() => {
        navigate("/services");
      }, 1250);
    } catch (error: any) {
      console.error("Error editing service:", error.message);

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
    } finally {
      setSubmitting(false);
    }
  }

  function validateForm(values: any) {
    const errors: { [key: string]: string } = {};
    if (!values.title) {
      errors.title = t("Title is required");
    }

    if (!values.description) {
      errors.description = t("Description is required");
    }

    if (!values.category) {
      errors.category = t("Category is required");
    }

    if (!values.price) {
      errors.price = t("Price is required");
    } else {
      const numericPrice = parseFloat(values.price);
      if (isNaN(numericPrice)) {
        errors.price = t("Price must be a valid number");
      }
    }

    return errors;
  }

  function formatDate(date: string | dayjs.Dayjs): string {
    // Check if the value is already a dayjs object
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);

    // Use dayjs to format date
    return dayjsDate.format("YYYY/MM/DD");
  }

  return (
    <>
      <Header />
      <Container
        maxWidth={false}
        disableGutters
        style={{ backgroundColor: "#fff" }}
      >
        <Box sx={{ backgroundColor: `${primaryColor}`, padding: "20px 0" }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#ffffff" }}
          >
            {t("Edit Service")}
          </Typography>
        </Box>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("Title")}
                  variant="outlined"
                  required
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={
                    formik.touched.title
                      ? (formik.errors.title as React.ReactNode)
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("Description")}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description
                      ? (formik.errors.description as React.ReactNode)
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
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("Price")}
                  variant="outlined"
                  required
                  name="price"
                  value={formik.values.price}
                  onChange={(event) => {
                    formik.handleChange(event);
                    const parsedPrice = parseFloat(event.target.value);
                    formik.setFieldValue(
                      "price",
                      isNaN(parsedPrice) ? "" : parsedPrice
                    );
                  }}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={
                    formik.touched.price
                      ? (formik.errors.price as React.ReactNode)
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <Box marginRight="8px" display="flex" alignItems="center">
                        $
                      </Box>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t("Add Booking Times")}
                </Typography>
                {formik.values.bookingTimes.map(
                  (bookingTime: any, index: number) => (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={t("Start Date")}
                            shouldDisableDate={(date) =>
                              dayjs(date).isBefore(dayjs(), "day")
                            }
                            value={
                              bookingTime.start_date
                                ? dayjs(bookingTime.start_date)
                                : null
                            }
                            onChange={(value) => {
                              formik.setFieldValue(
                                `bookingTimes[${index}].start_date`,
                                value ? dayjs(value).format("YYYY/MM/DD") : null
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label={t("Start Time")}
                            ampm={false}
                            timeSteps={{ minutes: 60 }}
                            value={
                              bookingTime.start_time
                                ? dayjs(bookingTime.start_time, "HH:mm:ss")
                                : null
                            }
                            shouldDisableTime={(time) => {
                              const formattedTime =
                                dayjs(time).format("HH:mm:ss");
                              const hour = dayjs(
                                formattedTime,
                                "HH:mm:ss"
                              ).hour();
                              return hour >= 0 && hour <= 6;
                            }}
                            onChange={(value) => {
                              const formattedTime =
                                dayjs(value).format("HH:mm:ss");
                              formik.setFieldValue(
                                `bookingTimes[${index}].start_time`,
                                formattedTime
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={t("End Date")}
                            shouldDisableDate={(date) =>
                              dayjs(date).isBefore(dayjs(), "day")
                            }
                            value={
                              bookingTime.end_date
                                ? dayjs(bookingTime.end_date)
                                : null
                            }
                            onChange={(value) => {
                              formik.setFieldValue(
                                `bookingTimes[${index}].end_date`,
                                value ? dayjs(value).format("YYYY/MM/DD") : null
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label={t("End Time")}
                            ampm={false}
                            timeSteps={{ minutes: 60 }}
                            shouldDisableTime={(time) => {
                              const formattedTime =
                                dayjs(time).format("HH:mm:ss");
                              const hour = dayjs(
                                formattedTime,
                                "HH:mm:ss"
                              ).hour();
                              return hour >= 0 && hour <= 6;
                            }}
                            value={
                              bookingTime.end_time
                                ? dayjs(bookingTime.end_time, "HH:mm:ss")
                                : null
                            }
                            onChange={(value) => {
                              const formattedTime =
                                dayjs(value).format("HH:mm:ss");
                              formik.setFieldValue(
                                `bookingTimes[${index}].end_time`,
                                formattedTime
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                  )
                )}
              </Grid>
              <Grid item xs={12} textAlign="center">
                <SubmitButtonComponent
                  buttonName={t("Edit Service")}
                  onClick={handleEditService}
                  disabled={formik.isSubmitting || submitting}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <BackdropComponent open={openLoad} />
      <Footer />

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={1500}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{t("Service edited successfully")}</Alert>
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

export default withTranslation()(EditServiceComponent);
