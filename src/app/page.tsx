"use client";

// import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroBackground from "@/components/HeroBackground";
import MultiUserCursor from "@/components/MultiUserCursor";
import RecentReports from "@/components/RecentReports";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const footerRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    // Set initial states to prevent flash of unstyled content
    gsap.set(heroRef.current, { opacity: 0 });
    gsap.set(titleRef.current, { y: 100, opacity: 0, scale: 0.9 });
    gsap.set(subtitleRef.current, { y: 50, opacity: 0 });
    gsap.set(ctaRef.current, { y: 30, opacity: 0, scale: 0.9 });

    // Hero animation with more dramatic effects
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial loading animation with a slight delay to ensure DOM is ready
    setTimeout(() => {
      tl.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      )
      .fromTo(
        titleRef.current,
        { y: 100, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      )
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      );
    }, 100);

    // Floating animation for hero elements - with a delay to ensure initial animations complete
    setTimeout(() => {
      gsap.to(titleRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(subtitleRef.current, {
        y: -5,
        duration: 2.5,
        delay: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Feature section animations with ScrollTrigger
      gsap.fromTo(
        featureRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: featureRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none none"
          }
        }
      );

      // Add staggered animations for feature cards
      document.querySelectorAll('.feature-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.2 + (index * 0.15),
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, 1000);

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  // Add refs to feature cards - client-side only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get all feature cards and store refs
    const cards = document.querySelectorAll('.feature-card');
    featureCardsRef.current = Array.from(cards) as HTMLDivElement[];

    // Set initial state for feature cards
    featureCardsRef.current.forEach((card, index) => {
      gsap.set(card, { y: 50, opacity: 0, scale: 0.95 });
    });
  }, [isLoaded]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">
      {/* Multi-user cursors */}
      <MultiUserCursor />

      {/* Hero Section - Full screen height */}
      <div ref={heroRef} className="relative overflow-hidden h-screen flex items-center justify-center">
        {/* 3D Background */}
        <HeroBackground />

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6 tracking-tight">
              ReportU
            </h1>
            <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mb-10">
              A cross-border platform for Malaysia and Singapore to submit offense reports,
              redirected to the respective official departments.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="/report" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                Report an Incident
              </a>
              <button className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-full border border-indigo-200 hover:border-indigo-400 transition-all shadow-md hover:shadow-lg">
                Track Your Report
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featureRef} className="container mx-auto px-6 py-24 flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-16">
          Why Choose ReportU?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {/* Feature 1 */}
          <div ref={(el) => (featureCardsRef.current[0] = el)} className="feature-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-100/30 dark:bg-indigo-900/20 rounded-full"></div>
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-6 relative z-10">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 relative z-10">Simplified Reporting</h3>
            <p className="text-gray-600 dark:text-gray-300 relative z-10">Submit reports quickly and easily through our intuitive interface, with no complex forms or procedures.</p>
          </div>

          {/* Feature 2 */}
          <div ref={(el) => (featureCardsRef.current[1] = el)} className="feature-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-100/30 dark:bg-purple-900/20 rounded-full"></div>
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-6 relative z-10">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 relative z-10">Cross-Border Support</h3>
            <p className="text-gray-600 dark:text-gray-300 relative z-10">Seamlessly report incidents that occur in either Malaysia or Singapore, with automatic routing to the right authorities.</p>
          </div>

          {/* Feature 3 */}
          <div ref={(el) => (featureCardsRef.current[2] = el)} className="feature-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-100/30 dark:bg-blue-900/20 rounded-full"></div>
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-6 relative z-10">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 relative z-10">Real-Time Updates</h3>
            <p className="text-gray-600 dark:text-gray-300 relative z-10">Receive notifications and track the status of your reports from submission to resolution.</p>
          </div>
        </div>

        {/* Additional Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
            How ReportU Makes a Difference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">For Citizens</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Simplified reporting process saves time and reduces frustration</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Transparent tracking system keeps you informed at every step</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Multi-language support ensures everyone can report incidents easily</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Secure and private reporting protects your personal information</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">For Authorities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Standardized reporting format improves data collection and analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Automated routing ensures reports reach the correct department immediately</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Cross-border coordination simplifies international incident management</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Comprehensive analytics help identify patterns and allocate resources effectively</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Reports Section - Centered and larger */}
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <RecentReports />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">ReportU</h2>
              <p className="text-indigo-200 mt-2">Making reporting simple and effective.</p>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">About</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="border-t border-indigo-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-300 text-sm">© 2023 ReportU. All rights reserved. Created by HunterHo</p>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
