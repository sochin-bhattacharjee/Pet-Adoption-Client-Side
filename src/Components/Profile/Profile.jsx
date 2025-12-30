import { Button } from "@material-tailwind/react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-4">Profile</h1>
        
        <div className="flex justify-center mb-6">
          <img
            src={user.photoURL}
            alt="User Profile"
            className="w-32 h-32 rounded-lg border-4 border-blue-500"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
            <strong>Name:</strong> {user.displayName}
          </h2>
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
            <strong>Email:</strong> {user.email}
          </h2>
        </div>
        <Link to="/"><Button className="w-full mt-4 dark:bg-gray-100 dark:text-black">Back to Home</Button></Link>
      </div>
    </div>
  );
};

export default Profile;
