import Background from './components/Hero/Background'
import Link from 'next/link';


export default async function Home() {
  return (
    <>
      <Background />
      <Link href="/boats">Boats</Link>
    </>
  );
}
456230.