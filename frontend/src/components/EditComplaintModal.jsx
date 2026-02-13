import React from "react";

const EditComplaintModal = ({
	complaint,
	formData,
	onFormChange,
	onSave,
	onClose,
	loading,
}) => {
	if (!complaint) return null;

	return (
		<div className='fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-2 border-2 border-blue-300'>
				<h2 className='text-2xl font-bold text-blue-900 mb-2'>
					Edit Complaint
				</h2>
				<p className='text-gray-600 text-sm mb-6'>{complaint.title}</p>

				<div className='space-y-3'>
					{/* Status Field */}
					<div>
						<label
							htmlFor='status'
							className='block text-sm font-semibold text-gray-700 mb-2'
						>
							Status
						</label>
						<select
							id='status'
							name='status'
							value={formData.status}
							onChange={onFormChange}
							className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black'
						>
							<option value='pending'>Pending</option>
							<option value='in_progress'>In Progress</option>
							<option value='resolved'>Resolved</option>
							<option value='closed'>Closed</option>
						</select>
					</div>

					{/* Feedback Field */}
					<div>
						<label
							htmlFor='feedback'
							className='block text-sm font-semibold text-gray-700 mb-2'
						>
							Department Response/Feedback
						</label>
						<textarea
							id='feedback'
							name='feedback'
							value={formData.feedback}
							onChange={onFormChange}
							placeholder='Provide feedback or response to the complaint...'
							rows='5'
							className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-black'
							maxLength={1000}
						/>
						<p className='text-xs text-gray-500 mt-1'>
							{formData.feedback.length}/1000 characters
						</p>
					</div>

					{/* Original Details */}
					<div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
						<p className='text-xs text-blue-600 uppercase tracking-wide font-semibold mb-2'>
							Original Complaint
						</p>
						<p className='text-gray-700 text-sm mb-2'>
							{complaint.description}
						</p>
						<p className='text-xs text-gray-500'>
							Submitted:{" "}
							{new Date(complaint.created_at).toLocaleDateString()}
						</p>
					</div>

					{/* Buttons */}
					<div className='flex gap-3 pt-4 border-t border-gray-200'>
						<button
							onClick={onClose}
							className='flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
						<button
							onClick={onSave}
							disabled={loading}
							className='flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg'
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditComplaintModal;
