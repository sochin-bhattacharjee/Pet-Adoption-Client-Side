import { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CreateDonations = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petName: '', // New state for pet name
    petPicture: null,
    maxDonationAmount: '',
    lastDate: '',
    shortDescription: '',
    longDescription: '',
    paused: false,
  });

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;
    if (name === 'petPicture') {
      setFormData({ ...formData, petPicture: files[0] });
    } else if (name === 'paused') {
      setFormData({ ...formData, paused: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.petName ||
      !formData.petPicture ||
      !formData.maxDonationAmount ||
      !formData.lastDate ||
      !formData.shortDescription ||
      !formData.longDescription
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Please fill out all fields.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const formDataImg = new FormData();
    formDataImg.append('image', formData.petPicture);

    try {
      const imgResponse = await fetch(
        'https://api.imgbb.com/1/upload?key=bbc6e1780f1c73f169600adaa4c05e09',
        {
          method: 'POST',
          body: formDataImg,
        }
      );

      const imgData = await imgResponse.json();
      if (imgData.success) {
        const petPictureUrl = imgData.data.url;

        const donationData = {
          petName: formData.petName, // Include pet name
          petPicture: petPictureUrl,
          maxDonationAmount: formData.maxDonationAmount,
          lastDate: formData.lastDate,
          shortDescription: formData.shortDescription,
          longDescription: formData.longDescription,
          createdAt: new Date().toISOString(),
          userName: user?.displayName,
          userEmail: user?.email,
          paused: formData.paused,
        };

        const response = await axiosSecure.post('/api/donations', donationData);

        const result = response.data;
        if (result.success) {
          Swal.fire({
            icon: 'success',
            title: 'Donation Campaign Created Successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
          setFormData({
            petName: '', // Reset pet name
            petPicture: null,
            maxDonationAmount: '',
            lastDate: '',
            shortDescription: '',
            longDescription: '',
            paused: false,
          });
          navigate('/dashboard/myDonationsCampaign');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong, please try again.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Image upload failed. Please try again.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error during submission:', error);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong, please try again.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Create a Donation Campaign</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="petName" className="block text-lg font-medium text-gray-700">Pet Name</label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="petPicture" className="block text-lg font-medium text-gray-700">Pet Picture</label>
            <input
              type="file"
              name="petPicture"
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="maxDonationAmount" className="block text-lg font-medium text-gray-700">Maximum Donation Amount</label>
            <input
              type="number"
              name="maxDonationAmount"
              value={formData.maxDonationAmount}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="lastDate" className="block text-lg font-medium text-gray-700">Last Date of Donation</label>
            <input
              type="date"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label htmlFor="shortDescription" className="block text-lg font-medium text-gray-700">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="longDescription" className="block text-lg font-medium text-gray-700">Long Description</label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="paused" className="block text-lg font-medium text-gray-700">Pause Campaign</label>
          <input
            type="checkbox"
            name="paused"
            checked={formData.paused}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full md:w-1/2 py-3 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonations;
