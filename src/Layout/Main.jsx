
import { Outlet } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';
import SharedNavbar from '../Shared/Navbar/SharedNavbar';

const Main = () => {
    return (
        <div className='flex flex-col w-full min-h-screen'>
            <SharedNavbar/>
            <div className='min-h-screen'>
            <Outlet></Outlet>
            </div>
            <Footer/>
        </div>
    );
};

export default Main;