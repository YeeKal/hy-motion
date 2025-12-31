'use client';

import Script from 'next/script';


export default function GoogleAdsense({ id }: { id: string }) {
  return (
    <>
      <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`}
     crossOrigin="anonymous"></Script>
    </>
  );
}
