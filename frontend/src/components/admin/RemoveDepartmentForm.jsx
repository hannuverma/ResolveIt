import React from "react";

const RemoveDepartmentForm = ({ formData, onChange, onSubmit, loading }) => {
	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Department Username
				<input
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none'
					name='username'
					value={formData.username}
					onChange={onChange}
					placeholder='cs_dept'
					required
				/>
			</label>
			<button
				className='w-full rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400 mt-3.5 cursor-pointer'
				type='submit'
				disabled={loading}
			>
				{loading ? "Removing..." : "Remove Department"}
			</button>
		</form>
	);
};

export default RemoveDepartmentForm;
