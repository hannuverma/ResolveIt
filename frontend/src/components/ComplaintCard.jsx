import React from "react";

const ComplaintCard = ({
	complaint,
	onEdit,
	getStatusColor,
	getPriorityColor,
}) => {
	return (
		<div className='bg-white rounded-2xl shadow-md hover:shadow-lg border-2 border-blue-100 p-6 transition-all hover:border-blue-300'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4'>
				<div className='flex-1'>
					<h3 className='text-xl font-bold text-blue-900 mb-2'>
						{complaint.title}
					</h3>
					<p className='text-gray-600 text-sm line-clamp-2'>
						{complaint.description}
					</p>
				</div>
				<div className='flex gap-2 flex-wrap'>
					<span
						className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
							complaint.status || "pending",
						)}`}
					>
						{(complaint.status || "pending")
							.replace("_", " ")
							.toUpperCase()}
					</span>
					<span
						className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
							complaint.priority || "medium",
						)}`}
					>
						{(complaint.priority || "medium").toUpperCase()}
					</span>
				</div>
			</div>

			{/* Image if available */}
			{complaint.image && (
				<div className='mb-4'>
					<img
						src={complaint.image}
						alt={complaint.title}
						className='h-40 rounded-lg object-contain w-full'
					/>
				</div>
			)}

			{/* Details Grid */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm'>
				{complaint.department && (
					<div>
						<p className='text-gray-500 text-xs font-medium uppercase'>
							Department
						</p>
						<p className='text-gray-700 font-semibold capitalize'>
							{complaint.department}
						</p>
					</div>
				)}
				<div>
					<p className='text-gray-500 text-xs font-medium uppercase'>
						Submitted
					</p>
					<p className='text-gray-700 font-semibold'>
						{new Date(complaint.created_at).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
				{complaint.updated_at && (
					<div>
						<p className='text-gray-500 text-xs font-medium uppercase'>
							Updated
						</p>
						<p className='text-gray-700 font-semibold'>
							{new Date(complaint.updated_at).toLocaleDateString(
								"en-US",
								{
									year: "numeric",
									month: "short",
									day: "numeric",
								},
							)}
						</p>
					</div>
				)}
				<div>
					<p className='text-gray-500 text-xs font-medium uppercase'>
						Student ID
					</p>
					<p className='text-gray-700 font-semibold'>
						{complaint.roll_no || "N/A"}
					</p>
				</div>
			</div>

			{/* Feedback Display */}
			{complaint.group_average_rating && (
				<div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
					<p className='text-sm text-blue-700 font-medium mb-1'>
						Department Feedback
					</p>
					<p className='text-xs text-gray-500 mt-2'>
						Rating: {complaint.group_average_rating !== null && complaint.group_average_rating !== undefined ? complaint.group_average_rating : complaint.group_average_rating}/5 ⭐
					</p>
				</div>
			)}

			{/* Edit Button */}
			<button
				onClick={() => onEdit(complaint)}
				className=' cursor-pointer w-full mt-4 px-4 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
			>
				<svg
					className='w-5 h-5'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
					/>
				</svg>
				Update Complaint
			</button>
		</div>
	);
};

export default ComplaintCard;
