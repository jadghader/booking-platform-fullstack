import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { primaryColor } from "../../assets/globals/global-constants";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ViewMoreButtonComponent } from "../../styled/button/button.component";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import AdList from "../../styled/list/AdList.component";
import { Slide, Zoom } from "react-awesome-reveal";
import { withTranslation } from "react-i18next";

interface Service {
  service_id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  user_id: number;
}

interface Props {
  t: any;
}

const Services: React.FC<Props> = ({ t }) => {
  const [servicesData, setServicesData] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "/service/services"
        );
        setServicesData(response.data);
      } catch (error: any) {
        console.error("Error fetching services:", error.message);
        // Handle error as needed
      }
    };

    fetchServices();
  }, []);

  // Group services by category
  const servicesByCategory: { [key: string]: Service[] } = {};
  servicesData.forEach((service) => {
    const { category } = service;
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });

  // Define a limit for each category
  const categoryLimit = 3;

  return (
    <div>
      <Slide>
        <Header />
      </Slide>
      {Object.entries(servicesByCategory).map(([category, ads], index) => (
        <div key={category}>
          <Slide>
            <Box sx={{ backgroundColor: `${primaryColor}`, padding: "20px 0" }}>
              <Typography
                variant="h4"
                component="h2"
                textAlign="center"
                sx={{ fontWeight: "bold", color: "#ffffff" }}
              >
                <Link
                  to={`/services/${category
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  style={{ color: "#ffffff" }}
                >
                  {t(category)}
                </Link>
              </Typography>
            </Box>
          </Slide>
          <Zoom>
            <AdList ads={ads.slice(0, categoryLimit)} />
          </Zoom>
          <Box sx={{ textAlign: "center", margin: "20px" }}>
            {ads.length > categoryLimit && (
              <Slide>
                <Link
                  to={`/services/${category
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  <ViewMoreButtonComponent
                    buttonName={t("View More")}
                    endIcon={<ExpandMoreIcon />}
                  />
                </Link>
              </Slide>
            )}
          </Box>
        </div>
      ))}
      <Slide>
        <Footer />
      </Slide>
    </div>
  );
};

export default withTranslation()(Services);
