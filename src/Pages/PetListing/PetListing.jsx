import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
    Card,
    CardBody,
    Typography,
    Button,
  } from "@material-tailwind/react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PetListing = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosSecure.get("/pets");
        const data = response.data;
        setPets(data);
        setFilteredPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(query) &&
        (selectedCategory === "" || pet.category === selectedCategory)
    );
    setFilteredPets(filtered);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    const filtered = pets.filter(
      (pet) =>
        (category === "" || pet.category === category) &&
        pet.name.toLowerCase().includes(searchQuery)
    );
    setFilteredPets(filtered);
  };

  return (
    <div className="container mx-auto sm:p-6">
      <Helmet>
        <title>Pet Listing</title>
      </Helmet>

      <div className="sticky top-14 z-30 dark:bg-gray-900 bg-opacity-70 backdrop-blur-md py-2 sm:py-4 px-2 sm:px-6 rounded-lg shadow-md">
        <div className="flex flex-row justify-between items-center sm:gap-4">
          <h2 className="text-lg md:text-3xl font-bold dark:text-white">
            Pet Listings
          </h2>
          <div className="flex flex-row gap-1 sm:gap-4">
            <input
              type="text"
              placeholder="Search pets by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered w-full md:max-w-xs max-w-36 p-1 sm:p-3 rounded-md md:rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
            />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="select select-bordered md:max-w-xs max-w-36 rounded-md md:rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-400 p-1"
            >
              <option value="">All Categories</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Fish">Fish</option>
              <option value="Cow">Cow</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Bird">Bird</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <Card key={pet._id} className="mt-6 w-full h-full dark:bg-gray-900">
            <div color="blue-gray" className="h-48 p-4 rounded-xl">
              <img className="w-full h-full object-cover rounded-xl"
                src={pet.image}
                alt="card-image"
              />
            </div>
            <CardBody className="flex flex-col justify-between py-4 flex-grow lg:gap-2">
              <Typography variant="h5" color="" className="mb-2 dark:text-white">
                {pet.name}
              </Typography>
              <Typography className="dark:text-gray-300">
                {pet.shortDescription || "No description available."}
              </Typography>
              <Typography className="dark:text-gray-300">
                <span className="text-black dark:text-white">Age : </span>{pet.age || "No description available."}
              </Typography>
              <Typography className="dark:text-gray-300">
                <span className="text-black dark:text-white">Location : </span>{pet.location || "No description available."}
              </Typography>
              <Typography className="dark:text-gray-300">
                <span className="text-black dark:text-white">Category : </span>{pet.category || "No description available."}
              </Typography>
              <Button className="dark:bg-gray-300 dark:text-black">See Details</Button>
            </CardBody>
          </Card>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No pets found.
          </p>
        )}
      </div>
    </div>
  );
};

export default PetListing;
