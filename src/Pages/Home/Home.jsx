import { Helmet } from "react-helmet";
import Banner from "../../Components/Banner/Banner";
import PetCategory from "../../Components/PetCategory/PetCategory";
import Inspirational from "../../Components/Inspirational/Inspirational";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Pet Adoption | Home</title>
      </Helmet>
      <Banner></Banner>
      <PetCategory></PetCategory>
      <Inspirational></Inspirational>
    </div>
  );
};

export default Home;
