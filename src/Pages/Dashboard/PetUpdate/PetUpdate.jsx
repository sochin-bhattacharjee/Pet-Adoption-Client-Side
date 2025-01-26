import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Card, Typography, Textarea } from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PetUpdate = () => {
  const { petId } = useParams();
  const [petData, setPetData] = useState({
    name: "",
    age: "",
    category: "",
    breed: "",
    location: "",
    shortDescription: "",
    longDescription: "",
    image: "",
    adopted: false,
  });
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axiosSecure.get(`/pets/${petId}`);
        setPetData(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPet();
  }, [petId, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.patch(`/update-pet/${petId}`, petData);
      navigate("/dashboard/myAddPet");
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl shadow-lg p-8 bg-white rounded-xl">
        <Typography variant="h4" className="text-center font-bold mb-6 text-blue-600">
          Update Pet Details
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Pet Name"
            value={petData.name}
            name="name"
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            label="Age"
            value={petData.age}
            name="age"
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            label="Category"
            value={petData.category}
            name="category"
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            label="Breed"
            value={petData.breed}
            name="breed"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="Location"
            value={petData.location}
            name="location"
            onChange={handleChange}
            required
            className="w-full"
          />
          <Textarea
            label="Short Description"
            value={petData.shortDescription}
            name="shortDescription"
            onChange={handleChange}
            required
            className="w-full"
          />
          <Textarea
            label="Long Description"
            value={petData.longDescription}
            name="longDescription"
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="Image URL"
            value={petData.image}
            name="image"
            onChange={handleChange}
            required
            className="w-full"
          />
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={petData.adopted}
              name="adopted"
              onChange={(e) =>
                setPetData((prevData) => ({
                  ...prevData,
                  adopted: e.target.checked,
                }))
              }
              className="w-5 h-5 text-blue-600 focus:ring focus:ring-blue-300 rounded"
            />
            <span className="text-gray-700">Adopted</span>
          </label>
          <Button type="submit" color="blue" className="w-full py-3 text-lg font-bold">
            Update Pet
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PetUpdate;
