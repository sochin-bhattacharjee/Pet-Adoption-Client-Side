import { Helmet } from "react-helmet";
import Banner from "../../Components/Banner/Banner";
import PetCategory from "../../Components/PetCategory/PetCategory";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Pet Adoption | Home</title>
      </Helmet>
      <Banner></Banner>
      <PetCategory></PetCategory>
    </div>
  );
};

export default Home;
