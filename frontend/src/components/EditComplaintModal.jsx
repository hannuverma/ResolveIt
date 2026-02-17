import React from "react";

const EditComplaintModal = ({
	complaint,
	formData,
	onFormChange,
	handleImageChange,
	setFormData,
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
						</select>
					</div>

					{/* Image Upload (Optional) */}
					<div>
						<label
							htmlFor='image'
							className='block text-sm font-semibold text-gray-700 mb-2'
						>
							Upload Image{" "}
						</label>
						<div className='border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-50 transition-colors'>
							{formData.imagePreview ? (
								<div className='space-y-4'>
									<img
										src={formData.imagePreview}
										alt='Preview'
										className='h-32 mx-auto rounded-lg object-cover'
									/>
									<button
										type='button'
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												resolved_image: null,
												imagePreview: null,
											}))
										}
										className='text-sm text-red-600 hover:text-red-700 font-medium'
									>
										Remove Image
									</button>
								</div>
							) : (
								<div>
									<svg
										className='mx-auto h-12 w-12 text-green-500 mb-2'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={1.5}
											d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
									<p className='text-gray-600 font-medium mb-1'>
										Drag and drop your image here
									</p>
									<p className='text-gray-400 text-sm mb-3'>
										or click to browse
									</p>
									<input
										type='file'
										id='cameraInput'
										accept='image/*'
										capture='environment'
										className='hidden'
										onChange={handleImageChange}
									/>
									<input
										type='file'
										id='galleryInput'
										accept='image/*'
										className='hidden'
										onChange={handleImageChange}
									/>

									<div className='flex gap-3 justify-center'>
										<label
											htmlFor='cameraInput'
											className='px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer active:scale-95 transition-transform'
										>
											📷 Take Photo
										</label>
										<label
											htmlFor='galleryInput'
											className='px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer active:scale-95 transition-transform'
										>
											🖼 Gallery
										</label>
									</div>
								</div>
							)}
						</div>
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
