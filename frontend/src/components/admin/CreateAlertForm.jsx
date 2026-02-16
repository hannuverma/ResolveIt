import React from "react";

const CreateAlertForm = ({
	formData,
	onChange,
	onSubmit,
	loading,
}) => {
	return (
		<form className='space-y-4' onSubmit={onSubmit}>

			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Alert message
				<textarea
					name='description'
					value={formData.description}
					onChange={onChange}
					placeholder='Electricity will be unavailable from 2-4 PM due to maintenance.'
					required
					rows={4}
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none'
				/>
			</label>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				estimated resolution time
				<input
					name='estimated_resolution_time'
                    type="datetime-local"
					value={formData.estimated_resolution_time}
					onChange={onChange}
					placeholder='Electricity will be unavailable from 2-4 PM due to maintenance.'
					required
					rows={4}
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none'
				/>
			</label>

			<button
				className='mt-3.5 w-full cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400'
				type='submit'
				disabled={loading}
			>
				{loading ? "Creating..." : "Create Alert"}
			</button>
		</form>
	);
};

export default CreateAlertForm;
