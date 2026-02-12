import React, { useState } from 'react'
import api from "../utils/api";


const FeedbackForm = () => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
    
        const [feedbackData, setFeedbackData] = useState({
            rating: 5,
            comment: "",
        });
    
        

	const handleSubmitFeedback = async () => {
		setError("");
		setLoading(true);

		try {
			await api.post(`/api/complaints/${selectedComplaint.id}/feedback/`, {
				rating: feedbackData.rating,
				review: feedbackData.review,
			});

			setSuccess("Feedback submitted successfully. Thank you!");
			setShowFeedbackModal(false);
			fetchComplaints();
		} catch (err) {
			setError("Failed to submit feedback. Please try again.");
			console.error("Error submitting feedback:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8'>
				<h2 className='text-2xl font-bold text-gray-800 mb-2'>
					Provide Feedback
				</h2>
				<p className='text-gray-600 text-sm mb-6'>
					Help us improve by sharing your feedback on this resolved
					complaint
				</p>

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

					{/* review */}
					<div>
						<label
							htmlFor='feedback-review'
							className='block text-sm font-semibold text-gray-700 mb-2'
						>
							Your Review
						</label>
						<textarea
							id='feedback-review'
							value={feedbackData.review}
							onChange={(e) =>
								setFeedbackData((prev) => ({
									...prev,
									review: e.target.value,
								}))
							}
							placeholder='Share your thoughts...'
							rows='4'
							className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black placeholder-gray-400 resize-none'
						/>
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
		</div>
	);
};

export default FeedbackForm
