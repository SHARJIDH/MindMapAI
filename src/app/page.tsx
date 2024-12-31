import React from 'react'
import Link from 'next/link'
import { signOut, signIn, auth } from "@/auth"
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Rocket } from 'lucide-react'
import Image from 'next/image'
import { ThemeSwitcher } from '@/components/theme-switcher'
import AnimatedBackground from '@/components/AnimatedBackground'

const page = async () => {
  const isAuth = await auth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AnimatedBackground />
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-950/70 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 text-xl">
          MindMapAI
        </span>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {isAuth && (
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <Button variant={'outline'} className="text-sm hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300" type="submit">
                <LogOut className="w-4 h-4 mr-2"/> Sign Out
              </Button>
            </form>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-16 sm:pt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-[55rem] mx-auto text-center">
            <h1 className="px-6 text-lg font-medium text-purple-600 dark:text-purple-400">Create Concept Maps with AI</h1>
            <div className="tracking-tighter mt-4 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
              Simplify Learning, Amplify Understanding With AI
            </div>

            <div className="px-8 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-center sm:px-0 sm:space-x-5 space-y-4 sm:space-y-0">
              {isAuth ? (
                <>
                  <Link href="/map" passHref>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-lg"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Explore Now
                    </Button>
                  </Link>

                  <Link href="/library" passHref>
                    <Button
                      variant={"outline"}
                      className="border-2 border-purple-500 text-purple-700 dark:text-purple-400 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 font-semibold py-6 px-8 rounded-xl shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 text-lg"
                    >
                      Library
                    </Button>
                  </Link>
                </>
              ) : (
                <form
                  action={async () => {
                    "use server"
                    await signIn()
                  }}
                >
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-lg"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in to get started
                  </Button>
                </form>
              )}
            </div>

            <p className="mt-10 mb-12 text-gray-600 dark:text-gray-400 font-medium">3 Free trials · No credit card required</p>
          </div>
        </div>

        <div className="pb-12 bg-transparent">
          <div className="relative">
            <div className="absolute inset-0 h-2/3"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto px-4">
                {/* Video component */}
                <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay={true}
                    loop  
                    playsInline
                    controls
                    muted={true}
                  >
                    <source src="/conceptmapai-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        {featureContent.map((feature, index) => (
          <ResearchHub 
            key={index} 
            feature={feature} 
            isReversed={index % 2 !== 0}
          />
        ))}
      </section>

      <section className="mt-10 border-2">
        <Footer />
      </section>
    </div>
  )
}

export default page

const featureContent = [
  {
    title: "Enhance Learning with YouTube Integration",
    description: `
      <p>
        Seamlessly embed <span class="font-semibold">YouTube videos</span> into your concept maps for a richer, interactive learning experience.
      </p>
    `,
    videoSrc: "/yt-demo.mp4",
    bgColor: "#FAF5FF",
  },
  {
    title: "Generate Blogs, Essays, and Summaries Instantly",
    description: `
    <p>
    Leverage the power of <span class="font-semibold">AI</span> to craft high-quality summaries, essays, and blogs directly from your concept maps.
    </p>
    `,
    videoSrc: "/blog-demo.mp4",
    bgColor: "#EFF6FF",
  },
  {
    title: "Discover New Concepts and Ideas",
    description: `
    <p>
    Utilize <span class="font-semibold">AI tools</span> to uncover fresh concepts and insights, expanding the possibilities of your concept maps.
    </p>
    `,
    videoSrc: "/term-demo.mp4",
    bgColor: "#F5F5F5",
  }
];

interface FeatureContent {
  title: string;
  description: string;
  videoSrc: string;
  bgColor: string;
}

interface ResearchHubProps {
  feature: FeatureContent;
  isReversed?: boolean;
}

function ResearchHub({ feature, isReversed = false }: ResearchHubProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-gray-950`}>
      <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Browser Window Mockup */}
        <div className={`relative w-full aspect-[16/10] bg-white dark:bg-gray-900 rounded-lg shadow-2xl dark:shadow-purple-900/10 overflow-hidden ${isReversed ? 'lg:col-start-2' : ''}`}>
          
          {/* Browser Content - Mind Map */}
          <div className="h-[calc(100%-2rem)] bg-white dark:bg-gray-900">
            <video 
              className="w-full h-full object-cover"
              autoPlay={true}
              loop  
              playsInline
              controls
              muted={true}
            >
              <source src={feature.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-6 ${isReversed ? 'lg:col-start-1' : ''}`}>
          <span className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">
            {feature.title}
          </span>
          <div className="text-lg text-gray-700 dark:text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: feature.description }} />
        </div>
      </div>
    </div>
  )
}

const navigation = {
  connect: [
    {
      name: 'Twitter',
      href: '',
    },
    {
      name: 'Github',
      href: 'https://github.com/SHARJIDH',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/shaik-sharjidh-51500122b/',
    },
  ],
 
}

const Footer = () => {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="mx-auto font-inter w-full max-w-7xl 2"
    >
      <h2 id="footer-heading" className="sr-only">
        MindMapAI
      </h2>
      <div className="mx-auto max-w-7xl px-2">
        <div className="flex flex-col justify-between lg:flex-row">
          <div className="space-y-8">
            <Image
              priority={true}
              unoptimized={true}
              width={100}
              height={40}
              src="/logo.png"
              alt="MindMapAI"
              className="w-[10rem] dark:invert"
            />
           
          </div>
          {/* Navigations */}
          <div className="mt-16 grid grid-cols-2 gap-14 md:grid-cols-2 lg:mt-0 xl:col-span-2">
            <div className="md:mt-0">
              <span className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                Connect
              </span>
              <div className="mt-6 space-y-4">
                {navigation.connect.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm leading-6 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div>
           
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 dark:border-gray-100/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-700 dark:text-gray-300">
          </p>
        </div>
      </div>
    </footer>
  )
}