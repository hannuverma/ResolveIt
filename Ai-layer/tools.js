import { tool } from "@langchain/core/tools";
import axios from "axios";

export const getDepartmentsTool = tool(
	async ({ college }) => {
		const normalizedCollege = college.toLowerCase().replace(/\s+/g, "");
		// console.log("Tool Call → get_departments", normalizedCollege);

		try {
			const response = await axios.get(
				"http://localhost:8000/api/admin/getdepartments/?username=" + normalizedCollege,
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching departments:", error);

			return {
				departments: [],
			};
		}
	},
	{
		name: "get_departments",
		description:
			"Returns list of campus departments and their responsibilities for a given college",
		schema: {
			type: "object",
			properties: {
				college: {
					type: "string",
					description: "Name of the college or university",
				},
			},
			required: ["college"],
		},
	},
);
