import { Suspense } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import Home from "../pages/Home/index";

export const HomeRouter = () => {
  return (
    <Suspense fallback={null}>
      <Styles />
      <Header />
      <Home />
      <Footer />
    </Suspense>
  );
};
