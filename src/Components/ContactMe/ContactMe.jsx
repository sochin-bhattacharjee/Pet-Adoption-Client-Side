import emailjs from "@emailjs/browser";
import { Button } from "@material-tailwind/react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

const ContactMe = () => {
  const form = useRef();
  const [formStatus, setFormStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_fua5mcl", "template_guqlxjz", form.current, {
        publicKey: "-16sGFbsT3EXLxerV",
      })
      .then(
        () => {
          Swal.fire({
            title: "Message Sent Successfully!",
            icon: "success",
            draggable: true,
          });
          form.current.reset();
        },
        (error) => {
          setFormStatus(`Failed to send message. Error: ${error.text}`);
        }
      );
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 transition-all duration-500 mt-12 md:mt-16 ease-in-out">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Contact Me</h1>

      <div className="w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="w-full md:w-1/2 shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Send a Message</h2>
          <form ref={form} onSubmit={sendEmail}>
            <div className="mb-4">
              <label htmlFor="user_name" className="mb-2 block text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                className="w-full px-4 py-2 rounded-md border focus:outline-none bg-gray-50 text-gray-800 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="user_email" className="mb-2 block text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="user_email"
                id="user_email"
                className="w-full px-4 py-2 rounded-md border focus:outline-none bg-gray-50 text-gray-800 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="mb-2 block text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="5"
                className="w-full px-4 py-2 rounded-md border focus:outline-none bg-gray-50 text-gray-800 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              ></textarea>
            </div>

            <Button
              type="submit"
              className="w-full py-3 rounded-lg font-bold transition-all duration-300 dark:bg-gray-300 dark:text-black "
            >
              Send Message
            </Button>

            {formStatus && (
              <p
                className={`mt-4 text-center ${
                  formStatus.includes("success") ? "text-green-500" : "text-red-500"
                }`}
              >
                {formStatus}
              </p>
            )}
          </form>
        </div>

        <div className="w-full md:w-1/2 shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Contact Info</h2>
          <ul className="space-y-4">
            <li className="dark:text-gray-300">
              <strong className="dark:text-white">Location:</strong> Ghagra, Rangamati, Bangladesh
            </li>
            <li className="dark:text-gray-300">
              <strong className="dark:text-white">Email:</strong> sochin.cs@gmail.com
            </li>
            <li className="dark:text-gray-300">
              <strong className="dark:text-white">Phone:</strong> +880 1610316528
            </li>
            <li className="dark:text-gray-300">
              <strong className="dark:text-white">WhatsApp:</strong> +880 1610316528
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
