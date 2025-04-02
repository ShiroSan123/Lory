import { useState } from 'react'
import './index.css'
// Pages
import HomePage from './Home'

function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<HomePage />
		</>
	)
}

export default App
