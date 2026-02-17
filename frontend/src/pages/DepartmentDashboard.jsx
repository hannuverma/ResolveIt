import React, { useState, useEffect } from "react";
import api from "../utils/api";
import DepartmentHeader from "../components/DepartmentHeader";
import MessageAlert from "../components/MessageAlert";
import ComplaintsList from "../components/ComplaintsList";
import EditComplaintModal from "../components/EditComplaintModal";
import DepartmentFooter from "../components/DepartmentFooter";
import DepartmentLeaderboard from "../components/admin/DepartmentLeaderboard";
import AdminFormCard from "../components/admin/AdminFormCard";
import { useNavigate } from "react-router-dom";

const DepartmentDashboard = () => {
	const [complaints, setComplaints] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [editFormData, setEditFormData] = useState({
		status: "",
		feedback: "",
		resolved_image: null,
		imagePreview: null,
	});

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setEditFormData((prev) => ({
				...prev,
				resolved_image: file,
				imagePreview: URL.createObjectURL(file),
			}));
		}
	};
	const [activeTab, setActiveTab] = useState("complaints");

	const deptProfile = localStorage.getItem("userProfile")
		? JSON.parse(localStorage.getItem("userProfile"))
		: null;

	// Redirect if not department user
	useEffect(() => {
		if (
			!deptProfile ||
			(deptProfile.role !== "DEPT" && deptProfile.role !== "ADMIN")
		) {
			navigate("/");
		}
	}, [deptProfile]);

	const fetchComplaints = async () => {
		try {
			setLoading(true);
			setError("");

			const complaintsResponse = await api.get("/api/complaints/");
			// Sort by date posted (newest first)
			const sortedComplaints = complaintsResponse.data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at),
			);
			setComplaints(sortedComplaints);
		} catch (err) {
			console.error("Error fetching complaints:", err);
			setError("Failed to load complaints. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchComplaints();
	}, []);

	const openEditModal = (complaint) => {
		setSelectedComplaint(complaint);
		setEditFormData({
			status: complaint.status || "pending",
			feedback: complaint.feedback?.comment || "",
			image: null,
			imagePreview: complaint.image || null,
		});
		setShowEditModal(true);
		setError("");
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveEdit = async () => {
		if (!selectedComplaint) return;

		try {
			setLoading(true);
			setError("");

			const updateData = {
				status: editFormData.status,
			};

			await api.patch(
				`/api/complaints/${selectedComplaint.id}/`,
				updateData,
			);

			// if (editFormData.feedback) {
			// 	await api.post(
			// 		`/api/complaints/${selectedComplaint.id}/feedback/`,
			// 		{
			// 			rating: 5,
			// 			comment: editFormData.feedback,
			// 		},
			// 	);
			// }

			setSuccess("Complaint updated successfully!");
			fetchComplaints();
			setShowEditModal(false);
		} catch (err) {
			setError("Failed to update complaint. Please try again.");
			console.error("Error updating complaint:", err);
		} finally {
			setLoading(false);
		}
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
			medium: "bg-blue-100 text-blue-800",
			high: "bg-orange-100 text-orange-800",
			critical: "bg-red-100 text-red-800",
		};
		return priorityColors[priority] || "bg-gray-100 text-gray-800";
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<DepartmentHeader
					department={deptProfile?.department || "Department"}
					college={deptProfile?.college_name || "College"}
					complaintCount={complaints.length}
				/>

				{/* Messages */}
				<MessageAlert message={error} type='error' />
				<MessageAlert
					message={success}
					type='success'
					onClose={() => setSuccess("")}
				/>

				<div className='flex gap-4 mb-8 border-b-2 border-green-200'>
					<button
						onClick={() => setActiveTab("complaints")}
						className={`pb-4 px-6 font-semibold transition-all duration-200 ${
							activeTab === "complaints"
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
							your complaints
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
						<span className='flex items-center gap-2'>🏆leaderboard</span>
					</button>
				</div>
				{activeTab === "leaderboard" && (
					<AdminFormCard
						title='Department Leaderboard'
						description='Ranked by (reward points/complaints) across departments.'
					>
						<DepartmentLeaderboard />
					</AdminFormCard>
				)}

				{activeTab === "complaints" && (
					<>
						{/* Complaints List */}
						<ComplaintsList
							complaints={complaints}
							loading={loading}
							onEdit={openEditModal}
							getStatusColor={getStatusColor}
							getPriorityColor={getPriorityColor}
						/>

						{/* Edit Modal */}
						{showEditModal && selectedComplaint && (
							<EditComplaintModal
								complaint={selectedComplaint}
								formData={editFormData}
								onFormChange={handleEditChange}
								handleImageChange={handleImageChange}
								setFormData={setEditFormData}
								onSave={handleSaveEdit}
								onClose={() => setShowEditModal(false)}
								loading={loading}
							/>
						)}
					</>
				)}
 
				{/* Footer */}
				<DepartmentFooter />
			</div>
		</div>
	);
};

export default DepartmentDashboard;
