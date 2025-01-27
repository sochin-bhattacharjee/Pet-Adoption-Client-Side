import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { Button } from "@material-tailwind/react";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const PetDonationsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [donationDetails, setDonationDetails] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");

  const fetchDonationDetails = async () => {
    try {
      const response = await axiosPublic.get(`/api/donations/${id}`);
      setDonationDetails(response.data);
    } catch (error) {
      console.error("Error fetching donation details:", error);
    }
  };

  useEffect(() => {
    fetchDonationDetails();
  }, [id, axiosPublic]);

  if (!donationDetails) return <div className="text-center text-xl">Loading details...</div>;

  const handleDonate = async () => {
    if (!donationAmount || donationAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid amount",
        text: "Please enter a valid donation amount!",
      });
      return;
    }

    try {
      await axiosPublic.post(`/api/donations/${id}`, {
        donationAmount,
        userName: user.displayName,
        userEmail: user.email,
      });

      Swal.fire({
        icon: "success",
        title: "Donation Successful!",
        text: `You have donated ${donationAmount} USD to this campaign.`,
      });
      navigate("/dashboard/myDonations");
      fetchDonationDetails();

    } catch (error) {
      console.error("Error making donation:", error);
      Swal.fire({
        icon: "error",
        title: "Donation Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Donate to {donationDetails.petName}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Help {donationDetails.petName} find a forever home</p>
      </header>

      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <img
            src={donationDetails.petPicture}
            alt="pet-image"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3 md:pl-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-gray-200">{donationDetails.petName}</h2>
          <p className="text-gray-600 mb-4">{donationDetails.fullDescription}</p>
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h3 className="font-medium text-lg text-gray-700 dark:text-gray-300">Max Donation</h3>
              <p className="text-xl font-semibold text-green-600">{donationDetails.maxDonationAmount} TK</p>
            </div>
            {/* <div>
              <h3 className="font-medium text-lg text-gray-700">Donated Amount</h3>
              <p className="text-xl font-semibold text-blue-600">{donationDetails.donatedAmount}</p>
            </div> */}
          </div>
          <input
            type="number"
            placeholder="Enter Donation Amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <Button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
            onClick={handleDonate}
          >
            Donate Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetDonationsDetails;
