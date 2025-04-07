import { useNavigate } from 'react-router-dom';
import './App.css'

const Gallery = () =>{

	const navigate = useNavigate();
	return (
		<>
		zaebis
		<br></br>
			<button onClick={
		  navigate('/TelegramProfile')}>ProfileClick</button>
		</>
	);
}

export default Gallery;