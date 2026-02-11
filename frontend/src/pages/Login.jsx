import React, { useState } from "react";
import api from "../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import Logo from "../assets/images/logo.png";


const Login = () => {
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
			console.log("Login response:", response.data);
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      navigate("/");
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
		<div
			id='login'
			className='w-full h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8'
		>
			<div className='w-full max-w-md'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-1'>
						<img src={Logo} alt="ResolveIt Logo" className="w-30" />
					</div>
					<h1 className='text-3xl font-bold text-gray-800 mb-2'>
						ResolveIt
					</h1>
					<p className='text-gray-600 text-sm'>
						Sign in to your account
					</p>
				</div>

				{/* Form Card */}
				<div className='bg-white rounded-2xl shadow-lg p-8 border-2 border-green-600'>
					{/* Error Message */}
					{error && (
						<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
							<p className='text-red-700 text-sm font-medium'>
								{error}
							</p>
						</div>
					)}

					{/* Success Message */}
					{success && (
						<div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
							<p className='text-green-700 text-sm font-medium'>
								{success}
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* username Input */}
						<div>
							<label
								htmlFor='username'
								className='block text-sm font-semibold text-gray-700 mb-2'
							>
								username Address
							</label>
							<input
								type='username'
								id='username'
								name='username'
								value={formData.username}
								onChange={handleChange}
								required
								placeholder='you@example.com'
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400'
							/>
						</div>

						{/* Password Input */}
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-semibold text-gray-700 mb-2'
							>
								Password
							</label>
							<input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								required
								placeholder='••••••••'
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400'
							/>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='w-full mt-8 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
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
									Signing in...
								</span>
							) : (
								"Sign In"
							)}
						</button>
					</form>
				</div>

				{/* Sustainability Message */}
				<div className='mt-8 px-4 py-3  rounded-lg text-center'>
					<p className='text-white text-xs font-medium'>
						♻️ ResolveIt - Sustainable Solutions for a Better
						Tomorrow
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
