// AdList.styled.ts
import { styled } from "@mui/system";

export const AdListContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  padding: "30px",

  // Media query for screens 774px and smaller
  "@media (max-width: 765px)": {
    flexDirection: "column", // Change flex direction to column
  },
});
export const AdCardContainer = styled("div")({
  width: "calc(33.33% - 25px)", // 33.33% width for each column with a 10px gap
  boxSizing: "border-box",
  border: "1px solid #e0e0e0", // Border color
  borderRadius: "10px",
  "@media (max-width: 765px)": {
    width: "100%",
  },
});

export const AdCardWrapper = styled("div")({
  padding: "15px",
});
