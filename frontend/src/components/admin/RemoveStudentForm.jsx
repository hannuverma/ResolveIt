import React from "react";

const RemoveStudentForm = ({ formData, onChange, onSubmit, loading }) => {
	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Email
				<input
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-500 focus:outline-none'
					name='email'
					type='email'
					value={formData.email}
					onChange={onChange}
					placeholder='student@college.edu'
					required
				/>
			</label>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Roll No.
				<input
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-500 focus:outline-none'
					name='roll_no'
					value={formData.roll_no}
					onChange={onChange}
					placeholder='2024CS001'
					required
				/>
			</label>
			<button
				className='w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400 mt-3.5 cursor-pointer'
				type='submit'
				disabled={loading}
			>
				{loading ? "Removing..." : "Remove Student"}
			</button>
		</form>
	);
};

export default RemoveStudentForm;
``;
