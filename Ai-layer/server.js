import express from "express";
import callModel from "./index.js";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/analyze_complaint/", async (req, res) => {
	const { description, college } = req.body;
	const AIresponse = await callModel({
		messages: [{ role: "user", content: description }],
		college: college,
	});
	res.json(AIresponse);
});

app.listen(PORT, () => {
	console.log(`AI Layer server running on port ${PORT}`);
});
