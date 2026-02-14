import React from "react";

const AdminHeader = ({ adminName, collegeName }) => {
	return (
		<div className='rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='text-sm font-semibold uppercase tracking-wide text-slate-500'>
						Admin Console
					</p>
					<h1 className='text-2xl font-bold text-slate-900 sm:text-3xl'>
						Manage Students and Departments
					</h1>
				</div>
				<div className="flex gap-4">
					<button
						onClick={() => {
							localStorage.clear();
							window.location.reload();
						}}
						className='px-5 py-2.5 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-500 shadow-md hover:shadow-lg cursor-pointer'
						type='button'
					>
						Logout
					</button>
					<div className='text-sm text-slate-600'>
						<p className='font-semibold text-slate-800'>
							{adminName || "Administrator"}
						</p>
						<p className='text-slate-500'>
							College Access: {collegeName || ""}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminHeader;
