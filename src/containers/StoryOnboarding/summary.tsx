import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useFormContext } from "react-hook-form";

export const Summary = () => {
	const { user, isLoading, error } = useCurrentUser();
	const { watch } = useFormContext();
	const title = watch("title");
	const genre = watch("genre");
	const audience = watch("audience");
	const projectType = watch("projectType");
	const penName = watch("penName");

	const author = () => {
		if (penName && penName.trim() !== "") return penName;
		if (user?.name && user.name.trim() !== "") return user.name;
		return "Anonymous";
	};

	// const audienceChoice = audience.find((a) => a.value === audience);

	return (
		<div>
			<div>
				<strong>{title}</strong> by {author()}
			</div>
		</div>
	);
};
