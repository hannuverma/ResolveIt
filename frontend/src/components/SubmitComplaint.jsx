import React, { useState } from "react";
import api from "../utils/api";

const SubmitComplaint = ({setError, setSuccess}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    department: "",
    image: null,
    imagePreview: null,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
      if (formData.department) {
        formDataToSend.append("department", formData.department);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await api.post("/api/complaints/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Complaint submitted successfully! We will review it shortly.",
      );
      setFormData({
        description: "",
        department: "",
        image: null,
        imagePreview: null,
      });

    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit complaint. Please try again.",
      );
      console.error("Error submitting complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Submit a New Complaint
      </h2>

      <form onSubmit={handleSubmitComplaint} className="space-y-6">
        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Complaint Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Provide detailed information about your complaint..."
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black placeholder-gray-400 resize-none"
            maxLength={2000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/2000 characters
          </p>
        </div>

        {/* Department Field (Optional) */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Department Reference{" "}
            <span className="text-gray-400 text-xs">
              (Optional - AI will verify)
            </span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black placeholder-gray-400"
          >
            <option value="">Select a department (optional)</option>
            <option value="academic">Academic</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="hostel">Hostel</option>
            <option value="admin">Administration</option>
            <option value="cafeteria">Cafeteria</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Image Upload (Optional) */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Upload Image{" "}
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-50 transition-colors">
            {formData.imagePreview ? (
              <div className="space-y-4">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-32 mx-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      image: null,
                      imagePreview: null,
                    }))
                  }
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-green-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600 font-medium mb-1">
                  Drag and drop your image here
                </p>
                <p className="text-gray-400 text-sm mb-3">or click to browse</p>
                <input 
                  type="file" id="cameraInput" accept="image/*" 
                  capture="environment" className="hidden" onChange={handleImageChange} 
                />
                <input 
                  type="file" id="galleryInput" accept="image/*" 
                  className="hidden" onChange={handleImageChange} 
                />

                <div className="flex gap-3 justify-center">
                  <label htmlFor="cameraInput" className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer active:scale-95 transition-transform">
                    📷 Take Photo
                  </label>
                  <label htmlFor="galleryInput" className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer active:scale-95 transition-transform">
                    🖼 Gallery
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Complaint"
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
