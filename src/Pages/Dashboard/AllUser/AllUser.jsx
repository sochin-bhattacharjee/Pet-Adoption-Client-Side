import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Button, Card, Typography } from "@material-tailwind/react";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
const AllUser = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch , data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleDelete = (user) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            axiosSecure.delete(`/users/${user._id}`)
            .then(res => {
                if(res.data.deletedCount > 0){
                    refetch();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                      });
                }
            })
        }
      });
  };

  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to make ${user.name} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make admin!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/admin/${user._id}`)
          .then(res => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${user.name} is an Admin Now!`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch(err => {
            console.error("Error making admin:", err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          });
      }
    });
  };
  
  return (
    <div>
      <Helmet>
        <title>
          Pet Adoption | All User
        </title>
      </Helmet>
      <div className="flex justify-between items-center sm:my-8">
        <h2 className="text-xl font-semibold">All User</h2>
        <h2 className="text-xl font-semibold">Total User : {users.length}</h2>
      </div>
      <Card className="h-full w-full overflow-scroll mt-5">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  No
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Name
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Email
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Role
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                ></Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {
                users.map((user, index) => (
                    <tr key={user._id}>
                        <td className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {index + 1}
                            </Typography>
                        </td>
                        <td className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {user.name}
                            </Typography>
                        </td>
                        <td className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {user.email}
                            </Typography>
                        </td>
                        <td className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold text-center"
                            >
                                {
                                    user.role === 'admin' ? 'Admin' : <Button onClick={() => handleMakeAdmin(user)} className="font-normal px-2 py-1">Make Admin</Button>
                                }
                            </Typography>
                        </td>
                        <td className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"    
                                className="font-normal"
                            >
                                <button onClick={() => handleDelete(user)} className="text-red-600 bg-red-200 text-lg p-1 rounded-full"><MdDeleteForever /></button>
                            </Typography>
                        </td>
                    </tr>            
                ))
            }
            </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AllUser;
