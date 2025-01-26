import { Card, Typography } from "@material-tailwind/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllPets = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: pets, isLoading, error } = useQuery({
        queryKey: ["pets"],
        queryFn: async () => {
            const response = await axiosSecure.get("/admin/pets");
            return response.data;
        }
    });

    const deletePetMutation = useMutation({
        mutationFn: async (petId) => {
            await axiosSecure.delete(`/admin/pets/${petId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["pets"]);
            Swal.fire({
                title: 'Deleted!',
                text: 'Pet has been deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });

    const updatePetMutation = useMutation({
        mutationFn: async ({ petId, updatedData }) => {
            await axiosSecure.put(`/admin/pets/${petId}`, updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["pets"]);
            Swal.fire({
                title: 'Success!',
                text: 'Pet status has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });

    const handleUpdate = (petId, adoptedStatus) => {
        const updatedData = { adopted: !adoptedStatus };
        updatePetMutation.mutate({ petId, updatedData });
    };

    const handleDelete = (petId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this pet?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                deletePetMutation.mutate(petId);
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading pets: {error.message}</div>;

    return (
        <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                No
                            </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                Pet Name
                            </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                Status
                            </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                Update status
                            </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                Delete pet
                            </Typography>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map(({ _id, name, adopted }, index) => {
                        const isLast = index === pets.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={_id}>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {index+1}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {name}
                                    </Typography>
                                </td>
                                
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {adopted ? "Adopted" : "Not Adopted"}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        as="button"
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium border-2 border-green-600 px-2 py-1 rounded hover:bg-green-600 hover:text-white"
                                        onClick={() => handleUpdate(_id, adopted)}
                                    >
                                        Update
                                    </Typography>
                                </td>
                                <td className={classes}>
                                <Typography
                                        as="button"
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium ml-2 border-2 border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white"
                                        onClick={() => handleDelete(_id)}
                                    >
                                        Delete
                                    </Typography>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Card>
    );
};

export default AllPets;
