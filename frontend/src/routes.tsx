// AppRoutes.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import Home from "./components/home/home.component";
import Services from "./components/services/services.component";
import SignIn from "./components/signin/signin.component";
import SignupPage from "./components/register/register.component";
import EmailVerification from "./components/email/emailverify.component";
import ContactUs from "./components/contact/contactus.component";
import CategoryServices from "./components/categories/service.categories.component";
import AboutUs from "./components/about/about.component";
import WhyBMSPage from "./components/about/why.bms.component";
import AddServiceComponent from "./components/services/add.service.component";
import ProfilePage from "./components/profile/profile.component";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectUser } from "./auth/authSlice";
import { HomeRouter } from "./router/index";
import ResetPasswordComponent from "./components/password/reset.password.component";
import ServiceDetailsComponent from "./components/services/services.details.component";
import UserServices from "./components/profile/posted.services.component";
import EditServiceComponent from "./components/services/edit.service.component";
import ApplicationSecurityPage from "./components/policies/applicaton.security.component";

const AppRoutes: React.FC = () => {
  const authToken = useSelector(selectCurrentToken);
  const user = useSelector(selectUser); // Replace with your actual selector

  const PrivateRoute: React.FC<{
    element: React.ReactElement;
    roles?: string[];
    emailVerificationRequired?: boolean;
  }> = ({ element, roles, emailVerificationRequired }) => {
    if (!authToken) {
      return <Navigate to="/login" />;
    }

    if (roles && user.role && !roles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    if (emailVerificationRequired && user.emailValidate) {
      return <Navigate to="/" />;
    }

    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRouter />} />

        <Route path="/services/*" element={<Services />} />
        <Route
          path="/services/:categoryName"
          element={<CategoryServices categoryName={""} />}
        />
        <Route
          path="/add-service"
          element={
            <PrivateRoute
              element={<AddServiceComponent />}
              roles={["provider"]}
            />
          }
        />
        <Route
          path="/profile/posted-services"
          element={
            <PrivateRoute element={<UserServices />} roles={["provider"]} />
          }
        />
        <Route
          path="/service/edit-service/:serviceId"
          element={
            <PrivateRoute
              element={<EditServiceComponent />}
              roles={["provider"]}
            />
          }
        />
        <Route path="/why-bms" element={<WhyBMSPage />} />
        <Route
          path="/application-security"
          element={<ApplicationSecurityPage />}
        />

        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/profile"
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route path="/login" element={<SignIn />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route
          path="/email-verification"
          element={
            <PrivateRoute
              element={<EmailVerification />}
              emailVerificationRequired
            />
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgotpassword" element={<ResetPasswordComponent />} />
        <Route
          path="/services/details/:serviceId"
          element={<ServiceDetailsComponent />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
