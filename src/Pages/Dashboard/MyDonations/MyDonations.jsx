import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axiosSecure.get(`/donations/${user.email}`);
        const donationData = response.data;
        const userDonations = donationData.filter((donation) => {
          return donation.donations.some(
            (donationItem) => donationItem.userEmail === user.email
          );
        });
        
        setDonations(userDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [user.email]);

  const handleRefund = async (donationId, donationDate) => {
    try {
        const donationItem = donations.find(donation => donation._id === donationId)
            ?.donations.find(donation => donation.donationDate === donationDate);

        if (!donationItem) {
            console.error("Donation item not found");
            return;
        }

        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to delete this donation. Do you want to continue?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          const response = await axiosSecure.delete(`/donations/${donationId}/${donationDate}`);
          if (response.status === 200) {
            setDonations(donations.map((donation) => {
                if (donation._id === donationId) {
                    donation.donations = donation.donations.filter(item => item.donationDate !== donationDate);
                }
                return donation;
            }));

            Swal.fire("Deleted!", "Your donation has been deleted.", "success");
          }
        }
    } catch (error) {
        console.error("Error processing refund:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Donations</h2>
      
      <table className="table-auto w-full text-left bg-white shadow-md rounded-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Pet Image</th>
            <th className="py-2 px-4 border-b">Pet Name</th>
            <th className="py-2 px-4 border-b">Donated Amount</th>
            <th className="py-2 px-4 border-b">Refund</th>
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              donation.donations.map((donationItem) => {
                if (donationItem.userEmail === user.email) {
                  return (
                    <tr key={donation._id}>
                      <td className="py-2 px-4 border-b">
                        <img src={donation.petPicture} alt="Pet" className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="py-2 px-4 border-b">{donation.petName}</td>
                      <td className="py-2 px-4 border-b">{donationItem.donationAmount}</td>
                      <td className="py-2 px-4 border-b">
                        <Button
                          onClick={() => handleRefund(donation._id, donationItem.donationDate)}
                          color="red"
                          size="sm"
                        >
                          Ask for Refund
                        </Button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                No donations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyDonations;
