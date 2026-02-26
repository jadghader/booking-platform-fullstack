// ServiceDetailsComponent.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import Booking from "../booking/booking.component";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice";
import BackdropComponent from "../../styled/backdrop/backdrop.component";
import homeServices from "../../../src/assets/svg/undraw_sweet_home_dkhr.svg";
import personalServices from "../../../src/assets/svg/undraw_personal_trainer_re_cnua.svg";
import eventServices from "../../../src/assets/svg/undraw_special_event_-4-aj8.svg";
import healthServices from "../../../src/assets/svg/undraw_medical_care_movn.svg";
import automotiveServices from "../../../src/assets/svg/undraw_automobile_repair_ywci.svg";
import educationalServices from "../../../src/assets/svg/undraw_educator_re_ju47.svg";
import technologyServices from "../../../src/assets/svg/undraw_code_review_re_woeb.svg";
import buisnessServices from "../../../src/assets/svg/undraw_business_deal_re_up4u.svg";
import repairServices from "../../../src/assets/svg/undraw_fixing_bugs_w7gi.svg";
import deliveryServices from "../../../src/assets/svg/undraw_on_the_way_re_swjt.svg";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { primaryColor } from "../../assets/globals/global-constants";

interface Service {
  service_id: number;
  category: string;
  title: string;
  description: string;
  price: number;
}

const ServiceDetailsComponent: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isProvider = user && user.role !== "provider";
  const [openLoad, setOpenLoad] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(
          `/service/services/${serviceId}`
        );
        setService(response.data);
      } catch (error: any) {
        console.error("Error fetching service details:", error.message);
        setOpenLoad(true);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const categoryImages: { [key: string]: string } = {
    "Home Services": homeServices,
    "Personal Services ": personalServices,
    "Event Services": eventServices,
    "Health and Wellness": healthServices,
    "Automotive Services": automotiveServices,
    "Educational Services": educationalServices,
    "Technology Services": technologyServices,
    "Business Services": buisnessServices,
    "Delivery and Logistics": deliveryServices,
    "Repair and Maintenance": repairServices,
    Default: homeServices,
  };

  if (!service) {
    return <BackdropComponent open={openLoad} />;
  }

  const categoryImage =
    categoryImages[service.category] || categoryImages.Default;

  return (
    <>
      <Header />
      <Container
        maxWidth="md"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <Box style={{ alignSelf: "flex-start", marginTop: "10px" }}>
          <IconButton
            onClick={() => {
              navigate("/services");
            }}
            sx={{ color: `${primaryColor}` }}
          >
            <ArrowBack sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Box>
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={categoryImage}
              alt={service.category}
              sx={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              raised
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight="bold"
                  mb={2}
                  textAlign={{ xs: "center", md: "left" }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  mb={3}
                  textAlign={{ xs: "center", md: "left" }}
                >
                  {service.category}
                </Typography>
                <Typography variant="body1" mb={3}>
                  {service.description}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  textAlign={{ xs: "center", md: "left" }}
                >
                  Price: ${service.price}
                </Typography>
              </CardContent>
              {isProvider && (
                <Box sx={{ p: 2 }}>
                  <Booking serviceId={service.service_id} />
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ServiceDetailsComponent;
