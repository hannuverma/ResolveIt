import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import DepartmentLogin from "./pages/DepartmentLogin.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<HomePage />} path='/' />
					<Route element={<Login />} path='/login' />
					<Route element={<DepartmentLogin />} path='/department-login' />
					<Route
						path='/student-dashboard'
						element={
							<ProtectedRoute>
								<StudentDashboard />
							</ProtectedRoute>
						}
					/>
					<Route path='/studentDashboard' element={<StudentDashboard />} />
					<Route
						path='/admin'
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
