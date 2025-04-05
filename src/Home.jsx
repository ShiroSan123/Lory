import './index.css'
import HeroSection from './sections/Home/hero';
import WhyWee from './sections/Home/WhyWe';
import Header from './components/navbar';
import Reviews from './sections/Home/Reviews';
import Footer from './components/Footer';

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