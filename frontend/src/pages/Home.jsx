import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import PipelinePreview from '@/components/sections/PipelinePreview'
import TechStack from '@/components/sections/TechStack'
import WhyCreatorLoop from '@/components/sections/WhyCreatorLoop'
import CallToAction from '@/components/sections/CallToAction'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <PipelinePreview />
      <TechStack />
      <WhyCreatorLoop />
      <CallToAction />
    </>
  )
}
