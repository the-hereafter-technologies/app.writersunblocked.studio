import { StoryPage } from "@/containers/StoryPage";

export interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <StoryPage storyId={id} />;
}
