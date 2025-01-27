import { Helmet } from "react-helmet";
import useAdmin from "../../../hooks/useAdmin";
import useAuth from "../../../hooks/useAuth";

const Welcome = () => {
  const [isAdmin] = useAdmin();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-4">
      <Helmet>
        <title>
          Pet Adoption | Welcome
        </title>
      </Helmet>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.displayName || "Guest"}!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          You are logged in as a{" "}
          <span className="font-semibold text-blue-600">
            {isAdmin ? "Admin" : "User"}
          </span>
          .
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Explore <span className="text-blue-600">Pet Adoption</span>
          </h2>
          <p className="text-sm text-gray-500">
          Find your perfect furry friend and give them a loving home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
