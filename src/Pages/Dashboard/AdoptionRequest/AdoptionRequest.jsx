import React, { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const TABLE_HEAD = [
  "Pet Name",
  "Name",
  "Email",
  "Phone",
  "Location",
  "Actions",
];

// Skeleton Component
const SkeletonRow = () => (
  <tr>
    {Array(6)
      .fill(0)
      .map((_, index) => (
        <td
          key={index}
          className="p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </td>
      ))}
  </tr>
);

const AdoptionRequest = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const response = await axiosSecure.get("/adoptions");
        setAdoptionRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch adoption requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionRequests();
  }, [axiosSecure]);

  const handleAccept = async (requestId, petId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to accept this adoption request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, accept!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/adoptions/${requestId}`, { status: "accepted" });
      Swal.fire({
        icon: "success",
        title: "Request accepted!",
        showConfirmButton: false,
        timer: 1500,
      });
      setAdoptionRequests((prev) => prev.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Failed to accept request:", error);
      Swal.fire("Error!", "Failed to accept the request", "error");
    }
  };

  const handleReject = async (requestId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this adoption request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/adoptions/${requestId}`, { status: "rejected" });
      Swal.fire({
        icon: "warning",
        title: "Request rejected!",
        showConfirmButton: false,
        timer: 1500,
      });
      setAdoptionRequests((prev) => prev.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Failed to reject request:", error);
      Swal.fire("Error!", "Failed to reject the request", "error");
    }
  };

  return (
    <div className="p-1 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Pet Adoption | Adoption Request</title>
      </Helmet>
      <Typography
        variant="h4"
        className="mb-4 text-center text-gray-900 dark:text-gray-100"
      >
        Adoption Requests
      </Typography>

      <Card className="w-full overflow-auto p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg min-h-screen">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              {TABLE_HEAD.map((head) => (
                <th key={head} className="p-4 border-b border-gray-300 dark:border-gray-600">
                  <Typography className="font-semibold text-gray-700 dark:text-gray-200">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-b border-gray-300 dark:border-gray-500">
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              : adoptionRequests.map(
                  ({ _id, userName, userEmail, phone, address, petName, petId }, index) => {
                    const isLast = index === adoptionRequests.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-gray-200 dark:border-gray-700";

                    return (
                      <tr key={_id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <td className={classes}>
                          <Typography className="text-gray-900 dark:text-gray-100">{petName || "N/A"}</Typography>
                        </td>
                        <td className={classes}>
                          <Typography className="text-gray-900 dark:text-gray-100">{userName}</Typography>
                        </td>
                        <td className={classes}>
                          <Typography className="text-gray-900 dark:text-gray-100">{userEmail}</Typography>
                        </td>
                        <td className={classes}>
                          <Typography className="text-gray-900 dark:text-gray-100">{phone || "N/A"}</Typography>
                        </td>
                        <td className={classes}>
                          <Typography className="text-gray-900 dark:text-gray-100">{address || "N/A"}</Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex gap-2">
                            <Button size="sm" color="green" onClick={() => handleAccept(_id, petId)}>
                              Accept
                            </Button>
                            <Button size="sm" color="red" onClick={() => handleReject(_id)}>
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdoptionRequest;
