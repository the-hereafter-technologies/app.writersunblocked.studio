"use client";
import styled from "styled-components";

export const Container = styled.main`
	width: 100%;
	max-width: 920px;
	margin: 0 auto;
	padding: 3.5rem 1.25rem 4rem;
	color: var(--surface-900, #111827);
	line-height: 1.7;

	@media (min-width: 768px) {
		padding: 4.5rem 2rem 5rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 3vw, 2.75rem);
		line-height: 1.15;
	}

	h2 {
		margin: 2rem 0 0.75rem;
		font-size: 1.2rem;
		line-height: 1.3;
	}

	p {
		margin: 0.75rem 0;
	}

	ul {
		margin: 0.75rem 0;
		padding-left: 1.2rem;
	}

	li + li {
		margin-top: 0.45rem;
	}

	a {
		color: var(--primary-500, #1d4ed8);
	}
`;

export const Eyebrow = styled.p`
	margin: 0 0 0.65rem;
	font-size: 0.82rem;
	letter-spacing: 0.07em;
	text-transform: uppercase;
	font-weight: 700;
	color: var(--surface-500, #6b7280);
`;

export const UpdatedAt = styled.p`
	margin: 0.5rem 0 2rem;
	font-size: 0.95rem;
	color: var(--surface-600, #4b5563);
`;
