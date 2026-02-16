import React, { useState, useEffect, use } from "react";
import StudentProfileHeader from "../components/StudentProfileHeader";
import MessageAlert from "../components/MessageAlert";
import SubmitComplaint from "../components/SubmitComplaint";
import ComplaintsView from "../components/ComplaintsView";
import FeedbackForm from "../components/FeedbackForm";
import api from "../utils/api";
import DepartmentLeaderboard from "../components/admin/DepartmentLeaderboard";
import AdminFormCard from "../components/admin/AdminFormCard";

const StudentDashboard = () => {
	const studentProfile = localStorage.getItem("userProfile")
		? JSON.parse(localStorage.getItem("userProfile"))
		: null;

	const [activeTab, setActiveTab] = useState("submit");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [alerts, setAlerts] = useState([]);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(false);


	const fetchAlerts = async () => {
		try {
			const response = await api.get("/api/admin/createalert/");
			console.log("Fetched alerts:", response.data);
			setAlerts(response.data);
		} catch (err) {
			console.error("Error fetching alerts:", err);
			setError("Failed to load alerts");
		}
	};

	// Fetch complaints on component mount
	useEffect(() => {
		fetchComplaints();
		fetchAlerts();
	}, [activeTab]);

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

	const handleChangePassword = () => {
		// TODO: wire up change password route or modal
	};

	return (
		<div
			id='studentDash'
			className='min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4'
		>
			<div className='max-w-6xl mx-auto'>
				<StudentProfileHeader
					firstName={studentProfile?.first_name || ""}
					lastName={studentProfile?.last_name || ""}
					onChangePassword={handleChangePassword}
				/>

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
				{/* Admin Notifications */}
				{alerts && alerts.length !== 0 && (
					<>
					<h2 className="capitalize text-yellow-700 text-xl font-">notifications from admin ⚠️</h2>
					<ul className="mb-6 py-4 mt-2 bg-yellow-50 border border-yellow-500 rounded-lg list-disc pl-10">
					{alerts.map((a, index) => (
							<li key={index} className='text-orange-700 font-bold text-[18px] capitalize flex justify-around items-center'><span>{a.message}</span> <span>{a.estimated_resolution_time_formatted}</span></li>
							// <div key={index} className='mb-6 p-4 bg-yellow-50 border border-yellow-500 rounded-lg'>
							// 	<p className='text-red-700 font-medium'><b>Alert : </b>{a.message}</p>
							// </div>
						))}
						</ul>
					</>
				)}
				<MessageAlert
					message={success}
					type='success'
					onClose={() => setSuccess("")}
				/>

				{/* Tab Navigation */}
				<div className='flex gap-4 mb-8 border-b-2 border-green-200 overflow-x-auto dashboard-tabs'>
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
					<button
						onClick={() => setActiveTab("leaderboard")}
						className={`pb-4 px-6 font-semibold transition-all duration-200 ${
							activeTab === "leaderboard"
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
							Department Leaderboard
						</span>
					</button>
				</div>

				{/* Tab Content */}
				{activeTab === "submit" && (
					<SubmitComplaint setError={setError} setSuccess={setSuccess} />
				)}

				{activeTab === "history" && (
					<>
						<ComplaintsView
							setShowFeedbackModal={setShowFeedbackModal}
							setSelectedComplaint={setSelectedComplaint}
							complaints={complaints}
							loading={loading}
						/>

						{/* Feedback Form - Displayed as a regular component */}
						{showFeedbackModal && selectedComplaint && (
							<div className='mt-8 flex justify-center'>
								<FeedbackForm
									setSuccess={setSuccess}
									selectedComplaint={selectedComplaint}
									setShowFeedbackModal={setShowFeedbackModal}
									fetchComplaints={fetchComplaints}
								/>
							</div>
						)}
					</>
				)}
				{activeTab === "leaderboard" && (
					<AdminFormCard
						title='Department Leaderboard'
						description='Ranked by (reward points/complaints) across departments.'
					>
						<DepartmentLeaderboard />
					</AdminFormCard>
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
};;

export default StudentDashboard;
