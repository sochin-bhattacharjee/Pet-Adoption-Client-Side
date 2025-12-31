import { useForm } from "react-hook-form";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet";

// CategorySelect component
const CategorySelect = ({ petCategories, setValue, register, errors }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkCheck = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    darkCheck();
    const observer = new MutationObserver(darkCheck);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      color: isDark ? "white" : "black",
      borderColor: state.isFocused ? "#2563eb" : isDark ? "#374151" : "#d1d5db",
      "&:hover": {
        borderColor: "#2563eb",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? "white" : "black",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      color: isDark ? "white" : "black",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? "#374151"
          : "#e5e7eb"
        : isDark
        ? "#1f2937"
        : "#f3f4f6",
      color: isDark ? "white" : "black",
      "&:active": {
        backgroundColor: isDark ? "#4b5563" : "#d1d5db",
      },
    }),
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Pet Category
      </label>
      <Select
        options={petCategories}
        {...register("category", { required: "Category is required" })}
        onChange={(selected) => setValue("category", selected)}
        styles={customStyles}
      />
      {errors.category && (
        <p className="text-red-500 text-sm">{errors.category.message}</p>
      )}
    </div>
  );
};

const AddPet = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const [useImageURL, setUseImageURL] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

        const imgResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=bbc6e1780f1c73f169600adaa4c05e09`,
          { method: "POST", body: formData }
        );

        const imgData = await imgResponse.json();

        if (!imgData.success) throw new Error("Image upload failed");
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
        image,
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
          timer: 1500,
        });
        navigate("/dashboard/myAddPet");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to add pet",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-500">
      <Helmet>
        <title>Pet Adoption | Add Pet</title>
      </Helmet>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 transition-colors duration-500">
        Add a Pet
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image Option */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Choose Image Upload Method
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="imageOption"
                value="file"
                checked={!useImageURL}
                onChange={() => setUseImageURL(false)}
              />
              Upload File
            </label>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
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

        {/* Image Input */}
        {!useImageURL ? (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Pet Image
            </label>
            <input
              type="file"
              {...register("image", { required: !useImageURL && "Image is required" })}
              className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="url"
              {...register("image", { required: useImageURL && "Image URL is required" })}
              className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Pet Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Pet Age
          </label>
          <input
            type="number"
            {...register("age", { required: "Age is required" })}
            className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        {/* Category */}
        <CategorySelect petCategories={petCategories} setValue={setValue} register={register} errors={errors} />

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Pet Breed
          </label>
          <input
            type="text"
            {...register("breed", { required: "Breed is required" })}
            className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {errors.breed && <p className="text-red-500 text-sm">{errors.breed.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Pet Location
          </label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Short Description
          </label>
          <textarea
            {...register("shortDescription", { required: "Short description is required" })}
            className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          ></textarea>
          {errors.shortDescription && <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>}
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Long Description
          </label>
          <ReactQuill
            theme="snow"
            onChange={(value) => setValue("longDescription", value)}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
          {errors.longDescription && <p className="text-red-500 text-sm">{errors.longDescription.message}</p>}
        </div>

        <style jsx global>{`
          .dark .ql-toolbar.ql-snow {
            background-color: #1f2937;
            border-color: #374151;
          }
          .dark .ql-toolbar.ql-snow .ql-stroke,
          .dark .ql-toolbar.ql-snow .ql-fill,
          .dark .ql-toolbar.ql-snow .ql-picker {
            color: white;
          }
          .dark .ql-container.ql-snow,
          .dark .ql-container.ql-snow .ql-editor {
            background-color: #1f2937;
            color: white;
          }
        `}</style>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPet;
