import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Card, Typography } from '@material-tailwind/react';

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: donations, error, isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/donations');
      return response.data.donations;
    },
  });

  const pauseUnpauseMutation = useMutation({
    mutationFn: async ({ id, paused }) => {
      const response = await axiosSecure.patch(`/api/donations/${id}/pause`, { paused: !paused });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['donations']);
      Swal.fire({
        icon: 'success',
        title: `Donation ${!variables.paused ? 'paused' : 'unpaused'} successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update donation status.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/api/donations/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['donations']);
      Swal.fire({
        icon: 'success',
        title: 'Donation deleted successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete donation.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const handleEdit = (donation) => {
    console.log('Edit donation:', donation);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading donations.</div>;

  const TABLE_HEAD = ['Pet', 'Max Donation', 'Last Date', 'Status', 'Actions'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">All Donation Campaigns</h2>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
            {donations.map((donation) => {
              const isLast = donations.indexOf(donation) === donations.length - 1;
              const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';

              return (
                <tr key={donation._id}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {donation.shortDescription}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      ${donation.maxDonationAmount}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {donation.lastDate}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {donation.paused ? 'Paused' : 'Active'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          pauseUnpauseMutation.mutate({
                            id: donation._id,
                            paused: donation.paused,
                          })
                        }
                        className={`px-4 py-2 text-white ${donation.paused ? 'bg-green-500' : 'bg-red-500'} rounded-md`}
                      >
                        {donation.paused ? 'Unpause' : 'Pause'}
                      </button>

                      <button
                        onClick={() => handleEdit(donation)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(donation._id)}
                        className="px-4 py-2 text-white bg-red-500 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AllDonations;
