import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { NotFound } from './pages/404'
import { Home } from './pages/home'
import { Redirect } from './pages/redirect'
import 'react-toastify/dist/ReactToastify.css'

export function AppRoutes() {
	return (
		<BrowserRouter>
			<ToastContainer position="bottom-right" autoClose={5000} />
			<Routes>
				<Route index element={<Home />} />
				<Route path="/:short-url" element={<Redirect />} />
				<Route path="*" element={<NotFound />} />
				<Route path="/404" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
