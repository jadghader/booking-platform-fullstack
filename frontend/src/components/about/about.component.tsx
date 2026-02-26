// AboutUs.component.tsx
import React, { useState } from "react";
import { Box, CardContent, Container, Grid, Typography } from "@mui/material";
import {
  AboutSection,
  TeamHeading,
  TeamCard,
  StatsSection,
  CounterContent,
} from "./about.styled";
import Footer from "../../components/Footer";
import { primaryColor } from "../../assets/globals/global-constants";
import { Slide, Zoom, Bounce } from "react-awesome-reveal";
import Header from "../../components/Header";
import ourMission from "../../assets/svg/undraw_task_re_wi3v.svg";
import whoWeAre from "../../assets/svg/undraw_team_spirit_re_yl1v.svg";
import ourInspiration from "../../assets/svg/undraw_design_inspiration_re_tftx.svg";
import { withTranslation } from "react-i18next";
import CountUp from "react-countup";

interface Props {
  t: any;
}

const AboutUs = ({ t }: Props) => {
  const staticStats = [
    { label: "Users", value: 120 },
    { label: "Services", value: 132 },
    { label: "Bookings", value: 123 },
  ];

  const [stats] = useState(staticStats);

  const teamMembers = [
    { name: "Akram Hakim", role: "Computer Engineering Student BAU" },
    { name: "Bilal Karakira", role: "Computer Engineering Student BAU" },
    { name: "Hamza Kotob", role: "Computer Engineering Student BAU" },
    { name: "Jad Ghader ", role: "Computer Engineering Student BAU" },
  ];

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
            {t("About Us")}
          </Typography>
        </Box>

        <AboutSection>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Slide direction="left">
                  <Typography variant="h3" gutterBottom color="#18216d">
                    {t("Who We Are")}
                  </Typography>
                  <Typography variant="body1" paragraph color="#18216d">
                    {t(
                      "At BMS Company, we are a dedicated team committed to bridging the gap between those who seek services and those who provide them. Our platform is built on the foundation of trust, efficiency, and quality. With a diverse team of innovative thinkers and passionate problem-solvers, we've created a marketplace that not only connects individuals but also fosters a community of support and growth."
                    )}
                  </Typography>
                </Slide>
              </Grid>
              <Grid item xs={12} md={6}>
                <Zoom>
                  <Box
                    component="img"
                    src={whoWeAre}
                    sx={{ width: "60%", height: "auto", marginBottom: 10 }}
                    alt="Who We Are"
                  />
                </Zoom>
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                <Zoom>
                  <Box
                    component="img"
                    src={ourInspiration}
                    sx={{ width: "60%", height: "auto", marginBottom: 10 }}
                    alt="Our Inspiration"
                  />
                </Zoom>
              </Grid>
              <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                <Slide direction="right">
                  <Typography variant="h3" gutterBottom color="#18216d">
                    {t("Our Inspiration")}
                  </Typography>
                  <Typography variant="body1" paragraph color="#18216d">
                    {t(
                      "Inspired by the complexity of everyday needs and the hustle of service providers, we envisioned a streamlined, accessible, and reliable platform where every service request is met with a professional solution. We are motivated by the stories of individuals who strive to make their day-to-day lives more productive and the service providers who are the backbone of local economies."
                    )}
                  </Typography>
                </Slide>
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Slide direction="left">
                  <Typography variant="h3" gutterBottom color="#18216d">
                    {t("Our Mission")}
                  </Typography>
                  <Typography variant="body1" paragraph color="#18216d">
                    {t(
                      "Our mission is to create a seamless and secure environment for users to enlist and offer services. We aim to empower our users by providing them with the tools they need to succeed, whether it's finding the right service at the right time or expanding their customer base. Through innovation and a steadfast commitment to user satisfaction, we strive to be the go-to platform for all service-related needs."
                    )}
                  </Typography>
                </Slide>
              </Grid>
              <Grid item xs={12} md={6}>
                <Zoom>
                  <Box
                    component="img"
                    src={ourMission}
                    sx={{ width: "60%", height: "auto", marginBottom: 10 }}
                    alt="Our Mission"
                  />
                </Zoom>
              </Grid>
            </Grid>
          </Container>
        </AboutSection>

        <Container>
          <Slide>
            <TeamHeading variant="h3" color="#18216d">
              {t("Our Team")}
            </TeamHeading>
          </Slide>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                {/* Use different animations for each team member */}
                {index % 3 === 0 ? (
                  <Slide>
                    <TeamCard>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </CardContent>
                    </TeamCard>
                  </Slide>
                ) : index % 3 === 1 ? (
                  <Zoom>
                    <TeamCard>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </CardContent>
                    </TeamCard>
                  </Zoom>
                ) : (
                  <Bounce>
                    <TeamCard>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </CardContent>
                    </TeamCard>
                  </Bounce>
                )}
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* ... Rest of your code for the stats section ... */}

        {/* Updated StatsSection */}
        <StatsSection elevation={0}>
          <Container>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Zoom>
                    <CounterContent>
                      <Typography
                        variant="h2"
                        component="span"
                        className="counter"
                      >
                        <CountUp start={0} end={stat.value} duration={40} />
                      </Typography>
                      <Typography variant="h5">{stat.label}</Typography>
                    </CounterContent>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Container>
        </StatsSection>
      </Zoom>
      <Footer />
    </>
  );
};

export default withTranslation()(AboutUs);
