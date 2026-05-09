import Home from "./Home";
import Shop from "./Shop";
import Deals from "./Deals";
import NewArrivals from "../components/NewArrivals";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

/**
 * Landing page — assembles all home sections in order.
 * Each section has its own id for smooth-scroll navigation.
 */
const Landing = () => (
  <>
    <Home />
    <Shop />
    <Deals />
    <NewArrivals />
    <ContactSection />
    <Footer />
  </>
);

export default Landing;
