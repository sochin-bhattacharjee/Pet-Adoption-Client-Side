import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">All Donation Campaigns</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-6 text-left">Pet</th>
            <th className="py-3 px-6 text-left">Max Donation</th>
            <th className="py-3 px-6 text-left">Last Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6">{donation.shortDescription}</td>
              <td className="py-3 px-6">${donation.maxDonationAmount}</td>
              <td className="py-3 px-6">{donation.lastDate}</td>
              <td className="py-3 px-6">{donation.paused ? 'Paused' : 'Active'}</td>
              <td className="py-3 px-6 text-center">
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
                  className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMutation.mutate(donation._id)}
                  className="px-4 py-2 text-white bg-red-500 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDonations;
