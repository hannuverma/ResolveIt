import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import MessageAlert from "../components/MessageAlert";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFormCard from "../components/admin/AdminFormCard";
import AddStudentForm from "../components/admin/AddStudentForm";
import RemoveStudentForm from "../components/admin/RemoveStudentForm";
import AddDepartmentForm from "../components/admin/AddDepartmentForm";
import RemoveDepartmentForm from "../components/admin/RemoveDepartmentForm";

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

	const [departments, setDepartments] = useState([]);

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
	const fetchDepartments = async () => {
		try {
			const response = await api.get("/api/admin/getdepartments/");
			setDepartments(response.data);
		} catch (error) {
			setError("Failed to fetch departments. Please try again later.");
			console.error("Fetch Departments Error:", error);
		}
	};
	useEffect(() => {
		fetchDepartments();
	}, []);

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-10'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
				<AdminHeader
					adminName={adminProfile?.name || adminProfile?.username}
					collegeName={adminProfile?.college_name}
				/>

				<MessageAlert message={error} type='error' />
				<MessageAlert
					message={success}
					type='success'
					onClose={() => setSuccess("")}
				/>

				<div className='grid gap-6 lg:grid-cols-2'>
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

					<AdminFormCard
						title='Add Department'
						description='Provision a department login with credentials.'
					>
						<AddDepartmentForm
							formData={addDepartmentData}
							onChange={(event) => {
								setAddDepartmentData((prev) => ({
									...prev,
									[event.target.name]: event.target.value,
								}));
							}}
							onSubmit={handleAddDepartment}
							loading={loadingAction === "addDepartment"}
							departments={departments}
						/>
					</AdminFormCard>

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
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
