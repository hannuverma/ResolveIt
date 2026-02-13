import React from "react";

const EmptyState = () => {
	return (
		<div className='bg-white rounded-2xl shadow-lg p-16 border-2 border-blue-200 text-center'>
			<svg
				className='h-16 w-16 text-blue-300 mx-auto mb-4'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={1.5}
					d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
				/>
			</svg>
			<p className='text-gray-600 text-xl font-medium'>
				No complaints for your department yet
			</p>
			<p className='text-gray-400 text-sm mt-2'>
				Complaints will appear here as they are submitted
			</p>
		</div>
	);
};

export default EmptyState;
