import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { primaryColor } from "../../assets/globals/global-constants";
import { withTranslation } from "react-i18next";

interface Props {
  t: any;
}

const ApplicationSecurityPage: React.FC = ({ t }: any) => {
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
          {t("Application Security")}
        </Typography>
      </Box>
      <Container>
        <Box my={4}>
          <Typography variant="h2" gutterBottom sx={{ color: "#2e186a" }}>
            Ensuring Your Security
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#2e186a" }}>
            Learn about how we protect your data and what you can do to ensure a
            safe and secure experience.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h5" sx={{ color: "#2e186a" }}>
                User Authentication
              </Typography>
              <Typography sx={{ color: "#2e186a" }}>
                Our platform uses advanced authentication methods to ensure the
                security of your account.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h5" sx={{ color: "#2e186a" }}>
                Data Encryption
              </Typography>
              <Typography sx={{ color: "#2e186a" }}>
                All user data is encrypted to maintain privacy and protect
                against unauthorized access.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h5" sx={{ color: "#2e186a" }}>
                Regular Security Updates
              </Typography>
              <Typography sx={{ color: "#2e186a" }}>
                We continuously update our security measures to safeguard
                against the latest threats.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box my={4}>
          <Typography variant="h4" gutterBottom sx={{ color: "#2e186a" }}>
            Best Practices for Users
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Strong Passwords"
                secondary="Use strong, unique passwords for your account to enhance security."
                sx={{ color: "#2e186a" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Secure Connections"
                secondary="Always check for a secure connection and be cautious when using public Wi-Fi."
                sx={{ color: "#2e186a" }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Privacy Tips"
                secondary="Be mindful of the information you share and maintain privacy settings."
                sx={{ color: "#2e186a" }}
              />
            </ListItem>
          </List>
        </Box>

        <Box my={4}>
          <Typography variant="h4" gutterBottom sx={{ color: "#2e186a" }}>
            Have Questions?
          </Typography>
          <Typography sx={{ color: "#2e186a" }}>
            If you have any concerns or questions about security, please contact
            our support team.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default withTranslation()(ApplicationSecurityPage);
