
import { Outlet } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';
import Navbar from './../Shared/Navbar/Navbar';
const Main = () => {
    return (
        <div className='flex flex-col w-full min-h-screen'>
            <Navbar/>
            <div className='flex-grow'>
            <Outlet></Outlet>
            </div>
            <Footer/>
        </div>
    );
};

export default Main;