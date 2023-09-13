import Background from './components/Hero/Background'
import Link from 'next/link';
import ExperienceSection from './components/Hero/ExperienceSection';
import HowToBookSection from './components/Hero/HowToBookSection';
import WhySection from './components/Hero/WhySection';




export default async function Home() {
  return (
    <>
      <Background />
      {/* <Link href="/boats">Boats</Link> */}
      <WhySection/>
      <ExperienceSection/>
      <HowToBookSection/>
    </>
  );
}
