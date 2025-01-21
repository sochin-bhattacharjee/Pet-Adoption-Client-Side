import { useNavigate } from 'react-router-dom';
import errorImage from '../assets/404Img/404.gif'
const Error = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate('/');
    };

    return (
            <div>
                <img className='w-[50%] mx-auto' src={errorImage} alt="" />
                <button className='mx-auto flex items-center justify-center gap-2 bg-yellow-200 p-3 mt-2 rounded-md font-bold text-lg' onClick={handleBackHome}>Home</button>
            </div>
    );
};

export default Error;
