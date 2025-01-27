import ReactModal from "react-modal";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Button, Progress, Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

ReactModal.setAppElement("#root");

const MyDonationsCampaign = () => {
  const axiosSecure = useAxiosSecure();
  const [showDonators, setShowDonators] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const {
    data: donationData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["donations", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/campaigns?email=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (donationData) {
      setDonations(donationData);
    }
  }, [donationData]);

  const pauseUnpauseMutation = useMutation({
    mutationFn: async (donationId) => {
      const donation = donations.find((d) => d._id === donationId);
      const newPausedState = !donation.paused;
      const response = await axiosSecure.patch(
        `/api/donations/${donationId}/pause`,
        { paused: newPausedState }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      const updatedDonations = donations.map((donation) =>
        donation._id === variables
          ? { ...donation, paused: data.paused }
          : donation
      );
      setDonations(updatedDonations);

      Swal.fire({
        icon: "success",
        title: `Donation ${data.paused ? "paused" : "unpaused"} successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed to update donation status.",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (donationId) => {
      await axiosSecure.delete(`/api/donations/${donationId}`);
    },
    onSuccess: (_, variables) => {
      setDonations(donations.filter((donation) => donation._id !== variables));

      Swal.fire({
        icon: "success",
        title: "Donation deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed to delete donation.",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const handlePause = (donationId) => {
    pauseUnpauseMutation.mutate(donationId);
  };

  const handleViewDonators = (donation) => {
    setSelectedDonation(donation);
    console.log(donation);
    setShowDonators(true);
  };
  const handleDelete = (donationId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(donationId);
      }
    });
  };

  const closeModal = () => {
    setShowDonators(false);
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error fetching donations.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Donations Campaign</h2>

      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Pet Name
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Max Donation Amount
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Donation Progress
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Total Donation Amount
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => {
              const progress =
                (donation.totalDonatedAmount / donation.maxDonationAmount) *
                100;
              const progressPercentage = isNaN(progress)
                ? 0
                : progress > 100
                ? 100
                : progress;
              const formattedAmount = isNaN(donation.totalDonatedAmount)
                ? 0
                : donation.totalDonatedAmount;

              return (
                <tr key={donation._id}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {donation.petName}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      ${donation.maxDonationAmount}
                    </Typography>
                  </td>

                  <td className="p-6 border-b border-blue-gray-50 w-full flex items-center">
                    <Progress
                      className="bg-red-500 h-2 rounded-full w-[150px]"
                      color="green"
                      value={progressPercentage}
                    />
                    <span className="ml-2 text-sm ">
                      {Math.round(progressPercentage)}%
                    </span>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      ${formattedAmount}
                    </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50 flex space-x-2">
                    <Button
                      onClick={() => handlePause(donation._id)}
                      color={donation.paused ? "red" : "green"}
                    >
                      {donation.paused ? "Unpause" : "Pause"}
                    </Button>
                    <Button
                      onClick={() => handleViewDonators(donation)}
                      color="blue"
                    >
                      View Donators
                    </Button>
                    <Button
                      onClick={() => handleDelete(donation._id)}
                      color="red"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <ReactModal
        isOpen={showDonators}
        onRequestClose={closeModal}
        className="max-w-[90%] w-full md:max-w-xl p-6 bg-white rounded-lg shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {selectedDonation ? (
          selectedDonation.donations &&
          selectedDonation.donations.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Donators for {selectedDonation.petName}
              </h3>
              <ul>
                {selectedDonation.donations.map((donator, index) => (
                  <li key={index} className="mb-2">
                    <div>
                      {donator.userName} - ${donator.donationAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      Email: {donator.userEmail}
                    </div>
                    <div className="text-xs text-gray-400">
                      Donated on:{" "}
                      {new Date(donator.donationDate).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                No donations found for {selectedDonation.petName}.
              </h3>
            </div>
          )
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No donation selected.
            </h3>
          </div>
        )}
        <Button onClick={closeModal} color="gray" className="mt-4">
          Close
        </Button>
      </ReactModal>
    </div>
  );
};

export default MyDonationsCampaign;
