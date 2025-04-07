import { useNavigate } from 'react-router-dom';
import './App.css'

const Gallery = () =>{
	
	const navigate = useNavigate();
	return (
		<>
		zaebis
			<a onClick={
		  navigate('/TelegramProfile')}>profile</a>
		</>
	);
}

export default Gallery;