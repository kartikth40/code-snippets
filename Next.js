// Points to note - 
// - no server components inside client conponents
// - when changing server comp. to client, remember to remove asyncronization from comp declaractions


// data rendering options
export const dynamic = 'auto'  // 'auto' (default) | 'force-dynamic' | 'force-static'
export const revalidate = 3600 // revalidate data after certain no. of seconds

// data fetching using axios
//

// generateStaticParams
// used when data do not change very often (ideal for blog posts), should be used with revalidate 
export async function generateStaticParams() {
  const posts = await fetch('endpoint_url').then(res => res.json())
  return posts.map(post => ({slug: post.slug}))  // unique identifiers as slugs
}



// useNavigationEvent.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const useNavigationEvent = (onPathnameChange: () => void) => {
  const pathname = usePathname(); // Get current route

  // Save pathname on component mount into a REF
  const savedPathNameRef = useRef(pathname);

  useEffect(() => {
    // If REF has been changed, do the stuff
    if (savedPathNameRef.current !== pathname) {
      onPathnameChange();
      // Update REF
      savedPathNameRef.current = pathname;
    }
  }, [pathname, onPathnameChange]);
};
