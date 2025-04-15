"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Search,
  RefreshCw,
  ChevronRight,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  BookMarked,
  Volume2,
  Maximize,
  Play,
  SkipForward,
} from "lucide-react"
import EnhancedButton from "@/components/ui/Button"
import NavLink from "@/components/ui/NavLink"

// Testimonial data
const testimonials = [
  {
    id: 1,
    content:
      "BookShare changed how I interact with books. I've met amazing people in my community and discovered titles I never would have found otherwise.",
    author: "Sarah M.",
    role: "Book Lover from Chicago",
    avatar: "/sarah.jpeg?height=40&width=40",
  },
  {
    id: 2,
    content:
      "As someone who reads constantly, BookShare has saved me hundreds of dollars while reducing waste. The platform is incredibly intuitive!",
    author: "James P.",
    role: "Literature Professor",
    avatar: "/james.jpeg?height=40&width=40",
  },
  {
    id: 3,
    content:
      "I listed my collection expecting just a few exchanges, but I've connected with dozens of readers who share my tastes. Such a fantastic community!",
    author: "Elena K.",
    role: "Book Owner from Austin",
    avatar: "/elena.jpeg?height=40&width=40",
  },
]

// Featured books
const featuredBooks = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "/midnight.jpeg?height=180&width=120",
    location: "Portland, OR",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    cover: "/educated.jpeg?height=180&width=120",
    location: "Seattle, WA",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "/projecthailmary.jpeg?height=180&width=120",
    location: "Austin, TX",
  },
  { title: "Pachinko", author: "Min Jin Lee", cover: "/pachinko.jpeg?height=180&width=120", location: "Chicago, IL" },
]

// Statistics
const stats = [
  { id: 1, value: "1,000+", label: "Active Users" },
  { id: 2, value: "25,000+", label: "Books Shared" },
  { id: 3, value: "1,500+", label: "Cities" },
  { id: 4, value: "4.8/5", label: "User Rating" },
]

