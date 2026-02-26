import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { primaryColor } from "../../assets/globals/global-constants";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { Slide, Zoom } from "react-awesome-reveal";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectUser } from "../../auth/authSlice";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import AdListProvider from "../../styled/list/AdList.provider.component";
import { Alert, Snackbar } from "@mui/material";
import { withTranslation } from "react-i18next";

interface Services {
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

const UserServices: React.FC = ({ t }: Props) => {
  const [userServices, setUserServices] = useState<Services[]>([]);
  const authToken = useSelector(selectCurrentToken);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userRole = user.role;
  const userId = user.user_id;
  const [showAlertFail, setShowAlertFail] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const fetchUserServices = async () => {
    try {
      const response = await axios.get(
        "/service/user-services",
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      setUserServices(response.data);
    } catch (error: any) {
      console.error("Error fetching user services:", error.message);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchUserServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (serviceId: number) => {
    try {
      // Call the API to delete the service with the given service_id
      const response = await axios.delete(
        `/service/delete/${serviceId}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      console.log("Service response:", response.data);
      fetchUserServices();
      setShowSuccessAlert(true);
    } catch (error: any) {
      console.error("Error deleting service:", error.message);
      setShowAlertFail(true);
    }
  };

  const handleEdit = (serviceId: number) => {
    // Navigate to the edit page
    navigate(`/service/edit-service/${serviceId}`);
  };

  return (
    <div>
      <Slide>
        <Header />
      </Slide>
      <IconButton
        onClick={() => {
          navigate("/profile");
        }}
        sx={{ color: `${primaryColor}`, marginLeft: 5 }}
      >
        <ArrowBack sx={{ fontSize: "2rem" }} />
      </IconButton>
      {userServices.length === 0 ? (
        <Zoom>
          <Typography variant="h1" textAlign="center" sx={{ margin: 5 }}>
            Sorry, you don't have any posted services.
          </Typography>
        </Zoom>
      ) : (
        <Zoom>
          <AdListProvider
            ads={userServices}
            isProvider={userRole === "provider"}
            userId={userId}
            onDelete={handleDelete}
            onEdit={handleEdit} // Pass the handleEdit function
          />
        </Zoom>
      )}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={1500}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{t("Service deleted successfully. ")}</Alert>
      </Snackbar>
      <Snackbar
        open={showAlertFail}
        autoHideDuration={6000}
        onClose={() => setShowAlertFail(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">
          {t("Service have booking and cannot be deleted. ")}
        </Alert>
      </Snackbar>
      <Slide>
        <Footer />
      </Slide>
    </div>
  );
};

export default withTranslation()(UserServices);
