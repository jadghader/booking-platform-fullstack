import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import { withTranslation } from "react-i18next";
import Container from "../../common/Container";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/BMS.svg";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentToken,
  selectUser,
  clearUser,
} from "../../auth/authSlice";
import { Snackbar, Alert } from "@mui/material";

const Header = ({ t }: any) => {
  const [visible, setVisibility] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };
  const navigate = useNavigate();

  const token = useSelector(selectCurrentToken);
  const isLoggedIn = !!token;
  const user = useSelector(selectUser);
  const isProvider = user && user.role === "provider";

  const dispatch = useDispatch();

  const handleLogout = () => {
    setSnackbarOpen(true);
    const logoutTimeout = 1300;

    setTimeout(() => {
      dispatch(clearUser());
    }, logoutTimeout);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const MenuItem = () => {
    return (
      <>
        <CustomNavLinkSmall onClick={() => navigate("/about")}>
          <Span>{t("About us")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => navigate("/why-bms")}>
          <Span>{t("Why BMS")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall>
          <Span
            onClick={() => navigate("/services")}
            // onMouseEnter={handleMouseEnter}
          >
            {t("Services")}
          </Span>
          {/* <Span>
            {showServicesPopup && (
              <PopupContainer onMouseLeave={handleMouseLeave}>
                <ServiceCategories />
              </PopupContainer>
            )}
          </Span> */}
        </CustomNavLinkSmall>
        {isLoggedIn ? (
          <>
            <CustomNavLinkSmall onClick={() => navigate("/profile")}>
              <Span>{t("Profile")}</Span>
            </CustomNavLinkSmall>
            <>
              {isProvider && (
                <CustomNavLinkSmall onClick={() => navigate("/add-service")}>
                  <Span>{t("Add Service")}</Span>
                </CustomNavLinkSmall>
              )}
            </>
            <CustomNavLinkSmall
              style={{ width: "150px" }}
              onClick={handleLogout}
            >
              <Span>
                <Button>{t("Sign Out")}</Button>
              </Span>
            </CustomNavLinkSmall>
          </>
        ) : (
          <>
            <CustomNavLinkSmall
              style={{ width: "150px" }}
              onClick={() => navigate("/login")}
            >
              <Span>
                <Button>{t("Sign In")}</Button>
              </Span>
            </CustomNavLinkSmall>
            <CustomNavLinkSmall
              style={{ width: "150px" }}
              onClick={() => navigate("/signup")}
            >
              <Span>
                <Button>{t("Register")}</Button>
              </Span>
            </CustomNavLinkSmall>
          </>
        )}
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
            <img src={Logo} alt="" width="125px" height="100px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} open={visible} onClose={onClose}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500} // Adjust duration as needed
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {t("Successfully logged out!")}
        </Alert>
      </Snackbar>
    </HeaderSection>
  );
};

export default withTranslation()(Header);
