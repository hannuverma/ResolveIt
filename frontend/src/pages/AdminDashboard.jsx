import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import MessageAlert from "../components/MessageAlert";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFormCard from "../components/admin/AdminFormCard";
import AddStudentForm from "../components/admin/AddStudentForm";
import RemoveStudentForm from "../components/admin/RemoveStudentForm";
import AddDepartmentForm from "../components/admin/AddDepartmentForm";
import DepartmentLeaderboard from "../components/admin/DepartmentLeaderboard";
import RemoveDepartmentForm from "../components/admin/RemoveDepartmentForm";
import CreateAlertForm from "../components/admin/CreateAlertForm";

const AdminDashboard = () => {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loadingAction, setLoadingAction] = useState("");
	const [addStudentData, setAddStudentData] = useState({
		username: "",
		first_name: "",
		last_name: "",
		roll_no: "",
	});
	const [removeStudentData, setRemoveStudentData] = useState({
		email: "",
	});
	const [addDepartmentData, setAddDepartmentData] = useState({
		department_name: "",
		username: "",
		password: "",
		code: "",
		description: "",
	});
	const [removeDepartmentData, setRemoveDepartmentData] = useState({
		email: "",
	});
	const [createAlertData, setCreateAlertData] = useState({
		message: "",
		estimated_resolution_time: "",
	});

	const [departments, setDepartments] = useState([]);
	const [alerts, setAlerts] = useState([]);

	const adminProfile = localStorage.getItem("userProfile")
		? JSON.parse(localStorage.getItem("userProfile"))
		: null;

	const resetAlerts = () => {
		setError("");
		setSuccess("");
	};

	const handleAddStudent = async (event) => {
		event.preventDefault();
		resetAlerts();
		setLoadingAction("addStudent");
		try {
			await api.post("/api/admin/addstudents/", addStudentData);

			setSuccess("Student added successfully.");
			setAddStudentData({
				username: "",
				first_name: "",
				last_name: "",
				roll_no: "",
			});
		} catch (error) {
			setError(
				"Failed to add student. Please check the details and try again.",
			);
			console.error("Add Student Error:", error);
		} finally {
			setLoadingAction("");
		}
	};

	const handleRemoveStudent = async (event) => {
		event.preventDefault();
		resetAlerts();
		setLoadingAction("removeStudent");

		try {
			await api.delete(
				`/api/admin/removestudents/${removeStudentData.email}/`,
			);

			setSuccess("Student removed successfully.");
			setRemoveStudentData({ email: "" });
		} catch (error) {
			setError(
				"Failed to remove student. Please check the details and try again.",
			);
			console.error("Remove Student Error:", error);
		} finally {
			setLoadingAction("");
		}
	};

	const handleAddDepartment = async (event) => {
		event.preventDefault();
		resetAlerts();
		setLoadingAction("addDepartment");
		try {
			await api.post("/api/admin/adddepartments/", addDepartmentData);
			console.log("Department added:", addDepartmentData);
			setAddDepartmentData({
				department_name: "",
				username: "",
				password: "",
				code: "",
				description: "",
			});
			setSuccess("Department added successfully.");
			fetchDepartments();
		} catch (error) {
			setError(
				"Failed to add department. Please check the details and try again.",
			);
			console.error("Add Department Error:", error);
		} finally {
			setLoadingAction("");
		}
	};

	const handleRemoveDepartment = async (event) => {
		event.preventDefault();
		resetAlerts();
		setLoadingAction("removeDepartment");
		console.log("Department code to remove:", removeDepartmentData);
		try {
			await api.delete(
				`/api/admin/removedepartments/${removeDepartmentData.email}/`,
			);
			setSuccess("Department removed successfully.");
			setRemoveDepartmentData({ email: "" });
			fetchDepartments();
		} catch (error) {
			setError(
				"Failed to remove department. Please check the details and try again.",
			);
			console.error("Remove Department Error:", error);
		} finally {
			setLoadingAction("");
		}
	};

	const handleCreateAlert = async (event) => {
		event.preventDefault();
		resetAlerts();
		setLoadingAction("createAlert");
		try {
			await api.post("/api/admin/createalert/", createAlertData);
			setCreateAlertData({
				message: "",
				estimated_resolution_time: "",
			});
			setSuccess("Alert created successfully.");
		} catch (error) {
			setError(
				"Failed to create alert. Please check the details and try again.",
			);
			console.error("Create Alert Error:", error);
		} finally {
			setLoadingAction("");
		}
	};

	const fetchDepartments = async () => {
		try {
			const response = await api.get("/api/admin/getdepartments/");
			setDepartments(response.data);
		} catch (error) {
			setError("Failed to fetch departments. Please try again later.");
			console.error("Fetch Departments Error:", error);
		}
	};
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
	useEffect(() => {
		fetchDepartments();
		fetchAlerts();
	}, []);

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-10'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
				<AdminHeader
					adminName={adminProfile?.name || adminProfile?.username}
					collegeName={adminProfile?.college_name}
				/>
				{/* Admin Notifications */}
				{alerts && alerts.length !== 0 && (
					<div className='mb-8'>
						<div className='flex items-center gap-2 mb-4'>
							<svg
								className='w-6 h-6 text-amber-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
								/>
							</svg>
							<h2 className='text-2xl font-bold text-amber-700 capitalize'>
								ongoing alerts
							</h2>
						</div>
						<div className='space-y-3'>
							{alerts.map((alert, index) => (
								<div
									key={index}
									className='bg-linear-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow'
								>
									<p className='text-gray-800 font-semibold text-lg mb-2 flex items-center justify-between'>
										{alert.message}
										<button
											onClick={async () => {
												await api.delete(
													`admin/removealert/${alert.id}/`,
												);
												fetchAlerts();
											}}
											className='bg-orange-500 text-white flex items-center justify-around  cursor-pointer px-2 py-1 rounded hover:bg-red-600 transition-colors'
										>
											<svg
												className='w-4 h-4 text-white hover:text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
												/>
											</svg>
											Delete
										</button>
									</p>
									<div className='flex flex-wrap gap-4 text-sm text-gray-600'>
										<span className='flex items-center gap-1'>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
												/>
											</svg>
											Posted: {alert.created_at_formatted}
										</span>
										{alert.estimated_resolution_time_formatted && (
											<span className='flex items-center gap-1 text-green-700 font-medium'>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
													/>
												</svg>
												Expected resolution:{" "}
												{alert.estimated_resolution_time_formatted}
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				<MessageAlert message={error} type='error' />
				<MessageAlert
					message={success}
					type='success'
					onClose={() => setSuccess("")}
				/>

				<div className='grid gap-6 lg:grid-cols-2'>
					<div className='lg:col-span-2'>
						<AdminFormCard
							title='Department Leaderboard'
							description='Ranked by (reward points/complaints) across departments.'
						>
							<DepartmentLeaderboard departments={departments} />
						</AdminFormCard>
					</div>
					<AdminFormCard
						title='Add Student'
						description='Create a student account for your college.'
					>
						<AddStudentForm
							formData={addStudentData}
							onChange={(event) =>
								setAddStudentData((prev) => ({
									...prev,
									[event.target.name]: event.target.value,
								}))
							}
							onSubmit={handleAddStudent}
							loading={loadingAction === "addStudent"}
						/>
					</AdminFormCard>
					<AdminFormCard
						title='Remove Student'
						description='Deactivate a student using email and roll number.'
					>
						<RemoveStudentForm
							formData={removeStudentData}
							onChange={(event) =>
								setRemoveStudentData((prev) => ({
									...prev,
									[event.target.name]: event.target.value,
								}))
							}
							onSubmit={handleRemoveStudent}
							loading={loadingAction === "removeStudent"}
						/>
					</AdminFormCard>
					<div className=' gap-6 lg:col-span-2 grid lg:grid-cols-2'>
						<AdminFormCard
							title='Add Department'
							description='Provision a department login with credentials.'
						>
							<AddDepartmentForm
								formData={addDepartmentData}
								onChange={(event) => {
									const { name, value } = event.target;
									setAddDepartmentData((prev) => {
										const updated = {
											...prev,
											[name]: value,
										};

										// Auto-generate username when department_name changes
										if (name === "department_name") {
											const deptFirstName = value
												.split(" ")[0]
												.toLowerCase();
											const collegeNameFormatted = (
												adminProfile?.college_name || "College"
											)
												.replace(/\s+/g, "")
												.toLowerCase();
											updated.username = `${deptFirstName}@${collegeNameFormatted}.com`;
										}

										return updated;
									});
								}}
								onSubmit={handleAddDepartment}
								loading={loadingAction === "addDepartment"}
								departments={departments}
								collegeName={adminProfile?.college_name}
							/>
						</AdminFormCard>

						<div className='flex flex-col gap-1.5'>
							<AdminFormCard
								title='Remove Department'
								description='Remove a department account by code.'
							>
								<RemoveDepartmentForm
									formData={removeDepartmentData}
									onChange={(event) => {
										console.log("Field changed:", event.target.name);
										setRemoveDepartmentData((prev) => ({
											...prev,
											[event.target.name]: event.target.value,
										}));
									}}
									onSubmit={handleRemoveDepartment}
									loading={loadingAction === "removeDepartment"}
									departments={departments}
								/>
							</AdminFormCard>
							<AdminFormCard
								title='Create alert ⚠️'
								description='Send notifications to students.'
							>
								<CreateAlertForm
									formData={createAlertData}
									onChange={(event) => {
										setCreateAlertData((prev) => ({
											...prev,
											[event.target.name]: event.target.value,
										}));
									}}
									onSubmit={handleCreateAlert}
									loading={loadingAction === "createAlert"}
								/>
							</AdminFormCard>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
