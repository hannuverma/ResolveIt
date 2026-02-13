import React from "react";

const MessageAlert = ({ message, type = "error", position }) => {
	if (!message) return null;

	const typeStyles = {
		error: "bg-red-50 border-red-200 text-red-700",
		success: "bg-green-50 border-green-200 text-green-700",
	};

	const isCenter = position ? position === "center" : type === "success";

	if (isCenter) {
		return (
			<div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4'>
				<div
					className={`w-full max-w-md rounded-lg border p-4 shadow-xl ${typeStyles[type]}`}
				>
					<p className='font-medium text-center'>{message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`mb-6 p-4 border rounded-lg ${typeStyles[type]}`}>
			<p className='font-medium'>{message}</p>
		</div>
	);
};

export default MessageAlert;
