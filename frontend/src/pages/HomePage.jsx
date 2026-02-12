import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";

const HomePage = () => {
	const navigate = useNavigate();

	return (
		<div className='w-full min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8'>
			<div className='w-full max-w-4xl'>
				{/* Navigation Header */}
				<div className='flex justify-center items-center mb-12'>
					<div className='flex items-center gap-3'>
						<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
							<img src={Logo} alt='ResolveIt Logo' className='w-15' />
						</div>
						<h2 className='text-2xl font-bold text-gray-800'>
							ResolveIt
						</h2>
					</div>
				</div>

				{/* Hero Section */}
				<div className='text-center mb-3'>
					<h1 className='text-5xl md:text-6xl font-bold text-gray-800 mb-4'>
						Welcome to <span className='text-green-600'>ResolveIt</span>
					</h1>
					<p className='text-xl text-gray-600 mb-2'>
						Your Centralized Complaint Management System
					</p>
					<p className='text-gray-500'>
						Transparent, Efficient, and Student-Centric Solutions
					</p>
				</div>


				{/* Main Login Options */}
				<div className='grid md:grid-cols-2 gap-8 max-w-2xl mx-auto'>
					{/* Student Login Card */}
					<div
						onClick={() => navigate("/login")}
						className='bg-white rounded-2xl shadow-xl p-8 border-2 border-green-500 hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 transform'
					>
						<div className='text-6xl mb-6 text-center'>👨‍🎓</div>
						<h2 className='text-2xl font-bold text-gray-800 mb-3 text-center'>
							Student Login
						</h2>
						<p className='text-gray-600 text-center mb-6'>
							Submit complaints, track status, and provide feedback on
							your resolved issues
						</p>
						<button
							onClick={() => navigate("/login")}
							className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200'
						>
							Login as Student
						</button>
						<p className='text-gray-500 text-xs text-center mt-4'>
							✓ Easy complaint submission
							<br />
							✓ Real-time tracking
							<br />✓ Feedback & ratings
						</p>
					</div>

					{/* Department/Admin Login Card */}
					<div
						onClick={() => navigate("/department-login")}
						className='bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 transform'
					>
						<div className='text-6xl mb-6 text-center'>🏢</div>
						<h2 className='text-2xl font-bold text-gray-800 mb-3 text-center'>
							Department Login
						</h2>
						<p className='text-gray-600 text-center mb-6'>
							Manage complaints, assign to teams, and track resolution
							progress
						</p>
						<button
							onClick={() => navigate("/department-login")}
							className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200'
						>
							Login as Department
						</button>
						<p className='text-gray-500 text-xs text-center mt-4'>
							✓ Complaint management
							<br />
							✓ Team assignment
							<br />✓ Analytics & reports
						</p>
					</div>
				</div>

				{/* Bottom Info */}
				<div className='text-center mt-12 text-gray-600'>
					<p className='mb-4'>
						♻️ Help us create a better campus environment through
						transparent complaint management
					</p>
					<p className='text-sm text-gray-500'>
						© 2026 ResolveIt. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
