import React, { useState, useEffect } from "react";
import api from "../utils/api";

const StudentDashboard = () => {
	const [activeTab, setActiveTab] = useState("submit");
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		department: "",
		image: null,
		imagePreview: null,
	});

	const [feedbackData, setFeedbackData] = useState({
		rating: 5,
		comment: "",
	});

	// Fetch complaints on component mount
	useEffect(() => {
		fetchComplaints();
	}, []);

	const fetchComplaints = async () => {
		try {
			setLoading(true);
			const response = await api.get("/api/complaints/");
			setComplaints(response.data);
		} catch (err) {
			console.error("Error fetching complaints:", err);
			setError("Failed to load complaints");
		} finally {
			setLoading(false);
		}
	};

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
			formDataToSend.append("title", formData.title);
			formDataToSend.append("description", formData.description);
			if (formData.department) {
				formDataToSend.append("department", formData.department);
			}
			if (formData.image) {
				formDataToSend.append("image", formData.image);
			}

			const response = await api.post(
				"/api/complaints/",
				formDataToSend,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			setSuccess(
				"Complaint submitted successfully! We will review it shortly.",
			);
			setFormData({
				title: "",
				description: "",
				department: "",
				image: null,
				imagePreview: null,
			});

			// Refresh complaints list
			setTimeout(() => {
				fetchComplaints();
			}, 1500);
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

	const openFeedbackModal = (complaint) => {
		setSelectedComplaint(complaint);
		setShowFeedbackModal(true);
		setFeedbackData({ rating: 5, comment: "" });
	};

	const handleSubmitFeedback = async () => {
		setError("");
		setLoading(true);

		try {
			await api.post(
				`/api/complaints/${selectedComplaint.id}/feedback/`,
				{
					rating: feedbackData.rating,
					comment: feedbackData.comment,
				},
			);

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

	const getStatusColor = (status) => {
		const statusColors = {
			pending: "bg-yellow-100 text-yellow-800",
			in_progress: "bg-blue-100 text-blue-800",
			resolved: "bg-green-100 text-green-800",
			closed: "bg-gray-100 text-gray-800",
		};
		return statusColors[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityColor = (priority) => {
		const priorityColors = {
			low: "bg-green-100 text-green-800",
			medium: "bg-yellow-100 text-yellow-800",
			high: "bg-red-100 text-red-800",
		};
		return priorityColors[priority] || "bg-gray-100 text-gray-800";
	};

	return (
		<div
			id='studentDash'
			className='min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4'
		>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-4xl font-bold text-gray-800 mb-2'>
						Student Dashboard
					</h1>
					<p className='text-gray-600'>
						Centralized Complaint Management System
					</p>
				</div>

				{/* Global Messages */}
				{error && (
					<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
						<p className='text-red-700 font-medium'>{error}</p>
					</div>
				)}
				{success && (
					<div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
						<p className='text-green-700 font-medium'>{success}</p>
					</div>
				)}

				{/* Tab Navigation */}
				<div className='flex gap-4 mb-8 border-b-2 border-green-200'>
					<button
						onClick={() => setActiveTab("submit")}
						className={`pb-4 px-6 font-semibold transition-all duration-200 ${
							activeTab === "submit"
								? "text-green-600 border-b-2 border-green-600"
								: "text-gray-600 hover:text-green-600"
						}`}
					>
						<span className='flex items-center gap-2'>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 4v16m8-8H4'
								/>
							</svg>
							Submit Complaint
						</span>
					</button>
					<button
						onClick={() => setActiveTab("history")}
						className={`pb-4 px-6 font-semibold transition-all duration-200 ${
							activeTab === "history"
								? "text-green-600 border-b-2 border-green-600"
								: "text-gray-600 hover:text-green-600"
						}`}
					>
						<span className='flex items-center gap-2'>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
							My Complaints
						</span>
					</button>
				</div>

				{/* Tab Content */}
				{activeTab === "submit" && (
					<div className='bg-white rounded-2xl shadow-lg p-8 border border-green-100'>
						<h2 className='text-2xl font-bold text-gray-800 mb-6'>
							Submit a New Complaint
						</h2>

						<form
							onSubmit={handleSubmitComplaint}
							className='space-y-6'
						>
							{/* Title Field */}
							<div>
								<label
									htmlFor='title'
									className='block text-sm font-semibold text-gray-700 mb-2'
								>
									Complaint Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									id='title'
									name='title'
									value={formData.title}
									onChange={handleInputChange}
									required
									placeholder='Brief summary of your complaint'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
									maxLength={150}
								/>
								<p className='text-xs text-gray-500 mt-1'>
									{formData.title.length}/150 characters
								</p>
							</div>

							{/* Description Field */}
							<div>
								<label
									htmlFor='description'
									className='block text-sm font-semibold text-gray-700 mb-2'
								>
									Complaint Description{" "}
									<span className='text-red-500'>*</span>
								</label>
								<textarea
									id='description'
									name='description'
									value={formData.description}
									onChange={handleInputChange}
									required
									placeholder='Provide detailed information about your complaint...'
									rows='6'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none'
									maxLength={2000}
								/>
								<p className='text-xs text-gray-500 mt-1'>
									{formData.description.length}/2000
									characters
								</p>
							</div>

							{/* Department Field (Optional) */}
							<div>
								<label
									htmlFor='department'
									className='block text-sm font-semibold text-gray-700 mb-2'
								>
									Department Reference{" "}
									<span className='text-gray-400 text-xs'>
										(Optional - AI will verify)
									</span>
								</label>
								<select
									id='department'
									name='department'
									value={formData.department}
									onChange={handleInputChange}
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
								>
									<option value=''>
										Select a department (optional)
									</option>
									<option value='academic'>Academic</option>
									<option value='infrastructure'>
										Infrastructure
									</option>
									<option value='hostel'>Hostel</option>
									<option value='admin'>
										Administration
									</option>
									<option value='cafeteria'>Cafeteria</option>
									<option value='security'>Security</option>
									<option value='other'>Other</option>
								</select>
							</div>

							{/* Image Upload (Optional) */}
							<div>
								<label
									htmlFor='image'
									className='block text-sm font-semibold text-gray-700 mb-2'
								>
									Upload Image{" "}
									<span className='text-gray-400 text-xs'>
										(Optional)
									</span>
								</label>
								<div className='border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-50 transition-colors'>
									{formData.imagePreview ? (
										<div className='space-y-4'>
											<img
												src={formData.imagePreview}
												alt='Preview'
												className='h-32 mx-auto rounded-lg object-cover'
											/>
											<button
												type='button'
												onClick={() =>
													setFormData((prev) => ({
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
												id='image'
												name='image'
												onChange={handleImageChange}
												accept='image/*'
												className='hidden'
											/>
											<label
												htmlFor='image'
												className='inline-block px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 cursor-pointer transition-colors'
											>
												Choose Image
											</label>
										</div>
									)}
								</div>
							</div>

							{/* Submit Button */}
							<button
								type='submit'
								disabled={loading}
								className='w-full mt-8 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
							>
								{loading ? (
									<span className='flex items-center justify-center'>
										<svg
											className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
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
				)}

				{activeTab === "history" && (
					<div>
						{loading && !complaints.length ? (
							<div className='text-center py-12'>
								<svg
									className='animate-spin h-12 w-12 text-green-600 mx-auto mb-4'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
								<p className='text-gray-600'>
									Loading complaints...
								</p>
							</div>
						) : complaints.length === 0 ? (
							<div className='bg-white rounded-2xl shadow-lg p-12 border border-green-100 text-center'>
								<svg
									className='h-16 w-16 text-green-300 mx-auto mb-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.5}
										d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
									/>
								</svg>
								<p className='text-gray-600 text-lg font-medium'>
									No complaints yet
								</p>
								<p className='text-gray-400 text-sm mt-2'>
									Submit your first complaint to get started
								</p>
							</div>
						) : (
							<div className='space-y-4'>
								{complaints.map((complaint) => (
									<div
										key={complaint.id}
										className='bg-white rounded-2xl shadow-md hover:shadow-lg border border-green-100 p-6 transition-all'
									>
										{/* Header */}
										<div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4'>
											<div className='flex-1'>
												<h3 className='text-xl font-bold text-gray-800 mb-2'>
													{complaint.title}
												</h3>
												<p className='text-gray-600 text-sm line-clamp-2'>
													{complaint.description}
												</p>
											</div>
											<div className='flex gap-2 flex-wrap'>
												<span
													className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status || "pending")}`}
												>
													{(
														complaint.status ||
														"pending"
													)
														.replace("_", " ")
														.toUpperCase()}
												</span>
												<span
													className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority || "medium")}`}
												>
													{(
														complaint.priority ||
														"medium"
													).toUpperCase()}
												</span>
											</div>
										</div>

										{/* Image if available */}
										{complaint.image && (
											<div className='mb-4'>
												<img
													src={complaint.image}
													alt={complaint.title}
													className='h-32 rounded-lg object-cover'
												/>
											</div>
										)}

										{/* Details */}
										<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm'>
											{complaint.department && (
												<div>
													<p className='text-gray-500 text-xs font-medium'>
														DEPARTMENT
													</p>
													<p className='text-gray-700 font-semibold capitalize'>
														{complaint.department}
													</p>
												</div>
											)}
											<div>
												<p className='text-gray-500 text-xs font-medium'>
													SUBMITTED
												</p>
												<p className='text-gray-700 font-semibold'>
													{new Date(
														complaint.created_at,
													).toLocaleDateString()}
												</p>
											</div>
											{complaint.updated_at && (
												<div>
													<p className='text-gray-500 text-xs font-medium'>
														UPDATED
													</p>
													<p className='text-gray-700 font-semibold'>
														{new Date(
															complaint.updated_at,
														).toLocaleDateString()}
													</p>
												</div>
											)}
										</div>

										{/* Feedback Section */}
										{complaint.status === "resolved" &&
										!complaint.feedback ? (
											<button
												onClick={() =>
													openFeedbackModal(complaint)
												}
												className='w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
											>
												<svg
													className='w-5 h-5'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M14 10h-2m0 0H8m4 0V8m0 2v2m0 0v2m0-2h2m0 0h2M7 20H5a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0h2a2 2 0 012-2h2a2 2 0 012 2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2m0 0V9m0 11h2m0 0v2m0-2v-2'
													/>
												</svg>
												Provide Feedback
											</button>
										) : complaint.feedback ? (
											<div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
												<p className='text-sm text-green-700 font-medium mb-1'>
													Your Feedback
												</p>
												<p className='text-gray-700'>
													{complaint.feedback.comment}
												</p>
												<p className='text-xs text-gray-500 mt-2'>
													Rating:{" "}
													{complaint.feedback.rating}
													/5 ⭐
												</p>
											</div>
										) : null}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Feedback Modal */}
				{showFeedbackModal && selectedComplaint && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8'>
							<h2 className='text-2xl font-bold text-gray-800 mb-2'>
								Provide Feedback
							</h2>
							<p className='text-gray-600 text-sm mb-6'>
								Help us improve by sharing your feedback on this
								resolved complaint
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

								{/* Comment */}
								<div>
									<label
										htmlFor='feedback-comment'
										className='block text-sm font-semibold text-gray-700 mb-2'
									>
										Your Comment
									</label>
									<textarea
										id='feedback-comment'
										value={feedbackData.comment}
										onChange={(e) =>
											setFeedbackData((prev) => ({
												...prev,
												comment: e.target.value,
											}))
										}
										placeholder='Share your thoughts...'
										rows='4'
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none'
									/>
								</div>

								{/* Buttons */}
								<div className='flex gap-3'>
									<button
										onClick={() =>
											setShowFeedbackModal(false)
										}
										className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
									>
										Cancel
									</button>
									<button
										onClick={handleSubmitFeedback}
										disabled={loading}
										className='flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
									>
										{loading
											? "Submitting..."
											: "Submit Feedback"}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Sustainability Footer */}
				<div className='mt-12 px-6 py-4 bg-green-50 rounded-lg border border-green-200 text-center'>
					<p className='text-green-800 text-sm font-medium'>
						♻️ Help us create a better campus environment through
						transparent complaint management
					</p>
				</div>
			</div>
		</div>
	);
};

export default StudentDashboard;
