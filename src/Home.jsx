import './index.css'
import HeroSection from './sections/Home/hero';
import { useEffect } from 'react';
import WhyWee from './sections/Home/WhyWe';
import Header from './components/navbar';
import Reviews from './sections/Home/Reviews';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from './context/TelegramContext';


const HomePage = () => {
	return (
		<>
			<Header />
			<HeroSection />
			<WhyWee />
			<Reviews />
			<Footer />
		</>
	);
};

export default HomePage;