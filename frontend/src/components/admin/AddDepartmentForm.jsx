import React from "react";

const AddDepartmentForm = ({ formData, onChange, onSubmit, loading }) => {
	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Department Name
				<input
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none'
					name='department_name'
					value={formData.department_name}
					onChange={onChange}
					placeholder='Computer Science'
					required
				/>
			</label>
			<div className='grid gap-4 sm:grid-cols-2'>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					Department Username
					<input
						className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none'
						name='username'
						value={formData.username}
						onChange={onChange}
						placeholder='cs_dept'
						required
					/>
				</label>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					Password
					<input
						className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none'
						name='password'
						type='password'
						value={formData.password}
						onChange={onChange}
						placeholder='Set a secure password'
						required
					/>
				</label>
			</div>
			<button
				className='w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 mt-1.5 cursor-pointer'
				type='submit'
				disabled={loading}
			>
				{loading ? "Adding..." : "Add Department"}
			</button>
		</form>
	);
};

export default AddDepartmentForm;
