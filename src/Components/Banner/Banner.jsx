import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay } from 'swiper/modules';
import BannerImg1 from "../../assets/Banner/4151145.jpg"
import BannerImg2 from "../../assets/Banner/5287874.jpg"
import BannerImg3 from "../../assets/Banner/5649255.jpg"
import BannerImg4 from "../../assets/Banner/8982424.jpg"

const Banner = () => {
    return (
        <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
        modules={[Pagination, Autoplay]}
      className="mySwiper h-[250px] md:h-[330px] lg:h-[550px] xl:h-[600px] w-full mt-1"
      >
        <SwiperSlide className='h-full'><img src={BannerImg1} className='h-full w-full object-cover' alt="" /></SwiperSlide>
        <SwiperSlide className='h-full'><img className='h-full w-full object-cover' src={BannerImg2} alt="" /></SwiperSlide>
        <SwiperSlide className='h-full'><img className='h-full w-full object-cover' src={BannerImg3} alt="" /></SwiperSlide>
        <SwiperSlide className='h-full'><img className='h-full w-full object-cover' src={BannerImg4} alt="" /></SwiperSlide>
      </Swiper>
    );
};

export default Banner;