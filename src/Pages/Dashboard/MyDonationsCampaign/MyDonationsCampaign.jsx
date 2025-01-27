import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Button, Modal, Progress } from '@material-tailwind/react';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const MyDonationsCampaign = () => {
    const axiosSecure = useAxiosSecure();
    const [showDonators, setShowDonators] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const {user} = useAuth();

    const { data: donations, isLoading, error } = useQuery({
    queryKey: ["donations", user?.email],
    queryFn: async () => {
        const response = await axiosSecure.get(`/campaigns?email=${user?.email}`);
        return response.data;
    },
    enabled: !!user?.email,
});

    const handlePause = async (donationId) => {
        try {
            await axiosSecure.patch(`/api/donations/${donationId}/pause`);
        } catch (error) {
            console.error("Error pausing the donation:", error);
        }
    };

    const handleViewDonators = (donation) => {
        setSelectedDonation(donation);
        setShowDonators(true);
    };

    const closeModal = () => {
        setShowDonators(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching donations.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">My Donations Campaign</h2>
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border p-2">Pet Name</th>
                        <th className="border p-2">Max Donation Amount</th>
                        <th className="border p-2">Donation Progress</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map(donation => (
                        <tr key={donation._id}>
                            <td className="border p-2">{donation.petName}</td>
                            <td className="border p-2">{donation.maxDonationAmount}</td>
                            <td className="border p-2 w-[50%] ">
                                <Progress className='bg-green-500 h-2 rounded-full w-[50%]' value={(donation.currentDonation / donation.maxDonationAmount) * 100} />
                            </td>
                            <td className="border p-2">
                                <Button onClick={() => handlePause(donation._id)} color={donation.paused ? 'red' : 'green'}>
                                    {donation.paused ? 'Unpause' : 'Pause'}
                                </Button>
                                <Button onClick={() => handleViewDonators(donation)} color="blue" className="ml-2">
                                    View Donators
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDonators && (
                <Modal open={showDonators} onClose={closeModal}>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Donators for {selectedDonation.petName}</h3>
                        <ul>
                            {selectedDonation.donators.map(donator => (
                                <li key={donator.userId._id} className="mb-2">
                                    {donator.userId.name} - ${donator.donationAmount}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={closeModal} color="gray" className="mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyDonationsCampaign;
