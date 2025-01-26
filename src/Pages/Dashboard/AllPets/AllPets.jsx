import { Card, Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllPets = () => {
    const axiosSecure = useAxiosSecure();

    const { data: pets, isLoading, error } = useQuery({
        queryKey: ["pets"],
        queryFn: async () => {
            const response = await axiosSecure.get("/admin/pets");
            return response.data;
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading pets: {error.message}</div>;

    return (
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
                                Status
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
                    {pets.map(({ _id, name, adopted }, index) => {
                        const isLast = index === pets.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={_id}>
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
                                        className="font-medium"
                                    >
                                        Update
                                    </Typography>
                                    <Typography
                                        as="button"
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium ml-2"
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
