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
import { Helmet } from "react-helmet";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

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

  if (isError) return <div>Error loading donations</div>;

  const handleViewDetails = (id) => {
    navigate(`/pet-donations-details/${id}`);
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="mt-10">
      <Helmet>
        <title>
          Pet Adoption | Donations Campaign
        </title>
      </Helmet>
      {isLoading?(
        <Grid container spacing={3} className="mt-6 p-2 md:p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from(new Array(8)).map((_, index) => (
                    <Grid item key={index} className="">
                      <Box sx={{ width: "100%" }}>
                        <Skeleton variant="rectangular" className="w-[170px] sm:w-[310px] md:w-[330px] lg:w-[290px] dark:bg-slate-600 rounded-md" height={190} />
                        <Skeleton className="dark:bg-slate-600" width="60%" sx={{ mt: 1 }} />
                        <Skeleton className="dark:bg-slate-600" width="40%" sx={{ mt: 0.5 }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      )}
      
    </div>
    </div>
  );
};

export default DonationsCampaign;
