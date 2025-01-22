const AboutUs = () => {
    return (
      <section className="my-16 bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
            About Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-4xl mx-auto mb-8">
            Welcome to our Pet Adoption Platform! We aim to connect loving families with pets in need. 
            Here, you can explore a variety of pets, learn about their stories, and adopt a furry friend 
            to bring joy to your life. Our mission is to ensure that every pet finds a caring home.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                How It Works
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse through our collection of pets and choose the one that touches your heart. 
                Once you find your perfect companion, follow our simple adoption process and give them a loving home.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Our Purpose
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This platform was created to bridge the gap between pets in shelters and people looking for a loyal friend. 
                Together, we can give these animals a second chance at life and happiness.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutUs;
  