import React from "react";

const MessageAlert = ({ message, type = "error", position, onClose }) => {
	if (!message) return null;

	const typeStyles = {
		error: "bg-red-50 border-red-200 text-red-700",
		success: "bg-green-50 border-green-200 text-green-700",
	};

	const isCenter = position ? position === "center" : type === "success";

	if (isCenter) {
		return (
			<div className='fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4'>
				<div
					className={`w-full max-w-md rounded-lg border p-5 shadow-xl ${typeStyles[type]}`}
				>
					<p className='font-medium text-center'>{message}</p>
					{onClose ? (
						<div className='mt-4 flex justify-center'>
							<button
								type='button'
								onClick={onClose}
								className='rounded-md border border-current px-4 py-1.5 text-sm font-semibold hover:bg-green-900 hover:text-white transition duration-200 cursor-pointer'
							>
								OK
							</button>
						</div>
					) : null}
				</div>
			</div>
		);
	}

	return (
		<div className={`mb-6 rounded-lg border p-4 ${typeStyles[type]}`}>
			<p className='font-medium'>{message}</p>
			{onClose ? (
				<button
					type='button'
					onClick={onClose}
					className='mt-3 rounded-md border border-current px-3 py-1 text-sm font-semibold '
				>
					OK
				</button>
			) : null}
		</div>
	);
};

export default MessageAlert;
