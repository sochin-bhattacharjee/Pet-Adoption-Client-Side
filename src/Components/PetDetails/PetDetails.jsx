import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import Modal from "../Modal/Modal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axiosSecure.get(`/pets/${id}`);
        setPet(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };
    fetchPetDetails();
  }, [id, axiosSecure]);

  const handleAdoptClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {pet ? (
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">{pet.name}</h2>
            <p className="text-xl text-gray-600">Age: {pet.age}</p>
            <p className="text-xl text-gray-600">Location: {pet.location}</p>
            <p className="text-xl text-gray-600">Category: {pet.category}</p>
            <p className="text-lg text-gray-700">{pet.longDescription}</p>

            <p className="text-md text-gray-500 italic">{pet.shortDescription}</p>

            <Button
              onClick={handleAdoptClick}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Adopt
            </Button>

            {isModalOpen && <Modal pet={pet} onClose={() => setIsModalOpen(false)} />}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading pet details...</p>
      )}
    </div>
  );
};

export default PetDetails;
