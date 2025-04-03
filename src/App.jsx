import { useState } from 'react'
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
// Pages
import HomePage from './Home'
import { Dashboard } from './Dashboard'

function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/Dashboard" element={<Dashboard />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
