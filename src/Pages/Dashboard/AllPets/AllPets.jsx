import { Card, Typography } from "@material-tailwind/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

/* Skeleton Component */
const PetsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-14 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
};

const AllPets = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: pets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/pets");
      return res.data;
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId) => {
      await axiosSecure.delete(`/admin/pets/${petId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      Swal.fire("Deleted!", "Pet deleted successfully.", "success");
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async ({ petId, updatedData }) => {
      await axiosSecure.put(`/admin/pets/${petId}`, updatedData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["pets"]);
      const statusText = variables.updatedData.adopted
    ? "as Adopted"
    : "as Not Adopted";

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${variables.petName} ${statusText}`,
      });
    },
  });

  const handleUpdate = (id, adopted, name) => {
    updatePetMutation.mutate({
      petId: id,
      updatedData: { adopted: !adopted },
      petName: name,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This pet will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePetMutation.mutate(id);
      }
    });
  };

  if (error) {
    return <p className="text-red-500">Failed to load pets</p>;
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Pet Adoption | All Pets</title>
      </Helmet>

      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
        All Pets
      </h2>

      <Card className="p-4 bg-white dark:bg-gray-900 shadow-md">
        {/* Skeleton */}
        {isLoading && <PetsSkeleton />}

        {/* Desktop Table */}
        {!isLoading && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  {["No", "Pet Name", "Status", "Update", "Delete"].map(
                    (head) => (
                      <th key={head} className="p-3">
                        <Typography className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {head}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pets.map(({ _id, name, adopted }, index) => (
                  <tr key={_id} className="border-b dark:border-gray-700">
                    <td className="p-3 dark:text-slate-300">{index + 1}</td>
                    <td className="p-3 dark:text-slate-300">{name}</td>
                    <td className="p-3 ">
                      {adopted ? (
                        <div className="text-green-600">Adopted</div>
                      ) : (
                        <div className="text-yellow-500 dark:text-yellow-600">
                          Not Adopted
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleUpdate(_id, adopted, name)}
                        className="px-3 py-1 border border-green-600 rounded text-green-600 hover:bg-green-600 hover:text-white transition"
                      >
                        Update
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(_id)}
                        className="px-3 py-1 border border-red-600 rounded text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards*/}
        {!isLoading && (
          <div className="md:hidden space-y-4">
            {pets.map(({ _id, name, adopted }, index) => (
              <div
                key={_id}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  #{index + 1}
                </p>
                <p className="font-semibold text-lg dark:text-gray-300">
                  {name}
                </p>
                <p className="text-sm mb-3 dark:text-gray-300">
                  Status:{" "}
                  <span className="font-medium">
                    {adopted ? (
                      <div className="text-green-600">Adopted</div>
                    ) : (
                      <div className="text-yellow-500 dark:text-yellow-600">
                        Not Adopted
                      </div>
                    )}
                  </span>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(_id, adopted, name)}
                    className="flex-1 border border-green-600 text-green-600 rounded py-1 hover:bg-green-600 hover:text-white"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(_id)}
                    className="flex-1 border border-red-600 text-red-600 rounded py-1 hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AllPets;
