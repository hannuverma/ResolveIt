import React, { useState, useMemo } from "react";

const AddDepartmentForm = ({
	formData,
	onChange,
	onSubmit,
	loading,
	departments,
	collegeName = "College", // Pass college name from parent
}) => {
	const [customValidity, setCustomValidity] = useState("");

	// Generate automatic username from department name and college name
	const generatedUsername = useMemo(() => {
		if (!formData.department_name) return "";
		
		// Remove spaces and convert to lowercase
		const deptFirstName = formData.department_name
			.split(" ")[0]
			.toLowerCase();
		const collegeNameFormatted = collegeName
			.replace(/\s+/g, "")
			.toLowerCase();
		
		return `${deptFirstName}@${collegeNameFormatted}.com`;
	}, [formData.department_name, collegeName]);

	const checkduplicate = (event) => {
		const code = event.target.value;
		const isDuplicate = departments.some((dept) => dept.code === code);
		if (isDuplicate) {
			event.target.setCustomValidity("Department code already exists.");
			setCustomValidity("Department code already exists.");
		} else {
			event.target.setCustomValidity("");
			setCustomValidity("");
		}
	};

	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			{/* Hidden input to include auto-generated username in form submission */}
			<input type='hidden' name='username' value={generatedUsername} onChange={() => {}} />

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

			<div className='grid gap-4 sm:grid-cols-2 mt-3.5'>
				<label className='space-y-1 text-sm font-medium text-slate-700'>
					Auto-Generated Username
					<input
						className='w-full rounded-xl border border-slate-200 bg-gray-100 px-3 py-2 text-sm text-slate-700 shadow-sm cursor-not-allowed'
						value={generatedUsername}
						disabled
						placeholder='username@collegename.com'
					/>
					<p className='text-xs text-slate-500 whitespace-nowrap'>
						This username is auto-generated from the department name
					</p>
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
				<label className='space-y-1 col-span-2 flex flex-col text-sm font-medium text-slate-700'>
					Department Code
					<input
						className=' rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none'
						name='code'
						type='text'
						value={formData.code}
						onChange={(event) => {
							onChange(event);
							checkduplicate(event);
						}}
						placeholder='Set a code for department'
						required
					/>
					{customValidity && (
						<p className='text-red-600 text-sm'>{customValidity}</p>
					)}
				</label>
			</div>
			<label className='space-y-1 text-sm font-medium text-slate-700'>
				Description
				<textarea
					className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none'
					name='description'
					value={formData.description || ""}
					onChange={onChange}
					placeholder='Short description of the department...'
					rows='3'
					maxLength={1000}
					required
				/>
				<p className='text-xs text-slate-500'>
					{(formData.description || "").length}/1000 characters
				</p>
			</label>
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
