import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Button, Modal, Progress, Card, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const MyDonationsCampaign = () => {
    const axiosSecure = useAxiosSecure();
    const [showDonators, setShowDonators] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const { user } = useAuth();

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
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error fetching donations.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">My Donations Campaign</h2>

            <Card className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Pet Name
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Max Donation Amount
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Donation Progress
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Donation total Amount
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Actions
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation => {
                            const progress = (donation.totalDonatedAmount / donation.maxDonationAmount) * 100;
                            const progressPercentage = isNaN(progress) ? 0 : progress > 100 ? 100 : progress;
                            const formattedAmount = isNaN(donation.totalDonatedAmount) ? 0 : donation.totalDonatedAmount;

                            return (
                                <tr key={donation._id}>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {donation.petName}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            ${donation.maxDonationAmount}
                                        </Typography>
                                    </td>

                                    <td className="p-6 border-b border-blue-gray-50 w-full flex items-center">
                                        <Progress className="bg-red-500 h-2 rounded-full w-[150px]" color='green' value={progressPercentage} />
                                        <span className="ml-2 text-sm ">{Math.round(progressPercentage)}%</span>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            ${formattedAmount}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50 flex space-x-2">
                                        <Button onClick={() => handlePause(donation._id)} color={donation.paused ? 'red' : 'green'}>
                                            {donation.paused ? 'Unpause' : 'Pause'}
                                        </Button>
                                        <Button onClick={() => handleViewDonators(donation)} color="blue">
                                            View Donators
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>

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
