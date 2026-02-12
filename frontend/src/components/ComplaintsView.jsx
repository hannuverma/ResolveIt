import React, { useEffect, useState } from "react";
import api from "../utils/api";


const ComplaintsView = () => {
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
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
	const openFeedbackModal = (complaint) => {
		setSelectedComplaint(complaint);
		setShowFeedbackModal(true);
		setFeedbackData({ rating: 5, comment: "" });
	};
	const getStatusColor = (status) => {
		status = status.toLowerCase();
		const statusColors = {
			pending: "bg-yellow-100 text-yellow-800",
			in_progress: "bg-blue-100 text-blue-800",
			resolved: "bg-green-100 text-green-800",
			closed: "bg-gray-100 text-gray-800",
		};
		return statusColors[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityColor = (priority) => {
		priority = priority.toLowerCase();
		const priorityColors = {
			low: "bg-green-100 text-green-800",
			medium: "bg-yellow-100 text-yellow-800",
			high: "bg-red-100 text-red-800",
		};
		return priorityColors[priority] || "bg-gray-100 text-gray-800";
	};
	return (
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
					<p className='text-gray-600'>Loading complaints...</p>
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
										{(complaint.status || "pending")
											.replace("_", " ")
											.toUpperCase()}
									</span>
									<span
										className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority || "medium")}`}
									>
										{(complaint.priority || "medium").toUpperCase()}
									</span>
								</div>
							</div>
							{console.log("Complaint Data:", complaint)}
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
								{complaint.assigned_department && (
									<div>
										<p className='text-gray-500 text-xs font-medium'>
											DEPARTMENT
										</p>
										<p className='text-gray-700 font-semibold capitalize'>
											{complaint.assigned_department}
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
								{complaint.resolved_at && (
									<div>
										<p className='text-gray-500 text-xs font-medium'>
											RESOLVED
										</p>
										<p className='text-gray-700 font-semibold'>
											{new Date(
												complaint.resolved_at,
											).toLocaleDateString()}
										</p>
									</div>
								)}
							</div>

							{/* Feedback Section */}
							{complaint.status === "RESOLVED" && !complaint.feedback ? (
								<button
									onClick={() => openFeedbackModal(complaint)}
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
										{complaint.feedback.review_text}
									</p>
									<p className='text-xs text-gray-500 mt-2'>
										Rating: {complaint.feedback.rating}
										/5 ⭐
									</p>
								</div>
							) : null}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ComplaintsView;
