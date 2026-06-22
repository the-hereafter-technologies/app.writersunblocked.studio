"use client";
import { OnboardingPage } from "@/components/OnboardingPage";
import styled from "styled-components";

export const Container = styled(OnboardingPage)`
	.is-available {
		position: relative;
	}

	span.available,
	span.unavailable {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: red;
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
	}

	span.available {
		background-color: green;
	}

	div.input-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 500px;
	}
	
	div.with-handle-check {
		display: flex;
	}

	.text-field {
		padding-right: 30px;
	}
`;
