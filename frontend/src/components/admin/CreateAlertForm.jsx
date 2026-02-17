import React, { useState } from "react";

const CreateAlertForm = ({
	formData,
	onChange,
	onSubmit,
	loading,
}) => {
	const [days, setDays] = useState(formData.resolution_days || 0);
	const [hours, setHours] = useState(formData.resolution_hours || 0);

	const handleDaysChange = (e) => {
		const value = parseInt(e.target.value);
		setDays(value);
		onChange({ target: { name: 'resolution_days', value } });
	};

	const handleHoursChange = (e) => {
		const value = parseInt(e.target.value);
		setHours(value);
		onChange({ target: { name: 'resolution_hours', value } });
	};

	const getResolutionDisplay = () => {
		const parts = [];
		if (days > 0) {
			parts.push(`${days} day${days !== 1 ? 's' : ''}`);
		}
		if (hours > 0) {
			parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
		}
		return parts.length > 0 ? parts.join(' and ') : 'Immediate';
	};

	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Alert message
				<textarea
					name='message'
					value={formData.message}
					onChange={onChange}
					placeholder='Electricity will be unavailable from 2-4 PM due to maintenance.'
					required
					rows={4}
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none'
				/>
			</label>

			<div className='space-y-4 bg-amber-50 p-4 rounded-xl border border-amber-200'>
				<div>
					<label className='text-sm font-medium text-slate-700'>
						<div className='flex justify-between items-center mb-2'>
							<span>Estimated Resolution Time</span>
							<span className='text-amber-700 font-semibold'>{getResolutionDisplay()}</span>
						</div>
					</label>
					<p className='text-xs text-slate-500 mb-4'>Enter estimated time to resolve this issue</p>

					<div className='flex gap-4'>
						<div className='flex-1'>
							<label htmlFor='days-input' className='block text-sm text-slate-700 mb-2'>
								Days
							</label>
							<input
								id='days-input'
								type='number'
								min='0'
								value={days}
								onChange={handleDaysChange}
								className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none'
							/>
						</div>

						<div className='flex-1'>
							<label htmlFor='hours-input' className='block text-sm text-slate-700 mb-2'>
								Hours
							</label>
							<input
								id='hours-input'
								type='number'
								min='0'
								max='23'
								value={hours}
								onChange={handleHoursChange}
								className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none'
							/>
						</div>
					</div>
				</div>
			</div>

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
