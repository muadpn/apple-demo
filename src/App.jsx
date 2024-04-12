import React from 'react'

import Hero from './components/Hero'
import Highlights from './components/Highlights'
import NavBar from './components/NavBar'
import Model from './components/Model'
import Features from './components/Features'

import * as Sentry from '@sentry/react'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

const App = () => {
  console.log('I have rerendered')
  return (
    <main className='bg-black'>
      <NavBar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}

export default Sentry.withProfiler(App)
