import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdList from "../../styled/list/AdList.component";
import Footer from "../../components/Footer";
import { Box, Typography, IconButton } from "@mui/material";
import { primaryColor } from "../../assets/globals/global-constants";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import { AirbnbSlider } from "../../styled/slider/slider.component";
import { withTranslation } from "react-i18next";

interface Service {
  service_id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  user_id: number;
}

interface CategoryServicesProps {
  categoryName: string;
  t: any;
}

const CategoryServices: React.FC<CategoryServicesProps> = ({
  categoryName,
  t,
}) => {
  const { categoryName: routeCategoryName } = useParams<{
    categoryName?: string;
  }>();

  const formattedRouteCategoryName = routeCategoryName
    ? routeCategoryName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : categoryName;

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); // Initial range [min, max]
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `/service/services?category=${formattedRouteCategoryName}`
        );
        setServices(response.data);
        setFilteredServices(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching services:", error.message);
        // Handle error as needed
        setLoading(false);
      }
    };

    fetchServices();
  }, [formattedRouteCategoryName]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    filterServices(newValue as number[]);
  };

  const filterServices = (range: number[]) => {
    const filtered = services.filter(
      (service) => service.price >= range[0] && service.price <= range[1]
    );
    setFilteredServices(filtered);
  };

  return (
    <div>
      <Header />
      <Box sx={{ backgroundColor: `${primaryColor}`, padding: "20px 0" }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          sx={{ fontWeight: "bold", color: "#ffffff" }}
        >
          {t(formattedRouteCategoryName)}
        </Typography>
      </Box>
      <Box sx={{ margin: "10px" }}>
        <IconButton
          onClick={() => {
            navigate("/services");
          }}
          sx={{ color: `${primaryColor}` }}
        >
          <ArrowBack sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box>
      <Box alignContent={"flex-end"} sx={{ marginLeft: 7 }}>
        <Typography variant="h5">{t("Price Range")}</Typography>
        <AirbnbSlider
          value={priceRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
          min={0}
          max={100}
          sx={{
            width: "10%",
            "@media (max-width: 765px)": {
              width: "30%",
            },
          }}
        />
      </Box>
      {loading ? (
        <Typography variant="body1">{t("Loading")}...</Typography>
      ) : (
        <AdList ads={filteredServices} />
      )}
      <Footer />
    </div>
  );
};

export default withTranslation()(CategoryServices);
