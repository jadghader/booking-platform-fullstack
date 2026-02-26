import React, { useEffect, useState } from "react";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { CreateAccountButtonComponent } from "../../styled/button/button.component";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../auth/authSlice";
import { t } from "i18next";
import { useNavigate } from "react-router";
import BackdropComponent from "../../styled/backdrop/backdrop.component";
dayjs.extend(customParseFormat);

interface BookingProps {
  serviceId: number;
}

interface BookingTime {
  bookingTime_id: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

const DatePickerComponent: React.FC<{
  availableDates: BookingTime[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}> = ({ availableDates, selectedDate, onSelectDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date"
        value={selectedDate}
        sx={{ margin: 1 }}
        onChange={(date) => onSelectDate(date)}
        shouldDisableDate={(date) =>
          !availableDates.some(
            (bookingTime) =>
              ((dayjs(date).isSame(dayjs(bookingTime.start_date)) ||
                dayjs(date).isAfter(dayjs(bookingTime.start_date))) &&
                dayjs(date).isBefore(dayjs(bookingTime.end_date))) ||
              dayjs(date).isSame(dayjs(bookingTime.end_date)) ||
              null
          )
        }
      />
    </LocalizationProvider>
  );
};

const TimePickerComponent: React.FC<{
  availableTimes: BookingTime[];
  selectedTime: Date | null;
  onSelectTime: (time: Date | null) => void;
}> = ({ availableTimes, selectedTime, onSelectTime }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="Select Time"
        value={selectedTime}
        ampm={false}
        timeSteps={{ minutes: 60 }}
        sx={{ margin: 1 }}
        onChange={(time) => onSelectTime(time)}
        shouldDisableTime={(time) =>
          !availableTimes.some((bookingTime) => {
            // Set the time zone to UTC for consistency
            const bookingStartTime = dayjs(bookingTime.start_time, {
              format: "HH:mm:ss",
              utc: true,
            });
            const bookingEndTime = dayjs(bookingTime.end_time, {
              format: "HH:mm:ss",
              utc: true,
            });
            return (
              (dayjs(time).isSame(bookingStartTime) ||
                dayjs(time).isAfter(bookingStartTime)) &&
              (dayjs(time).isSame(bookingEndTime) ||
                dayjs(time).isBefore(bookingEndTime))
            );
          })
        }
      />
    </LocalizationProvider>
  );
};

const Booking: React.FC<BookingProps> = ({ serviceId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [availableBookingTimes, setAvailableBookingTimes] = useState<
    BookingTime[]
  >([]);
  const [availableBookingDates, setAvailableBookingDates] = useState<
    BookingTime[]
  >([]);
  const authToken = useSelector(selectCurrentToken);
  const [showAlertFail, setShowAlertFail] = useState(false);
  const [showError, setShowError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [openLoad, setopenLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableBookingTimes = async () => {
      try {
        // Fetch available booking times
        const bookingTimesResponse = await axios.get(
          `/service/services/${serviceId}/bookingTimes`
        );

        // Fetch existing bookings
        const bookingsResponse = await axios.get(
          "/booking/get"
        );

        // Convert dates and times from string to Date and format them for rendering
        const formattedBookingDates = bookingTimesResponse.data.map(
          (bookingTime: BookingTime) => ({
            ...bookingTime,
            start_date: dayjs(bookingTime.start_date, "YYYY/MM/DD").toDate(),
            end_date: dayjs(bookingTime.end_date, "YYYY/MM/DD").toDate(),
          })
        );

        const formattedBookingTimes = bookingTimesResponse.data.map(
          (bookingTime: BookingTime) => ({
            ...bookingTime,
            start_time: dayjs(bookingTime.start_time, "HH:mm:ss").toDate(),
            end_time: dayjs(bookingTime.end_time, "HH:mm:ss").toDate(),
          })
        );

        // Extract booked dates and times
        const bookedDatesTimes = bookingsResponse.data.map((booking: any) => ({
          bookedDate: dayjs(booking.bookedDate, "YYYY/MM/DD").toDate(),
          bookedTime: dayjs(booking.bookedTime, "HH:mm:ss").toDate(),
        }));

        const bookedTimesForSelectedDate = bookedDatesTimes
          .filter((booked: { bookedDate: string; bookedTime: string }) =>
            dayjs(selectedDate).isSame(
              dayjs(booked.bookedDate, "YYYY/MM/DD"),
              "day"
            )
          )
          .map((booked: { bookedTime: string }) =>
            dayjs(booked.bookedTime, "HH:mm:ss")
          );

        // Filter out booked times for the selected date
        const availableTimesForSelectedDate = formattedBookingTimes.filter(
          (bookingTime: BookingTime) => {
            const isBookedForSelectedDate = bookedTimesForSelectedDate.some(
              (bookedTime: dayjs.Dayjs) => {
                const bookingStartTime = dayjs(bookingTime.start_time);
                const bookingEndTime = dayjs(bookingTime.end_time);

                return (
                  bookedTime.isAfter(bookingStartTime) &&
                  bookedTime.isBefore(bookingEndTime)
                );
              }
            );

            return !isBookedForSelectedDate;
          }
        );

        // Now, availableTimesForSelectedDate contains only the booking times that are not booked for the selected date.

        setAvailableBookingDates(formattedBookingDates);
        setAvailableBookingTimes(availableTimesForSelectedDate);
      } catch (error: any) {
        console.error("Error fetching available booking times:", error.message);
      }
    };

    fetchAvailableBookingTimes();
  }, [serviceId, selectedDate]);

  const handleBookNow = async () => {
    try {
      // Make sure there is at least one available booking time
      if (availableBookingTimes.length === 0) {
        console.error("No available booking times");
        // Handle the case where there are no available booking times
        return;
      }

      // Use the first available booking time (you may adjust this based on your logic)
      const selectedBookingTime = availableBookingTimes[0];

      const response = await axios.post(
        "/booking/create",
        {
          bookingTime_id: selectedBookingTime.bookingTime_id,
          bookedDate: dayjs(selectedDate!).format("YYYY/MM/DD"),
          bookedTime: dayjs(selectedTime!).format("HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      console.log("Booking response:", response.data);
      setShowSuccessAlert(true);
      setopenLoad(true);
      setTimeout(() => {
        navigate("/services");
      }, 1000);
    } catch (error: any) {
      console.error("Error creating booking:", error.message);
      const errorMessage = error.response.data.message;
      setShowError(errorMessage);
      setShowAlertFail(true);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h5"
        textAlign="center"
        fontWeight="bold"
        mb={3}
        sx={{ fontSize: "1.25rem" }}
      >
        Select Date and Time for Booking
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <DatePickerComponent
          availableDates={availableBookingDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <TimePickerComponent
          availableTimes={availableBookingTimes}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
        <CreateAccountButtonComponent
          onClick={handleBookNow}
          disabled={!selectedDate || !selectedTime}
          buttonName={"Book Now"}
        />
      </Box>
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={1500}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">
          {t("Booked successfully. Redirecting to services page...")}
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
      <BackdropComponent open={openLoad} />
    </Box>
  );
};

export default Booking;
