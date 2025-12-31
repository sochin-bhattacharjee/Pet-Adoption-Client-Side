import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Card, Typography } from "@material-tailwind/react";
import Modal from "react-modal";
import { Helmet } from "react-helmet";

/* Skeleton */
const DonationSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-14 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
};

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  /* Fetch */
  const {
    data: donations = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/donations");
      return res.data.donations;
    },
  });

  /* Pause / Unpause */
  const pauseMutation = useMutation({
    mutationFn: async ({ id, paused }) => {
      await axiosSecure.patch(`/api/donations/${id}/pause`, {
        paused: !paused,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["donations"]);
      Swal.fire({
        icon: "success",
        title: `Donation ${
          variables.paused ? "Unpaused" : "Paused"
        } successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  /* Delete */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/api/donations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["donations"]);
      Swal.fire("Deleted!", "Donation deleted.", "success");
    },
  });

  /* Update */
  const updateMutation = useMutation({
    mutationFn: async (updatedDonation) => {
      await axiosSecure.put(
        `/api/donations/${updatedDonation._id}`,
        updatedDonation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["donations"]);
      setModalIsOpen(false);
      Swal.fire("Updated!", "Donation updated.", "success");
    },
  });

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setModalIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(selectedDonation);
  };

  if (error)
    return (
      <p className="text-red-500 text-center">
        Failed to load donations
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>Pet Adoption | All Donations</title>
      </Helmet>

      <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
        All Donation Campaigns
      </h2>

      {/* DESKTOP TABLE */}
      <Card className="hidden md:block dark:bg-gray-800 overflow-x-auto p-4">
        {isLoading ? (
          <DonationSkeleton />
        ) : (
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              {["Pet", "Max", "Last Date", "Status", "Actions"].map(
                (h) => (
                  <th key={h} className="p-3">
                    <Typography className="font-semibold dark:text-gray-200">
                      {h}
                    </Typography>
                  </th>
                )
              )}
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr
                  key={d._id}
                  className="border-b dark:border-gray-700"
                >
                  <td className="p-3 dark:text-gray-300">
                    {d.petName}
                  </td>
                  <td className="p-3 dark:text-gray-300">
                    ${d.maxDonationAmount}
                  </td>
                  <td className="p-3 dark:text-gray-300">
                    {d.lastDate}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        d.paused
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {d.paused ? "Paused" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        pauseMutation.mutate({
                          id: d._id,
                          paused: d.paused,
                        })
                      }
                      className={`px-3 py-1 rounded text-white ${
                        d.paused
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {d.paused ? "Unpause" : "Pause"}
                    </button>
                    <button
                      onClick={() => handleEdit(d)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        deleteMutation.mutate(d._id)
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <DonationSkeleton rows={3} />
        ) : (
          donations.map((d) => (
            <div
              key={d._id}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow"
            >
              <p className="font-semibold dark:text-white">
                {d.petName}
              </p>
              <p className="dark:text-gray-300">
                Max: ${d.maxDonationAmount}
              </p>
              <p className="dark:text-gray-300">
                Last Date: {d.lastDate}
              </p>
              <p
                className={`font-semibold ${
                  d.paused
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {d.paused ? "Paused" : "Active"}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                      onClick={() =>
                        pauseMutation.mutate({
                          id: d._id,
                          paused: d.paused,
                        })
                      }
                      className={`px-3 py-1 rounded text-white ${
                        d.paused
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {d.paused ? "Unpause" : "Pause"}
                    </button>
                <button
                  onClick={() => handleEdit(d)}
                  className="flex-1 bg-blue-600 text-white rounded py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteMutation.mutate(d._id)
                  }
                  className="flex-1 bg-red-600 text-white rounded py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedDonation && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6"
          overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
          ariaHideApp={false}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold dark:text-white">
              Edit Donation
            </h3>

            {["petName", "maxDonationAmount", "shortDescription", "longDescription"].map(
              (field) => (
                <input
                  key={field}
                  value={selectedDonation[field]}
                  onChange={(e) =>
                    setSelectedDonation({
                      ...selectedDonation,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                />
              )
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
