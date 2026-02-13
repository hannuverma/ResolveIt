import React from "react";

const MessageAlert = ({ message, type = "error" }) => {
	if (!message) return null;

	const typeStyles = {
		error: "bg-red-50 border-red-200 text-red-700",
		success: "bg-green-50 border-green-200 text-green-700",
	};

	return (
		<div className={`mb-6 p-4 border rounded-lg ${typeStyles[type]}`}>
			<p className='font-medium'>{message}</p>
		</div>
	);
};

export default MessageAlert;
