import React from "react";

const DepartmentHeader = ({ department, college, complaintCount }) => {
	return (
		<div className='mb-8'>
			<div className='bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200'>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-4xl font-bold text-blue-900 mb-2'>
							{department || "Department Dashboard"}
						</h1>
						<p className='text-lg text-blue-700 font-semibold'>
							📚 {college}
						</p>
					</div>
					<div className='flex items-center gap-4'>
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
						<div className='flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-lg border border-blue-200'>
							<svg
								className='w-6 h-6 text-blue-600'
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
							<div>
								<p className='text-xs text-blue-600 uppercase tracking-wide'>
									Total Complaints
								</p>
								<p className='text-2xl font-bold text-blue-900'>
									{complaintCount}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DepartmentHeader;
