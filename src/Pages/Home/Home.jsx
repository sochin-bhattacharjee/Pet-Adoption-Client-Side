import { Helmet } from "react-helmet";
import Banner from "../../Components/Banner/Banner";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Pet Adoption | Home</title>
      </Helmet>
      <Banner></Banner>
    </div>
  );
};

export default Home;
