import Image from 'next/image'
import Background from './components/Hero/Background'
import MiddleContent from './components/Navbar/MiddleContent'

export default function Home() {
  return (
    <>
  <Background/>
  <div className='flex flex-row'>
    <h3>Scenic Routes</h3>
    <h3>200+ houseboats</h3>
  </div>
    </>
  )
}
