'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Redirect() {
  useEffect(() => {
    // Handle old URL format
    // *|EMAIL|*#{hash} -> {hash}?email=*|EMAIL|*
    const oldHash = window.location.hash;
    const pathSegments = window.location.pathname.split('/');
    const actorEmail = pathSegments[pathSegments.length - 1];

    if (oldHash) {
      // Hash without #
      redirect(`/act/${oldHash.substring(1)}?email=${actorEmail}`, 'replace');
    }
  }, []);

  return <></>;
}
