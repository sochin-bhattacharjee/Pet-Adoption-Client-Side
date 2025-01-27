import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
      {data.map((donation) => (
        <Card key={donation._id} className="mt-6 dark:bg-gray-900">
          <div color="blue-gray" className="h-48 p-4 rounded-xl">
            <img
              className="w-full h-full object-cover rounded-xl"
              src={donation.petPicture}
              alt="card-image"
            />
          </div>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2 dark:text-gray-200">
              {donation.petName}
            </Typography>
            <Typography className="mb-2 dark:text-gray-200">{donation.shortDescription}</Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button className="dark:bg-gray-200 dark:text-gray-900" onClick={() => handleViewDetails(donation._id)}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DonationsCampaign;