// Book covers for hero section
const bookCovers = [
  {
    src: "/psychologyofmoney.jpg?height=250&width=180",
    alt: "Psychology of Money",
    rotate: "-12deg",
    top: "6%",
    left: "25%",
  },
  { src: "/thought.jpg?height=220&width=160", alt: "Thought", rotate: "-6deg", top: "8%", right: "33%" },
  { src: "/matt.jpg?height=280&width=200", alt: "Matt Haig", rotate: "3deg", top: "0", left: "33%", zIndex: 10 },
  { src: "/mockup.jpg?height=250&width=180", alt: "Mockup", rotate: "12deg", top: "4%", right: "25%" },
]

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const featuredRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)
  const [isHovering, setIsHovering] = useState(Array(featuredBooks.length).fill(false))

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5])

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  interface HoverStateArray extends Array<boolean> {}

  const handleHover = (index: number, isHovering: boolean): void => {
    setIsHovering((prev: HoverStateArray) => {
      const newState: HoverStateArray = [...prev];
      newState[index] = isHovering;
      return newState;
    });
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center" ref={heroRef}>
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-rose-200/70 mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
          <div className="absolute top-0 right-20 w-60 h-60 rounded-full bg-violet-200/70 mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-60 h-60 rounded-full bg-cyan-200/70 mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div style={{ y, opacity }} className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex items-center rounded-full px-6 py-2 bg-blue-100 text-blue-700 border border-blue-200"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Revolutionizing Book Sharing</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
            >
              <span className="block">Connect Through</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Power of Books
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-600"
            >
              Join our vibrant community of readers to discover, share, and exchange books with people in your area.
              Reduce waste, save money, and forge meaningful connections.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <NavLink href="/sign-up">
                <EnhancedButton
                  size="md"
                  className="group rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-blue-200/50 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </EnhancedButton>
              </NavLink>
              <NavLink href="/books">
                <EnhancedButton
                  variant="outline"
                  size="md"
                  className="rounded-full border-gray-300 px-8 py-6 text-base font-medium hover:bg-gray-50 transition-all duration-300"
                >
                  Browse Books
                </EnhancedButton>
              </NavLink>
            </motion.div>
          </motion.div>

          {/* Floating books visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="relative mt-12 h-48 md:h-80 mx-auto max-w-5xl"
          >
            {bookCovers.map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1 + index * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -10,
                  rotate: book.rotate.replace("deg", "") === "0" ? "3deg" : "0deg",
                  transition: { duration: 0.3 },
                }}
                className="absolute shadow-2xl rounded-md"
                style={{
                  top: book.top,
                  left: book.left,
                  right: book.right,
                  transform: `rotate(${book.rotate})`,
                  zIndex: book.zIndex || 1,
                }}
              >
                <Image
                  src={book.src || "./matt.jpg"}
                  width={book.src.includes("200") ? 200 : 180}
                  height={book.src.includes("280") ? 280 : 250}
                  alt={book.alt}
                  className="rounded-md"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Statistics Section */}
      <div ref={statsRef} className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How BookShare Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto max-w-3xl text-lg text-gray-600">
              Our platform makes it easy to connect with fellow readers and share your love for books
            </motion.p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="absolute top-8 right-0 w-full border-t-2 border-dashed border-gray-200 hidden md:block"></div>
              <h3 className="mb-4 text-xl font-bold">List Your Collection</h3>
              <p className="text-gray-600">
                Share books you've enjoyed and are willing to lend or exchange with others in your community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
                <Search className="h-8 w-8 text-cyan-600" />
              </div>
              <div className="absolute top-8 right-0 w-full border-t-2 border-dashed border-gray-200 hidden md:block"></div>
              <h3 className="mb-4 text-xl font-bold">Discover Books</h3>
              <p className="text-gray-600">
                Browse through thousands of titles available in your area, filtered by genre, location, and
                availability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
                <RefreshCw className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Exchange & Connect</h3>
              <p className="text-gray-600">
                Arrange meetups with book owners, exchange reads, and build relationships with fellow literature
                enthusiasts.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Books */}
      <div className="bg-gradient-to-b from-white to-slate-50 py-24" ref={featuredRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Featured Books
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-center mx-auto max-w-3xl text-lg text-gray-600">
              Explore some of the popular books currently available on our platform
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-4"
          >
            {featuredBooks.map((book, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                onHoverStart={() => handleHover(index, true)}
                onHoverEnd={() => handleHover(index, false)}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-4 flex justify-center relative">
                  <motion.div
                    animate={{
                      rotateY: isHovering[index] ? "10deg" : "0deg",
                      scale: isHovering[index] ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={book.cover || "/placeholder.svg"}
                      width={120}
                      height={180}
                      alt={book.title}
                      className="rounded shadow-md h-[180px] object-cover"
                    />
                  </motion.div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                  <p className="text-gray-600 mb-3">{book.author}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{book.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 text-center"
          >
            <NavLink href="/books">
              <EnhancedButton
                variant="outline"
                className="rounded-full border-blue-300 px-8 py-6 text-blue-700 hover:bg-blue-50 transition-all duration-300"
              >
                Explore All Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </EnhancedButton>
            </NavLink>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-slate-50 py-24" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto max-w-3xl text-lg text-gray-600">
              Join thousands of satisfied readers who've discovered new books and made meaningful connections
            </motion.p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
              <EnhancedButton
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center pointer-events-auto focus:outline-none hover:bg-gray-50 transition-colors duration-300"
              >
                <ChevronRight className="h-5 w-5 transform rotate-180 text-gray-500" />
              </EnhancedButton>
              <EnhancedButton
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center pointer-events-auto focus:outline-none hover:bg-gray-50 transition-colors duration-300"
              >
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </EnhancedButton>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-xl px-6 py-10 md:px-10 md:py-16"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

              <div className="text-5xl text-blue-200 absolute top-8 left-8">"</div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  <p className="text-xl md:text-2xl text-gray-800 leading-relaxed relative z-10 mb-8">
                    {testimonials[activeTestimonial].content}
                  </p>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src={testimonials[activeTestimonial].avatar || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={testimonials[activeTestimonial].author}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{testimonials[activeTestimonial].author}</div>
                      <div className="text-gray-600 text-sm">{testimonials[activeTestimonial].role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="text-5xl text-blue-200 absolute bottom-8 right-8">"</div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <EnhancedButton
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? "bg-blue-600 scale-125" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose BookShare?
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto max-w-3xl text-lg text-gray-600">
            Our platform brings together book lovers in a sustainable, community-focused way
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <RefreshCw className="h-6 w-6 text-emerald-600" />,
              title: "Sustainable Reading",
              description: "Reduce waste and give books new life by sharing them within your community.",
              color: "emerald",
            },
            {
              icon: <Users className="h-6 w-6 text-blue-600" />,
              title: "Community Building",
              description:
                "Connect with like-minded readers and form meaningful relationships around shared interests.",
              color: "blue",
            },
            {
              icon: <BookMarked className="h-6 w-6 text-violet-600" />,
              title: "Discover Hidden Gems",
              description: "Find unique titles and recommendations that algorithm-based platforms might never suggest.",
              color: "violet",
            },
            {
              icon: <MapPin className="h-6 w-6 text-amber-600" />,
              title: "Local Connections",
              description: "Meet people in your neighborhood who share your passion for reading and storytelling.",
              color: "amber",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ),
              title: "Cost Effective",
              description: "Save money on books by borrowing or exchanging rather than always buying new.",
              color: "red",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M20.4 14.5L16 10 4 20" />
                </svg>
              ),
              title: "Safe & Secure",
              description: "Our platform prioritizes user safety with verified profiles and secure messaging.",
              color: "indigo",
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 },
              }}
              className="p-6 bg-white rounded-xl shadow border border-gray-100 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20" ref={ctaRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Reading Journey?</h2>
            <p className="mx-auto max-w-2xl text-xl text-blue-100 mb-10">
              Join thousands of book lovers already connecting, sharing, and discovering new reads on BookShare.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <NavLink href="/sign-up">
                <EnhancedButton
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 py-6 text-lg font-medium shadow-lg transition-all duration-300"
                >
                  Sign Up Now
                </EnhancedButton>
              </NavLink>
              <NavLink href="/books">
                <EnhancedButton
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-purple-500 rounded-full px-8 py-6 text-lg font-medium transition-all duration-300"
                >
                  Browse Books
                </EnhancedButton>
              </NavLink>
            </div>
          </motion.div>
        </div>
      </div>

      {/* App Preview Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInRight}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Take BookShare Everywhere</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our responsive platform works seamlessly across all your devices. Browse, share, and connect whether
              you're at home or on the go.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Instant Notifications",
                  description: "Receive real-time updates when someone is interested in your books.",
                },
                {
                  title: "Seamless Messaging",
                  description: "Communicate easily with other members to arrange exchanges.",
                },
                {
                  title: "Location-Based Matching",
                  description: "Find books and readers nearby for convenient exchanges.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.2 * index, ease: [0.22, 1, 0.36, 1] }}
                  className="flex"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-1 text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            className="relative"
          >
            <div className="relative mx-auto max-w-[350px]">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>

              <motion.div
                whileHover={{
                  y: -10,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                }}
                className="relative rounded-[2.5rem] bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-2xl ring-1 ring-gray-900/10"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-b-lg"></div>
                <Image
                  src="/library.jpg"
                  width={320}
                  height={850}
                  alt="BookShare app preview"
                  className="rounded-[2rem] shadow-sm"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA / Newsletter */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Stay Updated with BookShare</h2>
              <p className="text-lg text-gray-600 mb-8">
                Sign up for our newsletter to receive updates on new features, community events, and reading
                recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 transition-all duration-300"
                />
                <EnhancedButton className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                  Subscribe
                </EnhancedButton>
              </div>

              <p className="mt-4 text-sm text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
            </motion.div>
          </div>
        </div>
      </div>


      {/* Custom CSS for Animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 5s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
