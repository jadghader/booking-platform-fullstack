import React from "react";
import {
  AdListContainer,
  AdCardContainer,
  AdCardWrapper,
} from "./AdList.styled";
import AdCardProvider from "../card/AdCard.provider";

interface Service {
  service_id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  user_id: number;
}

interface AdListProps {
  ads: Array<Service>;
  isProvider: boolean;
  userId: number;
  onDelete: (serviceId: number) => Promise<void>;
  onEdit: (serviceId: number) => void;
}

const AdListProvider: React.FC<AdListProps> = ({
  ads,
  isProvider,
  userId,
  onDelete,
  onEdit,
}) => {
  return (
    <AdListContainer>
      {ads.map((ad) => (
        <AdCardContainer key={ad.service_id}>
          <AdCardWrapper>
            <AdCardProvider
              ad={ad}
              isProvider={isProvider}
              userId={userId}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </AdCardWrapper>
        </AdCardContainer>
      ))}
    </AdListContainer>
  );
};

export default AdListProvider;
