import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import DepartmentLogin from "./pages/DepartmentLogin.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes";
import NotFound from "./pages/NotFound.jsx";
import DepartmentDashboard from "./pages/DepartmentDashboard.jsx";

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
					<Route
						path='/department-dashboard'
						element={
							<ProtectedRoute>
								<DepartmentDashboard />
							</ProtectedRoute>
						}
					/>
					{/* <Route path='/department-dashboard' element={<DepartmentDashboard />} /> */}
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
