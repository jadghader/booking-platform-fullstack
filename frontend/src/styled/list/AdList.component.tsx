// AdList.component.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  AdListContainer,
  AdCardContainer,
  AdCardWrapper,
} from "./AdList.styled";
import AdCard from "../card/AdCard";

interface AdProps {
  service_id: number;
  category: string;
  title: string;
  description: string;
  price: number;
}

interface AdListProps {
  ads: Array<AdProps>;
}

const AdList: React.FC<AdListProps> = ({ ads }) => {

  return (
    <AdListContainer>
      {ads.map((ad) => (
        <AdCardContainer key={ad.service_id}>
          {/* Pass service_id as a parameter in the Link */}
          <Link to={`/services/details/${ad.service_id}`}>
            <AdCardWrapper>
              <AdCard ad={ad} />
            </AdCardWrapper>
          </Link>
        </AdCardContainer>
      ))}
    </AdListContainer>
  );
};

export default AdList;
