import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

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

  if (!donationDetails) return (
    <div className="w-[95%] md:max-w-2xl lg:max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg animate-pulse">
        <div className="flex justify-start mb-6">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-md mb-3 w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md mb-6 w-1/2 mx-auto"></div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="md:w-2/3 flex flex-col gap-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md w-1/2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-full"></div>
            <div className="flex gap-4 mt-4">
              <div className="h-16 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
              <div className="h-16 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            </div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-md w-full mt-4"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-md w-1/3 mt-2"></div>
          </div>
        </div>
      </div>
  );

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
    <div className="w-[95%] md:max-w-2xl lg:max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg relative">
      <FaArrowRightToBracket onClick={()=>navigate("/donationsCampaign")} size={20} className="dark:text-slate-200 cursor-pointer rotate-180 absolute top-5 left-5 animate-pulse"/>
      <header className="mb-6 mt-6 md:mt-0 text-center">
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
            <div>
              <h3 className="font-medium text-lg text-gray-700 dark:text-gray-300">Donated Amount</h3>
              <p className="text-xl font-semibold text-blue-500">{donationDetails.totalDonatedAmount} TK</p>
            </div>

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
