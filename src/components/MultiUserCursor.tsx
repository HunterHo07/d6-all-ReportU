"use client";

import { useEffect, useState } from 'react';
import gsap from 'gsap';

type Cursor = {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  visible: boolean;
  fixedPosition: {
    x: number;
    y: number;
  };
};

const MultiUserCursor = () => {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [myCursor, setMyCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Use state to track if we're on the client
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'report'>('home');

  // Set isClient and detect current page
  useEffect(() => {
    setIsClient(true);

    // Function to detect current page
    const detectPage = () => {
      const path = window.location.pathname;
      if (path.includes('/report')) {
        setCurrentPage('report');
      } else {
        setCurrentPage('home');
      }
    };

    // Initial detection
    detectPage();

    // Listen for route changes
    const handleRouteChange = () => {
      // Use setTimeout to avoid scheduling updates during render
      setTimeout(() => {
        detectPage();
      }, 0);
    };

    // Add event listener for popstate (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);

    // For Next.js route changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Initialize cursors only on the client side
  useEffect(() => {
    if (!isClient) return;

    // Generate fake cursors with diverse names
    const homePageUsers = [
      { name: 'Sarah', color: '#FF5733' },
      { name: 'Michael', color: '#33FF57' },
      { name: '李明', color: '#3357FF' }, // Chinese name
      { name: 'David', color: '#F033FF' },
      { name: 'Priya', color: '#FF9933' }, // Indian name
      { name: '王华', color: '#33FFFF' }, // Chinese name
      { name: 'Raj', color: '#FF33FF' }, // Indian name
      { name: 'Emma', color: '#FFFF33' }
    ];

    const reportPageUsers = [
      { name: 'Ahmed', color: '#FF5733' },
      { name: '陈小明', color: '#33FF57' }, // Chinese name
      { name: 'Sophia', color: '#3357FF' },
      { name: 'Rahul', color: '#F033FF' }, // Indian name
      { name: 'Grace', color: '#FF9933' }
    ];

    // Set the appropriate user list based on current page
    const fakeUsers = currentPage === 'home' ? homePageUsers : reportPageUsers;

    const generateRandomPosition = () => {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      };
    };

    // Select users based on current page
    const usersForCurrentPage = currentPage === 'home' ? homePageUsers : reportPageUsers;

    // Create initial cursors
    const initialCursors = usersForCurrentPage.map((user, index) => {
      const fixedPos = generateRandomPosition();
      return {
        id: `cursor-${index}`,
        x: fixedPos.x,
        y: fixedPos.y,
        color: user.color,
        name: user.name,
        visible: true,
        fixedPosition: fixedPos
      };
    });

    setCursors(initialCursors);

    // Animate cursors with more natural movement
    const animateCursors = () => {
      setCursors(prevCursors =>
        prevCursors.map(cursor => {
          if (!cursor.visible) return cursor;

          // Almost always move the cursor (90% chance)
          if (Math.random() > 0.1) {
            // Generate larger movements (30-100px range)
            const moveDistance = Math.random() * 70 + 30;
            const moveAngle = Math.random() * Math.PI * 2; // Random angle in radians

            // Calculate new position using angle and distance for more natural movement
            const newX = cursor.fixedPosition.x + Math.cos(moveAngle) * moveDistance;
            const newY = cursor.fixedPosition.y + Math.sin(moveAngle) * moveDistance;

            // Keep within bounds with some padding
            const padding = 50;
            const boundedX = Math.max(padding, Math.min(window.innerWidth - padding, newX));
            const boundedY = Math.max(padding, Math.min(window.innerHeight - padding, newY));

            return {
              ...cursor,
              x: boundedX,
              y: boundedY
            };
          }
          return cursor;
        })
      );
    };

    // Update cursor positions more frequently for smoother animation
    const movementIntervalId = setInterval(animateCursors, 500);

    // Handle cursor visibility (appear/disappear)
    const handleCursorVisibility = () => {
      // Randomly hide 1-2 cursors
      setCursors(prevCursors => {
        const newCursors = [...prevCursors];
        const numToHide = Math.floor(Math.random() * 2) + 1;
        const visibleCursors = newCursors.filter(c => c.visible);

        // Only hide if we have enough visible cursors
        if (visibleCursors.length > 2) {
          for (let i = 0; i < Math.min(numToHide, visibleCursors.length); i++) {
            const randomIndex = newCursors.indexOf(
              visibleCursors[Math.floor(Math.random() * visibleCursors.length)]
            );
            if (randomIndex >= 0) {
              newCursors[randomIndex] = { ...newCursors[randomIndex], visible: false };
            }
          }
        }

        return newCursors;
      });
    };

    // Add new cursors after some disappear
    const addNewCursors = () => {
      setCursors(prevCursors => {
        const newCursors = [...prevCursors];
        const numToAdd = Math.floor(Math.random() * 2) + 1;
        const invisibleCursors = newCursors.filter(c => !c.visible);

        // Make some invisible cursors visible again with new names and positions
        for (let i = 0; i < Math.min(numToAdd, invisibleCursors.length); i++) {
          const randomIndex = newCursors.indexOf(
            invisibleCursors[Math.floor(Math.random() * invisibleCursors.length)]
          );

          if (randomIndex >= 0) {
            // New random name from the appropriate list
            const userPool = currentPage === 'home' ? homePageUsers : reportPageUsers;
            const randomUser = userPool[Math.floor(Math.random() * userPool.length)];
            const newFixedPos = generateRandomPosition();

            newCursors[randomIndex] = {
              ...newCursors[randomIndex],
              visible: true,
              name: randomUser.name,
              color: randomUser.color,
              fixedPosition: newFixedPos,
              x: newFixedPos.x,
              y: newFixedPos.y
            };
          }
        }

        return newCursors;
      });
    };

    // Set up intervals for cursor visibility changes
    const visibilityIntervalId = setInterval(() => {
      handleCursorVisibility();

      // Add new cursors after a delay
      setTimeout(addNewCursors, (Math.random() * 2 + 1) * 60000); // 1-3 minutes
    }, (Math.random() * 4 + 1) * 60000); // 1-5 minutes

    // Track user's cursor
    const handleMouseMove = (e: MouseEvent) => {
      setMyCursor({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(movementIntervalId);
      clearInterval(visibilityIntervalId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient, currentPage]);

  // Animate cursor movements with GSAP
  useEffect(() => {
    if (!isClient) return;

    cursors.filter(cursor => cursor.visible).forEach(cursor => {
      const element = document.getElementById(cursor.id);
      if (element) {
        gsap.to(element, {
          left: cursor.x,
          top: cursor.y,
          duration: 1.2, // Longer duration for smoother movement
          ease: "power1.out", // More natural easing
          overwrite: "auto" // Prevent animation conflicts
        });
      }
    });
  }, [cursors, isClient]);

  // Only render on client side
  if (!isClient) return null;

  return (
    <>
      {/* Other users' cursors */}
      {cursors.filter(cursor => cursor.visible).map(cursor => (
        <div
          key={cursor.id}
          id={cursor.id}
          className="absolute pointer-events-none z-50"
          style={{
            left: cursor.x,
            top: cursor.y,
            position: 'absolute',
            transform: 'translate(0, 0)'
          }}
        >
          <div className="relative">
            {/* Cursor */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: cursor.color }}
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.0664062 17.2664V0.575C0.0664062 0.437501 0.200657 0.325001 0.369531 0.325001C0.432343 0.325001 0.492969 0.3475 0.538906 0.3885L5.65376 4.9829V12.3673Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="0.5"
              />
            </svg>

            {/* User name tag */}
            <div
              className="absolute left-5 top-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium"
              style={{ backgroundColor: cursor.color, color: '#fff' }}
            >
              {cursor.name}
            </div>
          </div>
        </div>
      ))}

      {/* My cursor - just for visual effect, follows the real cursor */}
      <div
        className="fixed pointer-events-none z-50"
        style={{ left: myCursor.x, top: myCursor.y, display: 'none' }}
      >
        <div className="relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: '#FFD700' }}
          >
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.0664062 17.2664V0.575C0.0664062 0.437501 0.200657 0.325001 0.369531 0.325001C0.432343 0.325001 0.492969 0.3475 0.538906 0.3885L5.65376 4.9829V12.3673Z"
              fill="currentColor"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
          <div className="absolute left-5 top-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium bg-yellow-500 text-white">
            You
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiUserCursor;
