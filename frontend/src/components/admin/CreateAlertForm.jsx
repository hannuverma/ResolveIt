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
					<label className='space-y-2 text-sm font-medium text-slate-700'>
						<div className='flex justify-between items-center'>
							<span>Resolution Time</span>
							<span className='text-amber-700 font-semibold'>{getResolutionDisplay()}</span>
						</div>
					</label>
					<p className='text-xs text-slate-500 mb-3'>Set estimated time to resolve this issue</p>

					{/* Days Slider */}
					<div className='mb-4'>
						<div className='flex justify-between items-center mb-2'>
							<label htmlFor='days-slider' className='text-sm text-slate-700'>
								Days
							</label>
							<span className='text-lg font-semibold text-amber-700'>{days}</span>
						</div>
						<input
							id='days-slider'
							type='range'
							min='0'
							max='30'
							value={days}
							onChange={handleDaysChange}
							className='w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600'
						/>
						<div className='flex justify-between text-xs text-slate-500 mt-1'>
							<span>0 days</span>
							<span>30 days</span>
						</div>
					</div>

					{/* Hours Slider */}
					<div>
						<div className='flex justify-between items-center mb-2'>
							<label htmlFor='hours-slider' className='text-sm text-slate-700'>
								Additional Hours
							</label>
							<span className='text-lg font-semibold text-amber-700'>{hours}</span>
						</div>
						<input
							id='hours-slider'
							type='range'
							min='0'
							max='23'
							value={hours}
							onChange={handleHoursChange}
							className='w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600'
						/>
						<div className='flex justify-between text-xs text-slate-500 mt-1'>
							<span>0 hours</span>
							<span>23 hours</span>
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
