import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const DonationsCampaign = () => {
  const axiosPublic = useAxiosSecure();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const response = await axiosPublic.get("/api/donations");
      console.log("Fetched Donations:", response.data);
      return response.data.donations;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading donations</div>;

  const handleViewDetails = (id) => {
    navigate(`/pet-donations-details/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {data.map((donation) => (
        <Card key={donation._id} className="mt-6">
          <CardHeader color="blue-gray" className="relative h-56">
            <img src={donation.petPicture} alt="pet-image" />
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {donation.petName}
            </Typography>
            <Typography>
              {donation.shortDescription}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={() => handleViewDetails(donation._id)}>View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DonationsCampaign;
