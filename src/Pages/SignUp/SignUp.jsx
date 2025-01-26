import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import GoogleLogin from "../../Components/GoogleLogin/GoogleLogin";
import { Helmet } from "react-helmet";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    try {
      await createUser(data.email, data.password);
      await updateUserProfile(data.name, data.photoUrl);
      const userInfo = {
        name: data.name,
        email: data.email,
      };
      await axiosPublic.post("/users", userInfo).then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Sign up successful! Welcome",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Sign up failed",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="flex mt-10 justify-center">
      <Helmet>
        <title>Pet Adoption | SignUp</title>
      </Helmet>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is required",
              })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Photo URL
            </label>
            <input
              type="text"
              id="photoUrl"
              {...register("photoUrl", {
                required: "Photo URL is required",
              })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.photoUrl ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.photoUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.photoUrl.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character",
                },
              })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 top-7 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <GoogleLogin />

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
