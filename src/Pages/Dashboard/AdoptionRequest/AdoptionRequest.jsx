import React, { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TABLE_HEAD = [
  "Pet Name",
  "Name",
  "Email",
  "Phone",
  "Location",
  "Actions",
];

const AdoptionRequest = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const axiosSecure = useAxiosSecure();

  // Fetch adoption requests for the logged-in user's pets
  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const response = await axiosSecure.get("/adoptions");
        setAdoptionRequests(response.data); // API response
      } catch (error) {
        console.error("Failed to fetch adoption requests:", error);
      }
    };

    fetchAdoptionRequests();
  }, [axiosSecure]);

  const handleAccept = async (requestId, petId) => {
    try {
      // Send a request to accept the adoption
      await axiosSecure.patch(`/adoptions/${requestId}`, {
        status: "accepted",
      });
      alert("Request accepted!");

      // Update the local state by marking the pet as adopted
      setAdoptionRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept the request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      // Send a request to reject the adoption
      await axiosSecure.patch(`/adoptions/${requestId}`, {
        status: "rejected",
      });
      alert("Request rejected!");

      // Update the local state by removing the rejected request
      setAdoptionRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject the request");
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll p-4">
      <Typography variant="h4" className="mb-4 text-blue-gray-800">
        Adoption Requests
      </Typography>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {adoptionRequests.map(
            (
              { _id, userName, userEmail, phone, address, petName, petId },
              index
            ) => {
              const isLast = index === adoptionRequests.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={_id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {petName || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {userName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {userEmail}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {phone || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {address || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="green"
                        onClick={() => handleAccept(_id, petId)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        color="red"
                        onClick={() => handleReject(_id)}
                      >
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
  );
};

export default AdoptionRequest;
