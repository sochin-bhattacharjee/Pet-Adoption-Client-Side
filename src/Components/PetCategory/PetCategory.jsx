import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PetCategory = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedCategory, setSelectedCategory] = useState("Cat");

  const fetchPets = async () => {
    const response = await axiosSecure.get("/pets");
    return response.data;
  };

  const { data: pets = [], isLoading, error } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
  });

  const filteredPets = pets.filter((pet) => pet.category === selectedCategory);

  if (isLoading) return <p>Loading pets...</p>;
  if (error) return <p>Error fetching pets: {error.message}</p>;

  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Pet Categories
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          {["Cat", "Dog", "Rabbit", "Fish", "Cow"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet._id}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-20 h-20 mx-auto mb-3 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                {pet.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Category: {pet.category}
              </p>
              <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded-full">
                Adopt Me
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetCategory;
