import React, { useState, useEffect } from "react";
import api from "../utils/api";
import DepartmentHeader from "../components/DepartmentHeader";
import MessageAlert from "../components/MessageAlert";
import ComplaintsList from "../components/ComplaintsList";
import EditComplaintModal from "../components/EditComplaintModal";
import DepartmentFooter from "../components/DepartmentFooter";

const DepartmentDashboard = () => {
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [editFormData, setEditFormData] = useState({
		status: "",
		priority: "",
		feedback: "",
	});

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
			priority: complaint.priority || "medium",
			feedback: complaint.feedback?.comment || "",
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
				priority: editFormData.priority,
			};

			await api.patch(
				`/api/complaints/${selectedComplaint.id}/`,
				updateData,
			);

			if (editFormData.feedback) {
				await api.post(
					`/api/complaints/${selectedComplaint.id}/feedback/`,
					{
						rating: 5,
						comment: editFormData.feedback,
					},
				);
			}

			setSuccess("Complaint updated successfully!");
			setShowEditModal(false);
		} catch (err) {
			setError("Failed to update complaint. Please try again.");
			console.error("Error updating complaint:", err);
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
					college={deptProfile?.college || "College"}
					complaintCount={complaints.length}
				/>

				{/* Messages */}
				<MessageAlert message={error} type='error' />
				<MessageAlert message={success} type='success' />

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
						onSave={handleSaveEdit}
						onClose={() => setShowEditModal(false)}
						loading={loading}
					/>
				)}

				{/* Footer */}
				<DepartmentFooter />
			</div>
		</div>
	);
};

export default DepartmentDashboard;
