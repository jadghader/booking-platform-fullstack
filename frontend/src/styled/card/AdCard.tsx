// AdCard.tsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface AdProps {
  service_id: number;
  category: string;
  title: string;
  description: string;
  price: number;
}

interface AdCardProps {
  ad: AdProps;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { title, description, category, price } = ad;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="div">
          {title}
        </Typography>
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
  );
};

export default AdCard;
