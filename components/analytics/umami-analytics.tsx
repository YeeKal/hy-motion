'use client';

import Script from 'next/script';


export default function UmamiAnalytics({ id }: { id: string }) {
  return (
    <>
     <Script
          defer
          src="https://umami-j91g.onrender.com/script.js"
          data-website-id={`${id}`}
        ></Script>
    </>
  );
}
