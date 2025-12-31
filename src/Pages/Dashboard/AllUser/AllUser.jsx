import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Button, Card, Typography } from "@material-tailwind/react";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

{/* Skeleton Component */}
const UserSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
};

const AllUser = () => {
  const axiosSecure = useAxiosSecure();

  const {
    refetch,
    data: users = [],
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  {/* Delete User */}
  const handleDelete = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "User has been deleted.", "success");
          }
        });
      }
    });
  };

  {/* Make Admin */}
  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `${user.name} will be an Admin`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              icon: "success",
              title: `${user.name} is now Admin`,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  };

  return (
    <div className="w-full p-4">
      <Helmet>
        <title>Pet Adoption | All Users</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 my-6">
        <h2 className="text-xl font-semibold dark:text-white">
          All Users
        </h2>
        <h2 className="text-xl font-semibold dark:text-white">
          Total: {users.length}
        </h2>
      </div>

      {/* DESKTOP TABLE */}
      <Card className="hidden md:block w-full overflow-x-auto dark:bg-gray-800">
        {isLoading ? (
          <div className="p-4">
            <UserSkeleton rows={6} />
          </div>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                {["No", "Name", "Email", "Role", "Action"].map((head) => (
                  <th key={head} className="p-4">
                    <Typography className="font-semibold dark:text-gray-200">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b dark:border-gray-700"
                >
                  <td className="p-4 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="p-4 dark:text-gray-300">
                    {user.name}
                  </td>
                  <td className="p-4 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="p-4 text-center">
                    {user.role === "admin" ? (
                      <span className="font-semibold text-green-500">
                        Admin
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleMakeAdmin(user)}
                      >
                        Make Admin
                      </Button>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 bg-red-100 dark:bg-red-900/30 p-2 rounded-full"
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <UserSkeleton rows={4} />
        ) : (
          users.map((user, index) => (
            <div
              key={user._id}
              className="p-4 rounded-lg shadow bg-white dark:bg-gray-800"
            >
              <p className="dark:text-gray-200">
                <span className="font-semibold">
                  #{index + 1}
                </span>
              </p>
              <p className="dark:text-gray-200">
                <span className="font-semibold">Name:</span>{" "}
                {user.name}
              </p>
              <p className="dark:text-gray-200">
                <span className="font-semibold">Email:</span>{" "}
                {user.email}
              </p>

              <div className="flex justify-between items-center mt-3">
                {user.role === "admin" ? (
                  <span className="text-green-500 font-semibold">
                    Admin
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleMakeAdmin(user)}
                  >
                    Make Admin
                  </Button>
                )}

                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-600 bg-red-100 dark:bg-red-900/30 p-2 rounded-full"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllUser;
