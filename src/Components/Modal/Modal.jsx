import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from './../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { IoIosCloseCircle } from "react-icons/io";

const Modal = ({ pet, onClose }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.image,
      userName: user.displayName,
      userEmail: user.email,
      phone,
      address,
    };

    try {
      const response = await axiosSecure.post("/adoptions", adoptionData);
      if (response.data.success) {
        alert("Adoption request submitted successfully!");
        onClose();
        navigate("/petListing");
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error);
    }
  };

  return (
    <div className="fixed inset-0 pt-12 sm:pt-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-xl w-96 max-w-lg shadow-lg relative transition-transform transform scale-50 lg:scale-90 z-60">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-3xl font-bold text-gray-600 hover:text-gray-700 focus:outline-none"
        >
          <IoIosCloseCircle />
        </button>
        <h3 className="text-2xl font-semibold text-center mb-6 text-blue-600">Adopt {pet.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-400">Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border-2 border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full border-2 border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter your address"
            ></textarea>
          </div>
          <Button 
            type="submit" 
            className="w-full dark:bg-gray-200 dark:text-black text-white font-bold py-3 rounded-md transition-all duration-300"
          >
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
