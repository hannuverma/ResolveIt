import React from "react";
import ComplaintCard from "./ComplaintCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

const ComplaintsList = ({
	complaints,
	loading,
	onEdit,
	getStatusColor,
	getPriorityColor,
}) => {
	if (loading) {
		return <LoadingState />;
	}

	if (complaints.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className='space-y-5'>
			{complaints.map((complaint) => (
				<ComplaintCard
					key={complaint.id}
					complaint={complaint}
					onEdit={onEdit}
					getStatusColor={getStatusColor}
					getPriorityColor={getPriorityColor}
				/>
			))}
		</div>
	);
};

export default ComplaintsList;
