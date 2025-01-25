import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from './../Pages/Login/Login';
import SignUp from './../Pages/SignUp/SignUp';
import Home from './../Pages/Home/Home';
import Error from "../Error/Error";
import PetListing from "../Pages/PetListing/PetListing";
import PetDetails from "../Components/PetDetails/PetDetails";
import PrivateRoutes from "./Private Routes/PrivateRoutes";
import Dashboard from "../Layout/Dashboard";
import AddPet from './../Pages/Dashboard/AddPet/AddPet';
import MyAddedPets from './../Pages/Dashboard/MyAddedPets/MyAddedPets';
import AdoptionRequest from './../Pages/Dashboard/AdoptionRequest/AdoptionRequest';
import CreateDonations from './../Pages/Dashboard/CreateDonations/CreateDonations';
import MyDonationsCampaign from './../Pages/Dashboard/MyDonationsCampaign/MyDonationsCampaign';
import MyDonations from './../Pages/Dashboard/MyDonations/MyDonations';
import AllDonations from "../Pages/Dashboard/AllDonations/AllDonations";
import AllUser from './../Pages/Dashboard/AllUser/AllUser';
import AllPets from "../Pages/Dashboard/AllPets/AllPets";

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
        path:"/dashboard",
        element:<PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
        children:[
            {
                path:"addPet",
                element:<AddPet></AddPet>
            },
            {
                path:"myAddPet",
                element:<MyAddedPets></MyAddedPets>
            },
            {
                path:"adoptionRequest",
                element:<AdoptionRequest></AdoptionRequest>
            },
            {
                path:"createDonationsCampaign",
                element:<CreateDonations></CreateDonations>
            },
            {
                path:"myDonationsCampaign",
                element:<MyDonationsCampaign></MyDonationsCampaign>
            },
            {
                path:"myDonations",
                element:<MyDonations></MyDonations>
            },
            {
                path:"allUser",
                element:<AllUser></AllUser>
            },
            {
                path:"allPets",
                element:<AllPets></AllPets>
            },
            {
                path:"allDonations",
                element:<AllDonations></AllDonations>
            },
        ]
    },
    {
        path:"*",
        element:<Error></Error>
    }
]);