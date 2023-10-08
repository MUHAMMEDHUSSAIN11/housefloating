import Background from './components/Hero/Background'
import ExperienceSection from './components/Hero/ExperienceSection';
import HowToBookSection from './components/Hero/HowToBookSection';
import WhySection from './components/Hero/WhySection';
import Categories from './components/Hero/Categories';
import Updated from './components/Hero/Updated';
import Footer from './components/Hero/Footer';
import Faq from './components/Hero/Faq';



export default async function Home() {
  return (
    <>
      <Background />
      <WhySection/>
      <ExperienceSection/>
      <HowToBookSection/>
      <Categories/>
      <Faq/>
      <Updated/>
      <Footer/>
    </>
  );
}
