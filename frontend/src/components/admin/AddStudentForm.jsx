import React from "react";

const AddStudentForm = ({ formData, onChange, onSubmit, loading }) => {
	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<div className='grid gap-4 sm:grid-cols-2'>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					Username
					<input
						className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none'
						name='username'
						value={formData.username}
						onChange={onChange}
						placeholder='student01'
						required
					/>
				</label>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					Roll No.
					<input
						className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none'
						name='roll_no'
						value={formData.roll_no}
						onChange={onChange}
						placeholder='2024CS001'
						required
					/>
				</label>
			</div>
			<div className='grid gap-4 sm:grid-cols-2'>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					First Name
					<input
						className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none'
						name='first_name'
						value={formData.first_name}
						onChange={onChange}
						placeholder='Aisha'
						required
					/>
				</label>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					Last Name
					<input
						className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none'
						name='last_name'
						value={formData.last_name}
						onChange={onChange}
						placeholder='Khan'
						required
					/>
				</label>
			</div>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Role
				<input
					className='w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700'
					value='STUDENT'
					readOnly
				/>
			</label>
			<button
				className='w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 mt-3.5 cursor-pointer'
				type='submit'
				disabled={loading}
			>
				{loading ? "Adding..." : "Add Student"}
			</button>
		</form>
	);
};

export default AddStudentForm;
