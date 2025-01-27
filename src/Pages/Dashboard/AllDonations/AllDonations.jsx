import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Card, Typography } from '@material-tailwind/react';
import Modal from 'react-modal';

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

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
    onError: () => {
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
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete donation.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const updateDonationMutation = useMutation({
    mutationFn: async (updatedDonation) => {
      const response = await axiosSecure.put(`/api/donations/${updatedDonation._id}`, updatedDonation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['donations']);
      setModalIsOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Donation updated successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update donation.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setSelectedDonation(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedDonation = {
      ...selectedDonation,
      [e.target.name]: e.target.value,
    };
    updateDonationMutation.mutate(updatedDonation);
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
                  <td className={classes}>{donation.petName}</td>
                  <td className={classes}>${donation.maxDonationAmount}</td>
                  <td className={classes}>{donation.lastDate}</td>
                  <td className={classes}>{donation.paused ? 'Paused' : 'Active'}</td>
                  <td className={classes}>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          pauseUnpauseMutation.mutate({ id: donation._id, paused: donation.paused })
                        }
                        className={`px-4 py-2 text-white ${
                          donation.paused ? 'bg-green-500' : 'bg-red-500'
                        } rounded-md`}
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

      {selectedDonation && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModalClose}
          className="w-full max-w-md mx-auto mt-20 bg-white rounded-lg shadow-lg p-6"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          ariaHideApp={false}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">Edit Donation</h2>
            <label className="block">
              <span className="text-gray-700">Pet Name</span>
              <input
                type="text"
                name="petName"
                value={selectedDonation.petName}
                onChange={(e) =>
                  setSelectedDonation({ ...selectedDonation, petName: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Max Donation Amount</span>
              <input
                type="number"
                name="maxDonationAmount"
                value={selectedDonation.maxDonationAmount}
                onChange={(e) =>
                  setSelectedDonation({
                    ...selectedDonation,
                    maxDonationAmount: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Short Description</span>
              <textarea
                name="shortDescription"
                value={selectedDonation.shortDescription}
                onChange={(e) =>
                  setSelectedDonation({
                    ...selectedDonation,
                    shortDescription: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Long Description</span>
              <textarea
                name="longDescription"
                value={selectedDonation.longDescription}
                onChange={(e) =>
                  setSelectedDonation({
                    ...selectedDonation,
                    longDescription: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AllDonations;
