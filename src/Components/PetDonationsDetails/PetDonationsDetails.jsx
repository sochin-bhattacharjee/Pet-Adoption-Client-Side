import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PetDonationsDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [donationDetails, setDonationDetails] = useState(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const response = await axiosSecure.get(`/api/donations/${id}`);
        setDonationDetails(response.data);
      } catch (error) {
        console.error("Error fetching donation details:", error);
      }
    };

    fetchDonationDetails();
  }, [id, axiosSecure]);

  if (!donationDetails) return <div className="text-center text-xl">Loading details...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Pet Donation Details</h1>
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <img
            src={donationDetails.petPicture}
            alt="pet-image"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3 md:pl-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{donationDetails.petName}</h2>
          <p className="text-gray-600 mb-4">{donationDetails.fullDescription}</p>
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h3 className="font-medium text-lg text-gray-700">Max Donation</h3>
              <p className="text-xl font-semibold text-green-600">{donationDetails.maxDonationAmount} USD</p>
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-700">Donated Amount</h3>
              <p className="text-xl font-semibold text-blue-600">{donationDetails.donatedAmount} USD</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetDonationsDetails;
