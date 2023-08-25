import Background from './components/Hero/Background'
import Link from 'next/link';
import Wsection from './components/Hero/Wsection';



export default async function Home() {
  return (
    <>
      <Background />
      {/* <Link href="/boats">Boats</Link> */}
      <Wsection/>

    </>
  );
}
