import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaGoogle } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const GoogleLogin = () => {
    const {signInWithGoogle} = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const handleGoogleSignIn = () => {
        signInWithGoogle()
        .then(result => {
            alert(result ,"logged in");
            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
            };
            axiosPublic.post("/users", userInfo)
            .then((res) => {
                if (res.data.insertedId) {
                    console.log("User inserted successfully");
                }
                navigate("/");
            })
        })
    }
    return (
        <div>
            <div>
                <button onClick={handleGoogleSignIn} className='w-full flex items-center justify-center gap-3 bg-gray-300 p-3 mt-2 rounded-md font-bold text-lg'><FaGoogle></FaGoogle>Google</button>
            </div>
        </div>
    );
};

export default GoogleLogin;