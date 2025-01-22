import { Button } from "@material-tailwind/react";
import img from "../../assets/Banner/inspirational.jpg";

const Inspirational = () => {
  return (
    <section className="relative my-16">
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt="Inspirational Banner"
          className="w-full h-64 sm:h-96 xl:h-[450px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl xl:text-5xl font-bold text-white mb-4 xl:mb-6">
              Give Them a Home, Give Them Love ❤️
            </h2>
            <p className="text-sm sm:text-lg xl:text-xl text-gray-200 mb-6 xl:mb-8">
              Every pet deserves a safe and loving home. By adopting, you're not
              just saving a life—you're gaining a friend for life. Start your
              journey today and make a difference!
            </p>
            <Button
              className=" text-white dark:bg-white dark:text-black font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
            >
              Adopt a Pet Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inspirational;
