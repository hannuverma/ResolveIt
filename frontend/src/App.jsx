import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login.jsx"
import StudentDashboard from "./pages/StudentDashboard.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import ProtectedRoute from './components/ProtectedRoutes'
import NotFound from './pages/NotFound.jsx'

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
					<Route
            path='/admin'
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
          <Route path='*' element={<NotFound/>}/>
				</Routes>
			</BrowserRouter>
		</>
  );
}

export default App
