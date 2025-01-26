import React, { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useTable, useSortBy, usePagination } from "react-table";

const MyAddedPets = () => {
  const [petsData, setPetsData] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosSecure.get("/my-added-pets");
        setPetsData(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [axiosSecure]);

  const TABLE_HEAD = ["Serial No.", "Pet Name", "Category", "Image", "Adoption Status", "Actions"];

  const handleAdopt = async (petId) => {
    try {
      await axiosSecure.patch(`/adopt-pet/${petId}`);
      setPetsData((prevPets) =>
        prevPets.map((pet) =>
          pet._id === petId ? { ...pet, adopted: true } : pet
        )
      );
    } catch (error) {
      console.error("Error adopting pet:", error);
    }
  };

  const handleDelete = async (petId) => {
    try {
      await axiosSecure.delete(`/delete-pet/${petId}`);
      setPetsData((prevPets) => prevPets.filter((pet) => pet._id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
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
      {
        Header: "Pet Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => <img src={value} alt="pet" className="w-14 h-14 rounded-full object-cover" />,
      },
      {
        Header: "Adoption Status",
        accessor: "adopted",
        Cell: ({ value }) => (value ? "Adopted" : "Not Adopted"),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              size="sm"
              color="green"
              onClick={() => handleAdopt(row.original._id)}
            >
              Adopted
            </Button>
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
    setPageSize,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
  } = useTable(
    {
      columns,
      data: petsData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="p-6">
      <Card className="h-full w-full overflow-scroll">
        <table {...getTableProps()} className="w-full min-w-max table-auto text-left">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id || index}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="p-4 border-b border-blue-gray-50" key={cell.column.id}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {cell.render("Cell")}
                      </Typography>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <Button onClick={previousPage} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={nextPage} disabled={!canNextPage}>
            Next
          </Button>
          <div>
            Page {pageIndex + 1} of {Math.ceil(petsData.length / pageSize)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MyAddedPets;
