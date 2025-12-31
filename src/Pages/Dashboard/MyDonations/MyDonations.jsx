import { useEffect, useState } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

/* ---------- Custom Skeleton Row ---------- */
const SkeletonRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </td>
      <td className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </td>
      <td className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </td>
      <td className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-8 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </td>
    </tr>
  );
};

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axiosSecure.get(`/donations/${user.email}`);
        const donationData = response.data;

        const userDonations = donationData.filter((donation) =>
          donation.donations.some(
            (item) => item.userEmail === user.email
          )
        );

        setDonations(userDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user.email, axiosSecure]);

  const handleRefund = async (donationId, donationDate) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to request a refund.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, continue!",
      });

      if (result.isConfirmed) {
        const response = await axiosSecure.delete(
          `/donations/${donationId}/${donationDate}`
        );
        if (response.status === 200) {
          setDonations((prev) =>
            prev.map((donation) => {
              if (donation._id === donationId) {
                donation.donations = donation.donations.filter(
                  (item) => item.donationDate !== donationDate
                );
              }
              return donation;
            })
          );

          Swal.fire("Deleted!", "Your donation has been deleted.", "success");
        }
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Pet Adoption | My Donations</title>
      </Helmet>

      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        My Donations
      </h2>

      <Card className="h-full w-full overflow-scroll bg-white dark:bg-gray-800 shadow-lg min-h-screen">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="p-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                Pet Image
              </th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                Pet Name
              </th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                Donated Amount
              </th>
              <th className="p-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                Refund
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : donations.length > 0 ? (
              donations.map((donation) =>
                donation.donations.map((item) =>
                  item.userEmail === user.email ? (
                    <tr
                      key={item.donationDate}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <img
                          src={donation.petPicture}
                          alt="Pet"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                        {donation.petName}
                      </td>
                      <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                        ${item.donationAmount}
                      </td>
                      <td className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <Button
                          onClick={() =>
                            handleRefund(donation._id, item.donationDate)
                          }
                          color="red"
                          size="sm"
                        >
                          Ask for Refund
                        </Button>
                      </td>
                    </tr>
                  ) : null
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default MyDonations;
