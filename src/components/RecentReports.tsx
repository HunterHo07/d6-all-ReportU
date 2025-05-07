"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Mock data for recent reports
const recentReports = [
  {
    id: 'REP-123456',
    type: 'Traffic Violation',
    location: 'Orchard Road, Singapore',
    status: 'Resolved',
    date: '2 hours ago',
    success: true
  },
  {
    id: 'REP-789012',
    type: 'Public Disturbance',
    location: 'Bukit Bintang, Kuala Lumpur',
    status: 'Under Investigation',
    date: '5 hours ago',
    success: false
  },
  {
    id: 'REP-345678',
    type: 'Counterfeit Goods',
    location: 'Chinatown, Singapore',
    status: 'Resolved',
    date: '1 day ago',
    success: true
  },
  {
    id: 'REP-901234',
    type: 'Environmental Issue',
    location: 'Sentosa Island, Singapore',
    status: 'Resolved',
    date: '2 days ago',
    success: true
  },
  {
    id: 'REP-567890',
    type: 'Consumer Complaint',
    location: 'KLCC, Kuala Lumpur',
    status: 'Pending',
    date: '3 days ago',
    success: false
  }
];

// Mock data for successful cases
const successfulCases = [
  {
    id: 'REP-112233',
    type: 'Traffic Violation',
    location: 'Marina Bay, Singapore',
    outcome: 'Fine issued: $300',
    date: '1 day ago'
  },
  {
    id: 'REP-445566',
    type: 'Counterfeit Goods',
    location: 'Petaling Street, Kuala Lumpur',
    outcome: 'Goods seized, vendor fined',
    date: '3 days ago'
  },
  {
    id: 'REP-778899',
    type: 'Public Disturbance',
    location: 'Clarke Quay, Singapore',
    outcome: 'Warning issued',
    date: '5 days ago'
  },
  {
    id: 'REP-001122',
    type: 'Environmental Issue',
    location: 'Taman Negara, Malaysia',
    outcome: 'Company fined $5,000',
    date: '1 week ago'
  },
  {
    id: 'REP-334455',
    type: 'Traffic Violation',
    location: 'Woodlands Checkpoint',
    outcome: 'License suspended',
    date: '2 weeks ago'
  }
];

const RecentReports = () => {
  const recentReportsRef = useRef<HTMLDivElement>(null);
  const successfulCasesRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Animate the cards when they come into view
    const animateCards = (container: HTMLElement, stagger: number) => {
      const cards = container.querySelectorAll('.report-card');

      gsap.fromTo(
        cards,
        {
          y: 30,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: stagger,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: container,
            start: "top 80%"
          }
        }
      );
    };

    if (recentReportsRef.current) {
      animateCards(recentReportsRef.current, 0.1);
    }

    if (successfulCasesRef.current) {
      animateCards(successfulCasesRef.current, 0.1);
    }
  }, [isClient]);

  // Only render on client side
  if (!isClient) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Platform Activity
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Reports */}
        <div ref={recentReportsRef} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {recentReports.map(report => (
              <div key={report.id} className="report-card bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border-l-4 border-indigo-500 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{report.type}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{report.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'Resolved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : report.status === 'Under Investigation'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {report.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{report.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Successful Cases */}
        <div ref={successfulCasesRef} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Successfully Resolved Cases</h3>
          <div className="space-y-3">
            {successfulCases.map(caseItem => (
              <div key={caseItem.id} className="report-card bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{caseItem.type}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{caseItem.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 dark:text-green-400">{caseItem.outcome}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{caseItem.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentReports;
