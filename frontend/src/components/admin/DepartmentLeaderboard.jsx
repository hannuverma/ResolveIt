import React, { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";

const DepartmentLeaderboard = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");


	

	useEffect(() => {
		let isActive = true;

		const loadDepartments = async () => {
			// const response = await api.get("/api/admin/getdepartments/");
			// if (departments && departments.length >= 0) {
			// 	setItems(response.data || []);
			// 	setLoading(false);
			// 	return;
			// }

			setLoading(true);
			setError("");
			try {
				const response = await api.get("/api/admin/getdepartments/");
				if (!isActive) return;
				setItems(response.data || []);
			} catch (err) {
				if (!isActive) return;
				setError("Failed to load leaderboard data.");
				console.error("Leaderboard fetch error:", err);
			} finally {
				if (isActive) setLoading(false);
			}
		};

		loadDepartments();

		return () => {
			isActive = false;
		};
	}, []);

	const rankedDepartments = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		return [...list]
			.sort((a, b) => {
				const pointsDiff = (b.reward_points || 0) - (a.reward_points || 0);
				if (pointsDiff !== 0) return pointsDiff;
				return (a.name || "").localeCompare(b.name || "");
			})
			.map((dept, index) => ({
				...dept,
				rank: index + 1,
			}));
	}, [items]);

	const topThree = rankedDepartments.slice(0, 3);

	if (loading) {
		return <p className='text-sm text-slate-500'>Loading leaderboard...</p>;
	}

	if (error) {
		return (
			<div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
				{error}
			</div>
		);
	}

	if (!rankedDepartments.length) {
		return (
			<p className='text-sm text-slate-500'>No departments available yet.</p>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-3'>
				{topThree.map((dept) => (
					<div
						key={dept.id || dept.name}
						className='rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col items-center text-center justify-end'
					>
						<p className='text-xs font-semibold uppercase text-slate-500'>
							Rank {dept.rank}
						</p>
						<h3 className='mt-2 text-lg font-semibold text-slate-900'>
							{dept.name}
						</h3>
						<p className='mt-1 text-sm text-slate-600'>
							Score: {dept.reward_points || 0}
						</p>
						<div
							style={{ height: `${dept.reward_points * 5 + 5}px` }}
							className={`w-1/2 rounded-t-md mt-2.5 ${dept.rank === 1 ? "bg-orange-600" : dept.rank === 2 ? "bg-orange-500" : "bg-yellow-400"}`}
						></div>
					</div>
				))}
			</div>

			<div className='overflow-hidden rounded-xl border border-slate-200'>
				<div className='grid grid-cols-[80px,1fr,120px] bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600'>
					<div>Rank</div>
					<div>Department</div>
					<div className='text-right'>score</div>
				</div>
				<div className='divide-y divide-slate-200'>
					{rankedDepartments.map((dept) => (
						<div
							key={`${dept.id || dept.name}-row`}
							className={`grid grid-cols-[80px,1fr,120px] px-4 py-3 text-sm text-slate-700 ${
								dept.rank <= 3 ? "bg-emerald-50/60" : "bg-white"
							}`}
						>
							<div className='font-semibold text-slate-900'>
								#{dept.rank}
							</div>
							<div>{dept.name}</div>
							<div className='text-right font-semibold'>
								{dept.reward_points || 0}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DepartmentLeaderboard;
