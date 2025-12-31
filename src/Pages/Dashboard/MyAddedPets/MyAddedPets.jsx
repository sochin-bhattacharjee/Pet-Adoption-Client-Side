import React, { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useTable, useSortBy, usePagination } from "react-table";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

// Skeleton Row
const SkeletonRow = ({ columnsCount }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    {Array.from({ length: columnsCount }).map((_, index) => (
      <td
        key={index}
        className="p-4 h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
      >
        &nbsp;
      </td>
    ))}
  </tr>
);

const MyAddedPets = () => {
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosSecure.get("/my-added-pets");
        setPetsData(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [axiosSecure]);

  const handleAdopt = async (petId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this pet as adopted?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, adopt!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/adopt-pet/${petId}`);
        setPetsData((prev) =>
          prev.map((pet) =>
            pet._id === petId ? { ...pet, adopted: true } : pet
          )
        );
        Swal.fire("Success!", "Pet adoption status updated.", "success");
      } catch (error) {
        console.error("Error adopting pet:", error);
        Swal.fire("Error!", "Failed to update adoption status.", "error");
      }
    }
  };

  const handleDelete = async (petId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/delete-pet/${petId}`);
        setPetsData((prev) => prev.filter((pet) => pet._id !== petId));
        Swal.fire("Deleted!", "Pet has been deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting pet:", error);
        Swal.fire("Error!", "Failed to delete the pet.", "error");
      }
    }
  };

  const handleUpdate = (petId) => {
    window.location.href = `/dashboard/update-pet/${petId}`;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Serial No.",
        accessor: "serialNo",
        Cell: ({ row }) => row.index + 1,
      },
      { Header: "Pet Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={value}
            alt="pet"
            className="w-14 h-14 rounded-full object-cover"
          />
        ),
      },
      {
        Header: "Adoption Status",
        accessor: "adopted",
        Cell: ({ value }) => (
          <span
            className={`font-semibold ${
              value ? "text-green-600" : "text-red-600"
            }`}
          >
            {value ? "Adopted" : "Not Adopted"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex flex-row gap-2">
            {!row.original.adopted && (
              <Button
                size="sm"
                color="green"
                onClick={() => handleAdopt(row.original._id)}
              >
                Adopt
              </Button>
            )}
            <Button
              size="sm"
              color="yellow"
              onClick={() => handleUpdate(row.original._id)}
            >
              Update
            </Button>
            <Button
              size="sm"
              color="red"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [petsData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
  } = useTable(
    { columns, data: petsData, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Pet Adoption | My Added Pets</title>
      </Helmet>

      <Typography
        variant="h4"
        className="text-center font-bold mb-6 text-gray-900 dark:text-gray-100"
      >
        My Added Pets
      </Typography>

      <Card className="w-full overflow-x-auto shadow-lg dark:shadow-gray-700">
        <table
          {...getTableProps()}
          className="w-full min-w-[600px] table-auto text-left"
        >
          <thead className="bg-gray-200 dark:bg-gray-800 dark:text-slate-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-300 dark:border-gray-700 p-4 text-left"
                    key={column.id}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {column.render("Header")}
                    </Typography>
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} columnsCount={columns.length} />
                ))
              : rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id || index}
                      className="border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="p-4 dark:text-gray-200"
                          key={cell.column.id}
                        >
                          <Typography variant="small" className="font-normal">
                            {cell.render("Cell")}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default MyAddedPets;
