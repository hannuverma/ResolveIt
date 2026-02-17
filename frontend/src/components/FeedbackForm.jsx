import React, { useState } from "react";
import api from "../utils/api";

const FeedbackForm = ({
	selectedComplaint,
	setShowFeedbackModal,
	setSuccess,
	fetchComplaints
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [feedbackData, setFeedbackData] = useState({
		rating: 5,
		review_text: "",
		image: null,
		imagePreview: null,
	});
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFeedbackData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFeedbackData((prev) => ({
				...prev,
				image: file,
				imagePreview: URL.createObjectURL(file),
			}));
		}
	};

	const handleSubmitFeedback = async () => {
		setError("");
		setLoading(true);

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("rating", feedbackData.rating);
			formDataToSend.append("review_text", feedbackData.review_text);
			if (feedbackData.image) {
				formDataToSend.append("image", feedbackData.image);
			}
			await api.post(`/api/complaints/${selectedComplaint.id}/feedback/`, formDataToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setSuccess("Feedback submitted successfully. Thank you!");
			fetchComplaints(); // Refresh complaints to show new feedback
			setShowFeedbackModal(false);
		} catch (err) {
			setError("Failed to submit feedback. Please try again.");
			console.error("Error submitting feedback:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>
						Provide Feedback
					</h2>
					<p className='text-gray-600 text-sm'>
						Help us improve by sharing your feedback on this resolved
						complaint
					</p>
				</div>
				<button
					onClick={() => setShowFeedbackModal(false)}
					className='text-gray-500 hover:text-gray-700 text-2xl'
				>
					×
				</button>
			</div>

			{error && (
				<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
					<p className='text-red-700 text-sm'>{error}</p>
				</div>
			)}

			<div className='space-y-6'>
				{/* Rating */}
				<div>
					<label className='block text-sm font-semibold text-gray-700 mb-3'>
						Rating
					</label>
					<div className='flex gap-2 justify-center'>
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								onClick={() =>
									setFeedbackData((prev) => ({
										...prev,
										rating: star,
									}))
								}
								className={`text-3xl transition-transform ${
									star <= feedbackData.rating
										? "text-yellow-400 scale-110"
										: "text-gray-300 hover:scale-105"
								}`}
							>
								★
							</button>
						))}
					</div>
				</div>

				{/* Image Upload (Optional) */}
				<div>
					<label
						htmlFor='image'
						className='block text-sm font-semibold text-gray-700 mb-2'
					>
						Upload Image{" "}
					</label>
					<div className='border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-50 transition-colors'>
						{feedbackData.imagePreview ? (
							<div className='space-y-4'>
								<img
									src={feedbackData.imagePreview}
									alt='Preview'
									className='h-32 mx-auto rounded-lg object-cover'
								/>
								<button
									type='button'
									onClick={() =>
										setFeedbackData((prev) => ({
											...prev,
											image: null,
											imagePreview: null,
										}))
									}
									className='text-sm text-red-600 hover:text-red-700 font-medium'
								>
									Remove Image
								</button>
							</div>
						) : (
							<div>
								<svg
									className='mx-auto h-12 w-12 text-green-500 mb-2'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.5}
										d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
									/>
								</svg>
								<p className='text-gray-600 font-medium mb-1'>
									Drag and drop your image here
								</p>
								<p className='text-gray-400 text-sm mb-3'>
									or click to browse
								</p>
								<input
									type='file'
									id='cameraInput'
									accept='image/*'
									capture='environment'
									className='hidden'
									onChange={handleImageChange}
								/>
								<input
									type='file'
									id='galleryInput'
									accept='image/*'
									className='hidden'
									onChange={handleImageChange}
								/>

								<div className='flex gap-3 justify-center'>
									<label
										htmlFor='cameraInput'
										className='px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer active:scale-95 transition-transform'
									>
										📷 Take Photo
									</label>
									<label
										htmlFor='galleryInput'
										className='px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer active:scale-95 transition-transform'
									>
										🖼 Gallery
									</label>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* Buttons */}
				<div className='flex gap-3'>
					<button
						onClick={() => setShowFeedbackModal(false)}
						className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={handleSubmitFeedback}
						disabled={loading}
						className='flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						{loading ? "Submitting..." : "Submit Feedback"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeedbackForm;
