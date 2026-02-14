import { tool } from "@langchain/core/tools";

export const getDepartmentsTool = tool(
	async () => {
		console.log("Tool Call → Fetching departments");
		try {
			const response = await fetch("http://localhost:8000/api/departments/");
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching departments:", error);
			return { departments: [] };
		}
	},
	// Later replace with real Django API call
	// 	return {
	// 		departments: [
	// 			{
	// 				name: "Plumbing Department",
	// 				description:
	// 					"Handles water-related issues such as leakages, taps, pipes, drainage, and water supply problems.",
	// 			},
	// 			{
	// 				name: "Electrical Department",
	// 				description:
	// 					"Handles electricity-related issues including lights, fans, AC, power failures, and electrical faults.",
	// 			},
	// 			{
	// 				name: "Sanitation Department",
	// 				description:
	// 					"Responsible for waste management, garbage collection, cleanliness, and hygiene-related issues.",
	// 			},
	// 			{
	// 				name: "Civil / Infrastructure Department",
	// 				description:
	// 					"Handles structural and infrastructure issues like damaged furniture, walls, doors, and facilities.",
	// 			},
	// 		],
	// 	};
	// },
	{
		name: "get_departments",
		description:
			"Returns list of campus departments and their responsibilities",
	},
);
