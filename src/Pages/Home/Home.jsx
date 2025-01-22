import { Helmet } from "react-helmet";
import Banner from "../../Components/Banner/Banner";
import PetCategory from "../../Components/PetCategory/PetCategory";
import Inspirational from "../../Components/Inspirational/Inspirational";
import AboutUs from "../../Components/AboutUs/AboutUs";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Pet Adoption | Home</title>
      </Helmet>
      <Banner></Banner>
      <PetCategory></PetCategory>
      <Inspirational></Inspirational>
      <AboutUs></AboutUs>
    </div>
  );
};

export default Home;
