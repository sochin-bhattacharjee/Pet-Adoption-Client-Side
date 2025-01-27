import { useForm } from "react-hook-form";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet";

const AddPet = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const [useImageURL, setUseImageURL] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuth();

  const petCategories = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Fish", label: "Fish" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Cow", label: "Cow" },
    { value: "Bird", label: "Bird" },
  ];

  const onSubmit = async (data) => {
    try {
      let image = "";

      if (useImageURL) {
        image = data.image;
      } else {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        console.log("FormData:", formData);

        const imgResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=bbc6e1780f1c73f169600adaa4c05e09`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imgData = await imgResponse.json();

        if (!imgData.success) {
          throw new Error("Image upload failed");
        }
        image = imgData.data.url;
      }

      const petData = {
        name: data.name,
        age: data.age,
        category: data.category.value,
        breed: data.breed,
        location: data.location,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        image: image,
        adopted: false,
        addedBy: user.email,
        dateAdded: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/pets", petData);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Pet added successfully!",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/dashboard/myAddPet');
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to add pet",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Helmet>
        <title>
          Pet Adoption | Add Pet
        </title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-6">Add a Pet</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Choose Image Upload Method</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageOption"
                value="file"
                checked={!useImageURL}
                onChange={() => setUseImageURL(false)}
              />
              Upload File
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageOption"
                value="url"
                checked={useImageURL}
                onChange={() => setUseImageURL(true)}
              />
              Use Image URL
            </label>
          </div>
        </div>

        {!useImageURL ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pet Image</label>
            <input
              type="file"
              {...register("image", { required: !useImageURL && "Image is required" })}
              className="block w-full border rounded-lg p-2"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              {...register("image", { required: useImageURL && "Image URL is required" })}
              className="block w-full border rounded-lg p-2"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Pet Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="block w-full border rounded-lg p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Pet Age</label>
          <input
            type="number"
            {...register("age", { required: "Age is required" })}
            className="block w-full border rounded-lg p-2"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Pet Category</label>
          <Select
            options={petCategories}
            {...register("category", { required: "Category is required" })}
            onChange={(selected) => setValue("category", selected)}
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Pet Breed</label>
          <input
            type="text"
            {...register("breed", { required: "Breed is required" })}
            className="block w-full border rounded-lg p-2"
          />
          {errors.breed && <p className="text-red-500 text-sm">{errors.breed.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Pet Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="block w-full border rounded-lg p-2"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Short Description</label>
          <textarea
            {...register("shortDescription", { required: "Short description is required" })}
            className="block w-full border rounded-lg p-2"
          ></textarea>
          {errors.shortDescription && <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Long Description</label>
          <ReactQuill
            theme="snow"
            onChange={(value) => setValue("longDescription", value)}
          />
          {errors.longDescription && <p className="text-red-500 text-sm">{errors.longDescription.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPet;
