import React from "react";

const StudentProfileHeader = ({ firstName, lastName, onChangePassword }) => {
	return (
		<div className='mb-6 bg-white rounded-2xl shadow-lg border border-green-100 p-6'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<div className='w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg'>
						{firstName?.[0] || "S"}
						{lastName?.[0] || "D"}
					</div>
					<div>
						<p className='text-sm text-gray-500'>Welcome</p>
						<h2 className='text-2xl font-bold text-gray-800'>
							{firstName} {lastName}
						</h2>
					</div>
				</div>
				<button
					onClick={onChangePassword}
					className='px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg'
					type='button'
				>
					Change Password
				</button>
			</div>
		</div>
	);
};

export default StudentProfileHeader;
