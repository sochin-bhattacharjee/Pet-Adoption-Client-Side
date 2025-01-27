import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaFacebook } from "react-icons/fa"; // Facebook icon import kora
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const FacebookLogin = () => {
  const { signInWithFacebook } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleFacebookSignIn = () => {
    signInWithFacebook()
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Login successful! Welcome",
          showConfirmButton: false,
          timer: 1500,
        });
        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
        };

        // Facebook login er por user data ke database e save kora
        axiosPublic
          .post("/users", userInfo)
          .then((res) => {
            if (res.data.insertedId) {
              console.log("User created successfully");
            }
            navigate("/"); // Redirect to home or dashboard
          })
          .catch((err) => console.error("Error saving user data:", err));
      })
      .catch((error) => {
        console.error("Facebook login error:", error);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Something went wrong. Please try again.",
        });
      });
  };

  return (
    <div>
      <button
        onClick={handleFacebookSignIn}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 p-3 mt-2 rounded-md font-bold text-lg text-white"
      >
        <FaFacebook />
        Facebook Login
      </button>
    </div>
  );
};

export default FacebookLogin;
