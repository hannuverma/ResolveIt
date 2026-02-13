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
				<div className='text-sm text-slate-600'>
					<p className='font-semibold text-slate-800'>
						{adminName || "Administrator"}
					</p>
					<p className='text-slate-500'>
						College Access: {collegeName || "All Colleges"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminHeader;
