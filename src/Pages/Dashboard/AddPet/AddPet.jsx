import { useForm } from "react-hook-form";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";

const AddPet = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const [useImageURL, setUseImageURL] = useState(false);

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
      let imageUrl = "";

      if (useImageURL) {
        imageUrl = data.imageUrl;
      } else {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imgResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imgData = await imgResponse.json();

        if (!imgData.success) {
          throw new Error("Image upload failed");
        }
        imageUrl = imgData.data.url;
      }

      const petData = {
        name: data.name,
        age: data.age,
        category: data.category.value,
        location: data.location,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        imageUrl: imageUrl,
        adopted: false,
        createdAt: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/pets", petData);
      if (response.status === 201) {
        alert("Pet added successfully!");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
              {...register("imageUrl", { required: useImageURL && "Image URL is required" })}
              className="block w-full border rounded-lg p-2"
            />
            {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
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
