import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import SignUp from "../signup/signup.component";
import LogoImage from "../../assets/images/BMS.svg"; // Import your logo image
import { primaryColor } from "../../assets/globals/global-constants";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { CreateAccountButtonComponent } from "../../styled/button/button.component";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { withTranslation } from "react-i18next";

interface Props {
  t: any;
}
const SignupPage: React.FC = ({ t }: Props) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [registrationFormVisible, setRegistrationFormVisible] =
    useState<boolean>(false);

  // State to manage button state
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = (event.target as HTMLInputElement).value;
    setSelectedType(type);
    setIsButtonDisabled(false);
  };

  const handleBack = () => {
    setRegistrationFormVisible(false);
  };

  const handleJoin = () => {
    setRegistrationFormVisible(true);
  };

  const navigate = useNavigate();

  return (
    <Container>
      {!registrationFormVisible ? (
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
          style={{ height: "50vh" }}
        >
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
          <Grid item xs={12} sm={12}>
            <Box>
              <IconButton
                onClick={() => navigate("/")}
                sx={{ color: `${primaryColor}` }}
              >
                <ArrowBack sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Box>
            <Card
              style={{
                marginTop: "10px",
                height: "auto",
                padding: "25px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    textAlign: "center",
                    color: `${primaryColor}`,
                    marginTop: "1rem",
                  }}
                >
                  {t("Join as a client or provider")}
                </Typography>
                {/* Display the existing cards */}
                <Grid container spacing={4} style={{ marginTop: "0.5rem" }}>
                  <Grid item xs={12} sm={6}>
                    {/* Existing card for searching */}
                    <Card
                      sx={{
                        border:
                          selectedType === "provider"
                            ? `2px solid ${primaryColor}`
                            : "2px solid transparent",
                      }}
                    >
                      <CardContent>
                        <RadioGroup
                          value={selectedType}
                          onChange={handleTypeChange}
                        >
                          <FormControlLabel
                            value="provider"
                            control={<Radio />}
                            label=""
                          />
                        </RadioGroup>
                        <Typography variant="h5" gutterBottom>
                          {t("I’m a provider, looking for work")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {/* Existing card for posting */}
                    <Card
                      sx={{
                        border:
                          selectedType === "consumer"
                            ? `2px solid ${primaryColor}`
                            : "2px solid transparent",
                      }}
                    >
                      <CardContent>
                        <RadioGroup
                          value={selectedType}
                          onChange={handleTypeChange}
                        >
                          <FormControlLabel
                            value="consumer"
                            control={<Radio />}
                            label=""
                          />
                        </RadioGroup>
                        <Typography variant="h5" gutterBottom>
                          {t("I’m a client, looking a service")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                {/* Render button */}
                <Box style={{ textAlign: "center", marginTop: "25px" }}>
                  <CreateAccountButtonComponent
                    onClick={handleJoin}
                    buttonName={
                      selectedType === "provider"
                        ? t("Join as Provider")
                        : t("Join as Consumer")
                    }
                    disabled={isButtonDisabled}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <SignUp handleBack={handleBack} userType={selectedType} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default withTranslation()(SignupPage);
