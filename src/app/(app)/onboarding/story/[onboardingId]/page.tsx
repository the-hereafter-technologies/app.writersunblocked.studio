import { StoryOnboarding } from "@/containers/StoryOnboarding";

export interface PageProps {
	params: Promise<{
		onboardingId: string;
	}>;
}

export default async function Page({ params }: PageProps) {
	const { onboardingId } = await params;
	return <StoryOnboarding onboardingId={onboardingId} />;
}
