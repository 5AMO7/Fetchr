import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  EnvelopeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/solid'
import { useRef, useEffect, useState } from 'react'
import * as Motion from 'motion/react'

const features = [
  {
    name: 'Smart Lead Discovery',
    description: 'Find high-quality leads with our advanced search algorithms and data intelligence.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Smart Email Templates',
    description: 'Create professional email templates with dynamic placeholders and AI-powered content enhancement.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Email Campaigns',
    description: 'Create and send personalized email campaigns that convert.',
    icon: EnvelopeIcon,
  },
  {
    name: 'Analytics & Insights',
    description: 'Track performance and gain insights with detailed analytics and reports.',
    icon: ChartBarIcon,
  },
  {
    name: 'Secure & Reliable',
    description: 'Enterprise-grade security to keep your data safe and secure.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Lightning Fast',
    description: 'Optimized for speed and performance to keep your workflow smooth.',
    icon: BoltIcon,
  },
]

const aboutStats = [
  {
    number: 500,
    suffix: '+',
    label: 'Businesses Trust Us',
    description: 'Companies in the Baltics use our platform to grow their business'
  },
  {
    number: 200000,
    suffix: '+',
    label: 'Leads Generated',
    description: 'High-quality prospects discovered and delivered'
  },
  {
    number: 95,
    suffix: '%',
    label: 'Customer Satisfaction',
    description: 'Our users love the results they get with our platform'
  },
  {
    number: 24,
    suffix: '/7',
    label: 'Support Available',
    description: 'We\'re here to help you succeed whenever you need us'
  }
]

// Split text entry animation component
function SplitText({ text, className = "", delay = 0.1 }) {
  const words = text.split(' ')
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay
      }
    }
  }
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  }

  return (
    <Motion.motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <Motion.motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', marginRight: '0.25rem' }}
        >
          {word}
        </Motion.motion.span>
      ))}
    </Motion.motion.p>
  )
}

// Wavy text animation component
function WavyText({ text, className = "", delay = 0.2 }) {
  const letters = Array.from(text)
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: delay
      }
    }
  }
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 15,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  }

  return (
    <Motion.motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <Motion.motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </Motion.motion.span>
      ))}
    </Motion.motion.span>
  )
}

// Scroll-triggered wavy text component
function ScrollWavyText({ text, className = "", delay = 0.2 }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)
  const letters = Array.from(text)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isInView])

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: delay
      }
    }
  }
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  }

  return (
    <Motion.motion.h2
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {letters.map((letter, index) => (
        <Motion.motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </Motion.motion.span>
      ))}
    </Motion.motion.h2>
  )
}

// Scroll-triggered split text component
function ScrollSplitText({ text, className = "", delay = 0.5 }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)
  const words = text.split(' ')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isInView])

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay
      }
    }
  }
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  }

  return (
    <Motion.motion.p
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <Motion.motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', marginRight: '0.25rem' }}
        >
          {word}
        </Motion.motion.span>
      ))}
    </Motion.motion.p>
  )
}

// Simple scroll-triggered entrance animation
function ScrollAnimatedElement({ children, delay = 1.2, className = "" }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isInView])

  return (
    <Motion.motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: delay
        }
      } : { opacity: 0, y: 30 }}
    >
      {children}
    </Motion.motion.div>
  )
}

// Scroll-triggered card animation component
function ScrollAnimatedCard({ children, delay = 0, className = "" }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isInView])

  return (
    <Motion.motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: delay
        }
      } : { opacity: 0, y: 50 }}
    >
      {children}
    </Motion.motion.div>
  )
}

// Counter component for animated numbers
function AnimatedCounter({ number, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isInView])

  useEffect(() => {
    if (isInView) {
      let startTime
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Use easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(number * easeOutQuart))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(number)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, number, duration])

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toString()
  }

  return (
    <span ref={ref}>
      {number >= 1000 ? formatNumber(count) : count}{suffix}
    </span>
  )
}

