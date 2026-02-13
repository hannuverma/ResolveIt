import React from "react";

const AdminFormCard = ({ title, description, children, footer }) => {
	return (
		<div className='flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
			<div className='mb-4'>
				<h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
				{description ? (
					<p className='mt-1 text-sm text-slate-500'>{description}</p>
				) : null}
			</div>
			<div className='flex-1'>{children}</div>
			{footer ? <div className='mt-4'>{footer}</div> : null}
		</div>
	);
};

export default AdminFormCard;
