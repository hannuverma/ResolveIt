import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import Logo from "../assets/images/logo.png";
import MessageAlert from "../components/MessageAlert";

const DepartmentLogin = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const response = await api.post("/api/token/", {
				username: formData.username,
				password: formData.password,
			});

			setSuccess("Login successful!");
			setFormData({ username: "", password: "" });
			console.log("Department login response:", response.data);
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			// fetching profile
			const fetchProfile = async () => {
				const profile = await api.get("/api/profile/");
				console.log("Fetched student profile:", profile.data);
				return profile.data;
			};
			const profileData = await fetchProfile();
			if (profileData.role === "STUDENT") {
				setError("Student must use the student login page.");
				localStorage.clear();
				return;
			} else if (profileData.role === "ADMIN") {
				setSuccess(
					"Admin login successful! Redirecting to admin dashboard...",
				);
				localStorage.setItem("userProfile", JSON.stringify(profileData));
				navigate("/admin-dashboard");
			} else {
				localStorage.setItem("userProfile", JSON.stringify(profileData));
				setSuccess("Login successful!");
				navigate("/department-dashboard");
			}
		} catch (err) {
			setError(
				err.response?.data?.detail || "Login failed. Please try again.",
			);
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8'>
			<div className='w-full max-w-md'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4'>
						<img src={Logo} alt='ResolveIt Logo' className='w-10' />
					</div>
					<h1 className='text-3xl font-bold text-gray-800 mb-2'>
						ResolveIt
					</h1>
					<p className='text-gray-600 text-sm'>
						Department & Admin Portal
					</p>
					<p className='text-gray-500 text-xs mt-2'>
						Manage complaints and track resolutions
					</p>
				</div>

				{/* Form Card */}
				<div className='bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-600'>
					{/* Error Message */}
					{error && (
						<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
							<p className='text-red-700 text-sm font-medium'>{error}</p>
						</div>
					)}

					<MessageAlert
						message={success}
						type='success'
						onClose={() => setSuccess("")}
					/>

					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* Username Input */}
						<div>
							<label
								htmlFor='username'
								className='block text-sm font-semibold text-gray-700 mb-2'
							>
								Department Username
							</label>
							<input
								type='text'
								id='username'
								name='username'
								value={formData.username}
								onChange={handleChange}
								required
								placeholder='Enter your department username'
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400'
							/>
						</div>

						{/* Password Input */}
						<div>
							<div className='flex justify-between items-center mb-2'>
								<label
									htmlFor='password'
									className='block text-sm font-semibold text-gray-700'
								>
									Password
								</label>
								<Link
									to='#'
									className='text-xs text-blue-600 hover:text-blue-800 font-medium'
								>
									Forgot Password?
								</Link>
							</div>
							<input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								required
								placeholder='Enter your password'
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400'
							/>
						</div>

						{/* Remember Me */}
						<div className='flex items-center'>
							<input
								type='checkbox'
								id='remember'
								className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
							/>
							<label
								htmlFor='remember'
								className='ml-2 text-sm text-gray-600 cursor-pointer'
							>
								Remember me
							</label>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
						>
							{loading ? (
								<>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									Logging in...
								</>
							) : (
								"Login to Department Portal"
							)}
						</button>
					</form>

					{/* Divider */}
					<div className='flex items-center gap-3 my-6'>
						<div className='flex-1 h-px bg-gray-300'></div>
						<span className='text-gray-500 text-xs'>NEED HELP?</span>
						<div className='flex-1 h-px bg-gray-300'></div>
					</div>

					{/* Help Section */}
					<div className='bg-blue-50 rounded-lg p-4 text-center mb-4'>
						<p className='text-gray-700 text-sm font-medium mb-2'>
							Don't have department credentials?
						</p>
						<p className='text-gray-600 text-xs mb-3'>
							Contact your college administration for login details
						</p>
						<button
							type='button'
							className='text-blue-600 hover:text-blue-800 text-sm font-semibold'
						>
							Contact Support
						</button>
					</div>

					{/* Back to Home */}
					<div className='text-center pt-4 border-t border-gray-200'>
						<p className='text-gray-600 text-sm'>
							Are you a student?{" "}
							<Link
								to='/'
								className='text-blue-600 hover:text-blue-800 font-semibold'
							>
								Go back to home
							</Link>
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className='text-center mt-8 text-gray-500 text-xs'>
					<p>© 2026 ResolveIt. All rights reserved.</p>
					<p className='mt-2'>
						🏢 Empowering departments to resolve complaints efficiently
					</p>
				</div>
			</div>
		</div>
	);
};

export default DepartmentLogin;