const pricingPlans = [
  {
    name: 'Starter',
    price: '$2.99',
    period: 'per month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 1,000 leads per month',
      'Basic email templates',
      'Standard support',
      'Core integrations',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$5.99',
    period: 'per month',
    description: 'Best for growing businesses',
    features: [
      'Up to 10,000 leads per month',
      'Advanced email campaigns',
      'Priority support',
      'All integrations',
      'Advanced analytics',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations',
    features: [
      'Unlimited leads',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
      'Advanced security',
      'Custom training',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function LandingPage() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
        <div className="absolute inset-0 overflow-x-hidden">
            <div className="absolute top-20 left-10 w-1/3 h-1/3 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
            <div className="absolute -top-20 right-10 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-56 left-20 w-1/3 h-1/2 bg-emerald-400 rounded-4xl mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-52 left-2/3 w-1/2 h-full bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-7000"></div>
        </div>

        <div className='w-full h-full backdrop-blur-[200px]'>
            <nav className="w-full sticky top-0 z-50 backdrop-blur-sm">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center">
                                <img src="/fetchr-logo.svg" alt="Fetchr" className="h-10" />
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-text-primary px-3 py-2 text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-300">
                                    Features
                                </button>
                                <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-text-primary px-3 py-2 text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-300">
                                    Pricing
                                </button>
                                <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-text-primary px-3 py-2 text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-300">
                                    About
                                </button>
                                <Link to="/login" className="text-gray-600 hover:text-text-primary px-3 py-2 text-sm font-medium transition-all duration-300">
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-[#157145] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0f5533] transition-colors duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <Link
                                to="/signup"
                                className="bg-[#157145] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0f5533] transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="w-full h-full relative"> 
                {/* Content */}
                <div className="w-full h-full relative z-10">
                    <div className="text-center p-8 py-40">
                        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
                            <WavyText 
                                text="Find, Engage, and Convert" 
                                className=""
                                delay={0.2}
                            />
                            <WavyText 
                                text="High-Quality Leads" 
                                className="text-[#157145] block"
                                delay={0.5}
                            />
                        </h1>
                        <SplitText 
                            text="Transform your lead generation with our intelligent platform. Discover prospects, create personalized campaigns, and scale your business like never before."
                            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                            delay={0.8}
                        />
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ScrollAnimatedElement delay={1.0}>
                                <Link
                                    to="/signup"
                                    className="bg-[#157145] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0f5533] transition-colors duration-300 inline-flex items-center justify-center"
                                >
                                    Get Started Free
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                            </ScrollAnimatedElement>
                            <ScrollAnimatedElement delay={1.1}>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="bg-white text-[#157145] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors border border-[#157145] duration-300 inline-flex items-center justify-center"
                                >
                                    Learn More
                                </button>
                            </ScrollAnimatedElement>
                        </div>
                        <ScrollAnimatedElement delay={1.2}>
                            <p className="text-sm text-gray-500 mt-4">
                                No credit card required • 14-day free trial • Cancel anytime
                            </p>
                        </ScrollAnimatedElement>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full py-20">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <ScrollWavyText 
                            text="Everything you need to grow your business"
                            className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
                            delay={0.2}
                        />
                        <ScrollSplitText 
                            text="Powerful features designed to help you find, engage, and convert more leads efficiently."
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                            delay={0.1}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <ScrollAnimatedCard 
                                key={feature.name} 
                                delay={index * 0.1}
                                className="bg-slate-50 p-8 rounded-xl border border-border-medium hover:shadow-lg transition-shadow cursor-default"
                            >
                                <div className="flex items-center mb-4">
                                    <feature.icon className="h-5 w-5 text-[#157145]" />
                                    <h3 className="text-xl font-semibold text-text-primary ml-3">
                                        {feature.name}
                                    </h3>
                                </div>
                                <p className="text-text-secondary-dark">
                                    {feature.description}
                                </p>
                            </ScrollAnimatedCard>
                        ))}
                    </div>
                </div>
            </section>

        </div>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 pt-10">
            <div className='w-full flex items-center justify-center mb-28'>
                <div className='w-1/2 h-[2px] bg-border-medium rounded-full'></div>
            </div>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <ScrollWavyText 
                        text="Simple, transparent pricing"
                        className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
                        delay={0.2}
                    />
                    <ScrollSplitText 
                        text="Choose the plan that's right for your business. All plans include a 14-day free trial."
                        className="text-xl text-text-secondary max-w-2xl mx-auto"
                        delay={0.1}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <ScrollAnimatedCard
                            key={plan.name}
                            delay={index * 0.15}
                            className={`bg-stone-50 rounded-xl shadow-lg p-8 relative flex flex-col justify-end ${
                            plan.popular ? 'ring-2 ring-[#157145]' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-[#157145] text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                                    <span className="text-gray-600 ml-1">{plan.period}</span>
                                </div>
                                <p className="text-gray-600 mb-8">{plan.description}</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/signup"
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-center block transition-colors mt-auto ${
                                    plan.popular
                                    ? 'bg-[#157145] text-white hover:bg-[#0f5533]'
                                    : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </ScrollAnimatedCard>
                    ))}
                </div>
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-20 pt-10">
            <div className='w-full flex items-center justify-center mb-28'>
                <div className='w-1/2 h-[2px] bg-border-medium rounded-full'></div>
            </div>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <ScrollWavyText 
                        text="Our Mission"
                        className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
                        delay={0.2}
                    />
                    <ScrollSplitText 
                        text="We believe every business deserves access to high-quality leads without the complexity. That's why we built Fetchr - to democratize lead generation and help businesses of all sizes grow faster."
                        className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
                        delay={0.1}
                    />
                    <ScrollSplitText 
                        text="Founded by a team of sales and marketing experts who were frustrated with existing tools, we're passionate about making lead generation simple, effective, and accessible to everyone."
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        delay={0.3}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    {aboutStats.map((stat, index) => (
                    <div key={index} className="text-center cursor-default">
                        <div className="bg-white p-6 rounded-xl border border-border-medium shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-3xl md:text-4xl font-bold text-[#157145] mb-2">
                                <AnimatedCounter 
                                    number={stat.number} 
                                    suffix={stat.suffix}
                                    duration={2000 + index * 200}
                                />
                            </div>
                            <div className="text-lg font-semibold text-text-primary mb-2">
                                {stat.label}
                            </div>
                            <p className="text-sm text-gray-600">
                                {stat.description}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center border border-border-medium rounded-xl">
                <ScrollWavyText 
                    text="Ready to transform your lead generation?"
                    className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
                    delay={0.2}
                />
                <ScrollSplitText 
                    text="Join thousands of businesses already using our platform to find and convert high-quality leads."
                    className="text-xl text-text-secondary-dark mb-8 max-w-2xl mx-auto"
                    delay={0.1}
                />
                <ScrollAnimatedElement delay={1.0}>
                    <Link
                        to="/signup"
                        className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-dark transition-colors inline-flex items-center justify-center"
                    >
                        Start Your Free Trial
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                </ScrollAnimatedElement>
            </div>
        </section>

        <footer className="w-full mt-20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-text-secondary-dark text-sm">
                        © 2025 Fetchr. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="text-text-secondary-dark hover:text-text-primary transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-service" className="text-text-secondary-dark hover:text-text-primary transition-colors text-sm">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
} 