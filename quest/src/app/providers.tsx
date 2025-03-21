'use client';

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BaseGoerli } from "@thirdweb-dev/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider 
      activeChain={BaseGoerli} 
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      {children}
    </ThirdwebProvider>
  );
} 