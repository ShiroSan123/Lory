import './index.css'
import HeroSection from './sections/Home/hero';
import { Navbar } from './components/navbar';
import WhyWe from './sections/Home/WhyWe';
import Reviews from './sections/Home/Reviews';

const HomePage = () => {
	return (
		<>
			<Navbar />
			<HeroSection />
			<WhyWe />
			<Reviews />
		</>
	);
};

export default HomePage;