import { Helmet } from "react-helmet";
import useAdmin from "../../../hooks/useAdmin";
import useAuth from "../../../hooks/useAuth";

const Welcome = () => {
  const [isAdmin] = useAdmin();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      <Helmet>
        <title>Pet Adoption | Welcome</title>
      </Helmet>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg text-center transition-colors duration-500">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-500">
          Welcome, {user?.displayName || "Guest"}!
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-500">
          You are logged in as a{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {isAdmin ? "Admin" : "User"}
          </span>
          .
        </p>

        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-gray-600 transition-colors duration-500">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-500">
            Explore <span className="text-blue-600 dark:text-blue-400">Pet Adoption</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-500">
            Find your perfect furry friend and give them a loving home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
