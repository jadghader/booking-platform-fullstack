import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { withTranslation } from "react-i18next";

interface AdProps {
  service_id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  user_id: number;
}

interface AdCardProps {
  ad: AdProps;
  isProvider: boolean;
  userId: number;
  onDelete: (serviceId: number) => Promise<void>;
  onEdit: (serviceId: number) => void;
}

const AdCardProvider: React.FC<AdCardProps> = ({
  ad,
  isProvider,
  userId,
  onDelete,
  onEdit,
}) => {
  const { service_id, title, description, category, price, user_id } = ad;
  const navigate = useNavigate();
  const isUserOwner = isProvider && userId === user_id;

  const handleEdit = () => {
    // Navigate to the edit page
    navigate(`/service/edit-service/${service_id}`);
  };

  const handleDelete = async () => {
    try {
      if (isUserOwner) {
        // Call the onDelete prop with the service_id
        await onDelete(service_id);
      } else {
        console.log("You are not authorized to delete this service.");
      }
    } catch (error: any) {
      console.error("Error deleting service:", error.message);
      // Handle error as needed
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box
            style={{
              position: "relative",
            }}
          >
            <Typography variant="h4" component="div">
              {title}
            </Typography>
            {isUserOwner && (
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            Category: {category}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Description: {description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${price.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default withTranslation()(AdCardProvider);
