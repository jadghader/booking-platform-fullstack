import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Footer from "../../components/Footer";
import logoHomeServices from "../../assets/images/logo-home-services.png";
import logoPersonalServices from "../../assets/images/logo-personal-service.png";
import logoEducationalServices from "../../assets/images/logo-educational-service.png";
import { primaryColor } from "../../assets/globals/global-constants";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { ViewMoreButtonComponent } from "../../styled/button/button.component";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { withTranslation } from "react-i18next";
import { Zoom, Slide } from "react-awesome-reveal";
import mobileApplication from "../../assets/svg/undraw_mobile_development_re_wwsn.svg";
import needAssistance from "../../assets/svg/undraw_contact_us_re_4qqt.svg";

interface Props {
  t: any;
}

const WhyBMSPage = ({ t }: Props) => {
  return (
    <>
      <Slide>
        <Header />
      </Slide>
      <Zoom>
        <Box sx={{ backgroundColor: `${primaryColor}`, padding: "20px 0" }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#ffffff" }}
          >
            {t("Why Choose BMS")}
          </Typography>
        </Box>

        {/* Main Content Section */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Slide direction="left">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ mt: 2 }}
              color="#18216d"
            >
              {t("Unlock the Full Potential of Convenience with BMS")}
            </Typography>
          </Slide>

          {/* Services Section */}
          <Grid container spacing={4} sx={{ my: 4, alignItems: "center" }}>
            <Grid item xs={12} md={4}>
              <Slide direction="up">
                <Card>
                  <CardMedia
                    component="img"
                    sx={{
                      width: "auto",
                      height: 50,
                      maxWidth: "100%",
                      maxHeight: 50,
                      margin: "auto",
                      marginTop: 5,
                    }}
                    image={logoHomeServices}
                    alt="Home Services"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="#18216d"
                    >
                      {t("Home Services")}
                    </Typography>
                    <Typography variant="body2" color="#18216d">
                      {t("Keep your living space in perfect shape...")}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item xs={12} md={4}>
              <Slide direction="up">
                <Card>
                  <CardMedia
                    component="img"
                    sx={{
                      width: "auto",
                      height: 50,
                      maxWidth: "100%",
                      maxHeight: 50,
                      margin: "auto",
                      marginTop: 5,
                    }}
                    image={logoPersonalServices}
                    alt="Personal Services"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="#18216d"
                    >
                      {t("Personal Services")}
                    </Typography>
                    <Typography variant="body2" color="#18216d">
                      {t("Enhance your well-being with our personal care...")}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item xs={12} md={4}>
              <Slide direction="up">
                <Card>
                  <CardMedia
                    component="img"
                    sx={{
                      width: "auto",
                      height: 50,
                      maxWidth: "100%",
                      maxHeight: 50,
                      margin: "auto",
                      marginTop: 5,
                    }}
                    image={logoEducationalServices}
                    alt="Educational Services"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="#18216d"
                    >
                      {t("Educational Services")}
                    </Typography>
                    <Typography variant="body2" color="#18216d">
                      {t("Plan and execute memorable events...")}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item md={4} sx={{ display: "flex" }}>
              <Slide direction="up">
                <ViewMoreButtonComponent
                  buttonName={t("View More")}
                  endIcon={<MoreHorizIcon />}
                />
              </Slide>
            </Grid>
          </Grid>

          <Slide direction="right">
            <Box my={4} sx={{ marginTop: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Slide direction="up">
                    <CardMedia
                      component="img"
                      sx={{
                        width: "auto",
                        height: 200,
                        maxWidth: "100%",
                        margin: "auto",
                      }}
                      image={mobileApplication}
                      alt="BMS Application"
                    />
                  </Slide>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Slide direction="up">
                    <Typography variant="h5" gutterBottom color="#18216d">
                      {t("BMS Mobile Application - Coming Soon")}
                    </Typography>
                    <Typography paragraph color="#18216d">
                      {t(
                        "Stay tuned for our BMS mobile application. We're working hard to bring the convenience of BMS to your smartphone. More updates will be available shortly!"
                      )}
                    </Typography>
                  </Slide>
                </Grid>
              </Grid>
            </Box>
          </Slide>

          <Slide direction="left">
            <Box my={4} sx={{ marginTop: 3 }}>
              <Typography variant="h5" gutterBottom color="#18216d">
                {t("Need Assistance?")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Slide direction="up">
                    <Typography paragraph color="#18216d">
                      {t(
                        "Our dedicated customer support team is here to help..."
                      )}
                    </Typography>
                    <Link to="/contact-us">
                      <Button variant="outlined" color="primary">
                        {t("Contact Us")}
                      </Button>
                    </Link>
                  </Slide>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Slide direction="up">
                    <CardMedia
                      component="img"
                      sx={{
                        width: "auto",
                        height: 200,
                        maxWidth: "100%",
                        margin: "auto",
                      }}
                      image={needAssistance}
                      alt="Need Assistance"
                    />
                  </Slide>
                </Grid>
              </Grid>
            </Box>
          </Slide>
        </Container>
      </Zoom>
      <Footer />
    </>
  );
};

export default withTranslation()(WhyBMSPage);
