'use client';
import { DiscoveryForm } from "@/components/DiscoveryForm";
import { DiscoveryList } from "@/components/DiscoveryList"
import { DiscoveryProvider } from "@/components/DiscoveryProvider"
import { useState } from "react"

export const DiscoveryPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
	return (
		<DiscoveryProvider>
			<DiscoveryForm />
      <DiscoveryList />
		</DiscoveryProvider>
	);
};
