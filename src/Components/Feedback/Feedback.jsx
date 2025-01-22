import { Button } from "@material-tailwind/react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

const Feedback = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const feedback = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value,
      rating,
    };

    if (!feedback.name || !feedback.email || !feedback.message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields!",
      });
      return;
    }

    // Simulate submission (API call logic should go here)
    console.log("Feedback submitted:", feedback);

    Swal.fire({
      icon: "success",
      title: "Thank you!",
      text: "Your feedback has been submitted successfully.",
      showConfirmButton: false,
      timer: 2000,
    });

    e.target.reset();
    setRating(0);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 mt-12 md:mt-16">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        We Value Your Feedback
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-11/12 md:max-w-lg lg:max-w-2xl xl:max-w-4xl bg-opacity-90 rounded-lg shadow-lg p-6 lg:p-8 dark:bg-gray-900"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-800 dark:text-white">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-2 rounded-md border focus:outline-none bg-gray-50 text-black border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800 dark:text-white">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 rounded-md border focus:outline-none bg-gray-50 text-black border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-800 dark:text-white">
            Your Feedback
          </label>
          <textarea
            id="message"
            ref={messageRef}
            placeholder="Write your feedback here"
            rows="5"
            required
            className="w-full px-4 py-2 rounded-md border focus:outline-none bg-gray-50 text-black border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-white">Rating</label>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className={`text-2xl ${
                  rating >= index + 1 ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-2 dark:bg-gray-300 dark:text-black font-bold rounded-md transition-all duration-300 ease-in-out"
        >
          Submit Feedback
        </Button>
      </form>
    </div>
  );
};

export default Feedback;
