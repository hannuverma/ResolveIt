import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login.jsx"
import StudentDashboard from "./pages/StudentDashboard.jsx"
import ProtectedRoute from './components/ProtectedRoutes'

const App = () => {
  return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<Login />} path='/login' />
					<Route
            path='/'
						element={
							<ProtectedRoute>
								<StudentDashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
  );
}

export default App
