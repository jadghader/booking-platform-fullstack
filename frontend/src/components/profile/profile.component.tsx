import React, { useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { makeStyles, createStyles } from "@mui/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { primaryColor } from "../../assets/globals/global-constants";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice";
import BackdropComponent from "../../styled/backdrop/backdrop.component";
import { selectCurrentToken } from "../../auth/authSlice";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    button: {
      marginTop: theme.spacing(1), // Adjust top margin for buttons
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2),
    },
    avatar: {
      margin: "auto",
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    input: {
      display: "none",
    },
    profileHeader: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
    },
    sectionHeader: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(1),
    },
    borderedSection: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2),
    },
  })
);

interface Profile {
  user_id: number;
  username: string;
  email: string;
  location: string;
  price: number;
  phone_number: string;
  bio: string;
}

export default function ProfilePage() {
  const classes = useStyles();
  const [profile, setProfile] = useState<Profile | null>(null);
  const authToken = useSelector(selectCurrentToken);

  const user = useSelector(selectUser);
  const isProvider = user && user.role === "provider";
  const [openLoad, setOpenLoad] = useState(false);

  useEffect(() => {
    const fetUserDetails = async () => {
      try {
        const response = await axios.get(
          `/user/profile/${user.user_id}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        setProfile(response.data);
        setOpenLoad(false);
      } catch (error: any) {
        console.error("Error fetching service details:", error.message);
        setOpenLoad(true);
      }
    };

    fetUserDetails();
  }, [authToken, user.user_id]);

  const linkStyle = {
    textDecoration: "none",
    "&:hover, &:active, &:focus": {
      textDecoration: "underline",
      color: "blue", // Hover color
    },
  } as any;

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: `${primaryColor}`, padding: "20px 0" }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          sx={{ fontWeight: "bold", color: "#ffffff" }}
        >
          Edit Profile
        </Typography>
      </Box>
      <Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Grid container spacing={3}>
          {/* Left side - User Info */}
          <Grid item xs={12} sm={4}>
            <Paper className={classes.paper}>
              <Avatar
                alt={profile?.username || "User"}
                className={classes.avatar}
              >
                {profile?.username?.charAt(0).toUpperCase() || ""}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile?.username || "Username"}
              </Typography>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCamera />}
                  className={classes.button}
                >
                  Upload
                </Button>
              </label>
              {/* Navigation Links */}
              <List>
                <Link
                  to={
                    isProvider
                      ? "/profile/posted-services"
                      : "/profile/booked-services"
                  }
                >
                  <ListItem>
                    <ListItemText
                      primary={
                        isProvider ? "Your Posted Services" : "Booked Services"
                      }
                      style={linkStyle}
                    />
                  </ListItem>
                </Link>
              </List>
            </Paper>
          </Grid>

          {/* Right side - Edit Form */}
          <Grid item xs={12} sm={8} sx={{ marginBottom: 5 }}>
            <Paper className={classes.paper}>
              <Box className={classes.profileHeader}>
                <Typography variant="h6" gutterBottom>
                  Edit profile
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Here you can edit your profile details and upload a profile
                  photo.
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {/* Left Column for Personal Info and Save Button */}
                <Grid item xs={12} md={6}>
                  <Paper className={classes.borderedSection}>
                    <Box className={classes.form}>
                      <TextField
                        label="UserName"
                        variant="outlined"
                        fullWidth
                        value={profile?.username || ""}
                      />

                      <TextField
                        label="Location"
                        variant="outlined"
                        fullWidth
                        value={profile?.location || ""}
                      />
                      <TextField
                        label="Phone"
                        variant="outlined"
                        fullWidth
                        value={profile?.phone_number || ""}
                      />
                      <TextField
                        label="Bio"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={profile?.bio || ""}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Save My Changes
                      </Button>
                    </Box>
                  </Paper>
                </Grid>

                {/* Right Column for Password and Email */}
                <Grid item xs={12} md={6}>
                  {/* Password Change */}
                  <Paper className={classes.borderedSection}>
                    <Box className={classes.form}>
                      <TextField
                        label="Current Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </Paper>

                  {/* Email Change */}
                  <Paper className={classes.borderedSection}>
                    <Box className={classes.form}>
                      <TextField
                        label="Current Email"
                        variant="outlined"
                        fullWidth
                        value={profile?.email || ""}
                      />
                      <TextField
                        label="New Email"
                        variant="outlined"
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Change Email
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <BackdropComponent open={openLoad} />
      <Footer />
    </>
  );
}
