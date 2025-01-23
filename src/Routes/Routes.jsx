import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from './../Pages/Login/Login';
import SignUp from './../Pages/SignUp/SignUp';
import Home from './../Pages/Home/Home';
import Error from "../Error/Error";
import PetListing from "../Pages/PetListing/PetListing";
import PetDetails from "../Components/PetDetails/PetDetails";
import PrivateRoutes from "./Private Routes/PrivateRoutes";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>,
        children:[
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/petListing',
                element: <PetListing></PetListing>
            },
            {
                path: '/pet/:id',
                element: <PrivateRoutes><PetDetails></PetDetails></PrivateRoutes>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/signUp',
                element: <SignUp></SignUp>
            }
        ]
    },
    {
        path:"*",
        element:<Error></Error>
    }
]);