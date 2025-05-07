"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ReportForm from '@/components/ReportForm';
import gsap from 'gsap';
import MultiUserCursor from '@/components/MultiUserCursor';

export default function ReportPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // This ensures content is hidden until animations are ready
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial states immediately to prevent flash of unstyled content
    if (titleRef.current) titleRef.current.style.opacity = '0';
    if (subtitleRef.current) subtitleRef.current.style.opacity = '0';
    if (formRef.current) formRef.current.style.opacity = '0';

    // Mark as loaded after a small delay to ensure DOM is ready
    setTimeout(() => {
      setIsLoaded(true);
    }, 50);
  }, []);

  // Animation effect that runs after content is marked as loaded
  useEffect(() => {
    if (!isLoaded || !pageRef.current || typeof window === 'undefined') return;

    // Create a smoother animation sequence
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }
    )
    .fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.3"
    )
    .fromTo(
      formRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.2"
    );

    return () => {
      // Cleanup any animations
      gsap.killTweensOf([titleRef.current, subtitleRef.current, formRef.current]);
    };
  }, [isLoaded]);

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 py-16 px-4 overflow-hidden">
      {/* Multi-user cursors */}
      <MultiUserCursor />

      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 mb-6 hover:underline transition-all hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
            Submit a Report
          </h1>
          <p ref={subtitleRef} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please provide as much detail as possible to help authorities address your report effectively.
            All information is kept confidential.
          </p>
        </div>

        {/* Form - initially hidden until animations are ready */}
        <div ref={formRef} style={{ opacity: 0 }}>
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
