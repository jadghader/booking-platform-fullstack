// About.styled.ts
import styled from "@mui/material/styles/styled";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export const AboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  textAlign: "left",
}));

export const TeamHeading = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase",
  fontWeight: "bold",
  margin: theme.spacing(4, 0),
  fontSize: "3rem",
}));

export const TeamCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],

  margin: theme.spacing(2, 0),
  textAlign: "center",
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  "& .MuiCardMedia-root": {
    paddingTop: "100%", // 1:1 aspect ratio
    borderRadius: "50%",
    margin: theme.spacing(2),
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  "& .MuiCardContent-root": {
    paddingBottom: theme.spacing(4),
  },
}));

export const StatsSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  "& .counter": {
    fontSize: "2rem",
    fontWeight: "bold",
  },
}));

export const CounterContent = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2, 0),
}));
