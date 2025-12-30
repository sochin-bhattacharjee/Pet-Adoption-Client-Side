import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const PetCategory = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedCategory, setSelectedCategory] = useState("Cat");
  const navigate = useNavigate();

  const fetchPets = async () => {
    const response = await axiosSecure.get("/pets");
    return response.data;
  };

  const {
    data: pets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
  });

  const filteredPets = pets.filter((pet) => pet.category === selectedCategory);

  if (error) return <p>Error fetching pets: {error.message}</p>;

  return (
    <section className=" my-10">
      <div className="mx-auto">
        <h2 className="lg:text-2xl xl:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Pet Categories
        </h2>

        <div className="flex justify-center gap-1 sm:gap-2 md:gap-4 mb-2 h-c w-[95%] mx-auto">
          {["Cat", "Dog", "Rabbit", "Fish", "Cow"].map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-md font-medium ${
                selectedCategory === category
                  ? "bg-black dark:bg-white text-white dark:text-black font-bold"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <Grid
            container
            spacing={3}
            className="mt-6 p-2 md:p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-[90%] mx-auto"
          >
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item key={index} className="">
                <Box sx={{ width: "100%" }}>
                  <Skeleton
                    variant="rectangular"
                    className="w-[200px] sm:w-[310px] md:w-[330px] lg:w-[290px] xl:w-[305px] dark:bg-slate-600 rounded-md"
                    height={190}
                  />
                  <Skeleton
                    className="dark:bg-slate-600"
                    width="60%"
                    sx={{ mt: 1 }}
                  />
                  <Skeleton
                    className="dark:bg-slate-600"
                    width="40%"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-[85%] mx-auto gap-5">
            {filteredPets.map((pet) => (
              <Card
                key={pet._id}
                className="mt-6 w-full h-full dark:bg-gray-900"
              >
                <div color="blue-gray" className="h-48 p-4 rounded-xl">
                  <img
                    className="w-full h-full object-cover rounded-xl"
                    src={pet.image}
                    alt="card-image"
                  />
                </div>
                <CardBody className="flex flex-col justify-between py-4 flex-grow lg:gap-2">
                  <Typography
                    variant="h5"
                    color=""
                    className="mb-2 dark:text-white"
                  >
                    {pet.name}
                  </Typography>
                  <Typography className="dark:text-gray-300">
                    {pet.shortDescription || "No description available."}
                  </Typography>
                  <Button
                    onClick={() => navigate(`/pet/${pet._id}`)}
                    className="dark:bg-gray-300 dark:text-black"
                  >
                    See Details
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PetCategory;
