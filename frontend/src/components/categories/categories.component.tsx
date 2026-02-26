import { Box } from "@mui/material";
import { CategoriesButtonComponent } from "../../styled/button/button.component";
import { useNavigate } from "react-router-dom";

const ServiceCategories = () => {
  const categories = [
    "Home Services",
    "Personal Services",
    "Event Services",
    "Health and Wellness",
    "Automotive Services",
    "Educational Services",
    "Technology Services",
    "Business Services",
    "Delivery and Logistics",
    "Repair and Maintenance",
  ];

  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    // Convert category to lower case and replace spaces with "-"
    const formattedCategory = category.toLowerCase().replace(/\s/g, "-");
    // Navigate to the corresponding category route
    navigate(`/services/${formattedCategory}`);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexFlow: "wrap",
          justifyContent: "center",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {categories.map((category, index) => (
          <CategoriesButtonComponent
            key={index}
            buttonName={category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </Box>
    </>
  );
};

export default ServiceCategories;
