import { tool } from "@langchain/core/tools";

export const getDepartmentsTool = tool(
	async () => {
		try {
			const response = await fetch("http://localhost:8000/api/departments/");
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching departments:", error);
			return { departments: [] };
		}
	},
	{
		name: "get_departments",
		description:
			"Returns list of campus departments and their responsibilities",
	},
);
