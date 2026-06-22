"use client";
import { Button, Platform } from "@writersunblocked/ui/app";
import { motion } from "motion/react";
import Masonry from "react-masonry-css";
import styled from "styled-components";

export const Container = styled.div`
	min-height: 100vh;
	width: 100vw;
	overflow: hidden;
	background: ${({ theme }) => theme.palette.brand.paper};
`;

export const Rail = styled(motion.div)`
  display: flex;
  align-items: stretch;
  height: 100vh;
  width: max-content;

  > div {
    width: 85vw;
    flex-shrink: 0;
  }
`;

export const AccordionButton = styled.button`
  max-width: 740px;
  margin: 0 auto;
  display: block;
  width: 100%;
  text-align: left;
  font-size: 14px;
  background-color: ${({ theme }) => theme.palette.brand.darkPaper};
  padding: 8px;
  border-radius: 6px;
  color: ${({ theme }) => theme.palette.brand.silver};

  &:hover {
      color: ${({ theme }) => theme.palette.brand.black};
  }
`;

export const Think = styled.div`
  padding: 40px;
  background: ${({ theme }) => theme.palette.brand.paper};
`;
export const Extract = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.white};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

export const ExtractBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px 40px 160px;
`;

export const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 740px;
  margin: 0 auto;
`;

export const ExtractHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;

  h1,h2 {
    font-size: 24px;
    font-weight: 400;
    margin: 0;
  }
  h2 {
    font-size: 19px;
      color: ${({ theme }) => theme.palette.brand.silver};

  }
`;

export const Write = styled.div`
  min-height: 100vh;
  overflow: hidden;
`;

export const InputPane = styled.section`
	padding: 44px 40px 28px;
	display: flex;
	flex-direction: column;
	gap: 22px;

	@media (max-width: 980px) {
		border-right: none;
		padding: 28px 20px 18px;
	}
`;

export const Header = styled.header`
	display: flex;
	justify-content: space-between;
  flex-direction: column;
	align-items: flex-start;
	gap: 12px;

	h1 {
		font-size: 21px;
		line-height: 1.08;
    font-weight: 400;
    span {
      color: ${({ theme }) => theme.palette.brand.silver};
    }
	}

	p {
		margin-top: 9px;
		color: ${({ theme }) => theme.palette.brand.silver};
		max-width: 560px;
	}

	@media (max-width: 980px) {
		h1 {
			font-size: 24px;
		}
	}
`;

export const DraftField = styled(Platform)`
	width: 100%;
	min-height: 300px;
	resize: vertical;
  flex: 1;
	font-size: 19px;
	line-height: 1.65;
  outline: none;
  max-width: none;


  > div {
    padding: 0;
	  font-size: 19px;
    width: 100%;
    flex: 1;
    max-width: none;
    align-items: center;

    &::before {
      padding: 0;
      font-size: 19px;
    }
  }
`;

export const StatusGrid = styled.div`
	gap: 14px;

	@media (max-width: 600px) {
		grid-template-columns: 1fr;
	}
`;

export const WordCount = styled.div`
	font-size: 14px;
	color: ${({ theme }) => theme.palette.brand.silver};
  margin-bottom: 24px;
`;

export const PromptCopy = styled.p`
	margin: 0;
	color: ${({ theme }) => theme.palette.brand.silver};
	font-size: 14px;
  font-weight: 600;
`;

export const QuestionList = styled.ul`
	margin: 12px 0 0;
	padding: 0;
	list-style: none;
	display: flex;
  flex-wrap: wrap;
	gap: 3px;
`;

export const QuestionItem = styled.li<{ $answered: boolean }>`
	border-radius: 10px;
  opacity: ${({ $answered }) => ($answered ? 1 : 0.45)};
	font-size: 12px;
`;

export const QuestionEvidence = styled.p`
	margin: 6px 0 0;
	font-size: 12px;
	color: ${({ theme }) => theme.palette.brand.silver};
`;

export const Actions = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
  position: fixed;
  bottom: 0;
  background-color: ${({ theme }) => theme.palette.brand.white};
  width: 100%;
  padding: 30px 20px 60px;
`;

export const PrimaryButton = styled(Button)`

	&:disabled {
		opacity: 0.58;
		cursor: not-allowed;
	}
`;

export const SecondaryButton = styled.button`
	border-radius: 10px;
	border: 1px solid ${({ theme }) => theme.palette.brand.silver};
	background: ${({ theme }) => theme.palette.brand.white};
	color: ${({ theme }) => theme.palette.brand.black};
	padding: 11px 16px;
`;

export const ErrorText = styled.p`
	margin: 0;
	color: #b22222;
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 50px;
  flex: 1;
`;

export const PreviewPane = styled.section`
	background: ${({ theme }) => theme.palette.brand.white};
	padding: 44px 30px 28px;
	overflow: auto;
  position: relative;
  padding-bottom: 200px;

	@media (max-width: 980px) {
		padding: 16px 20px 30px;
		border-top: 1px solid ${({ theme }) => theme.palette.brand.darkPaper};
	}
`;

export const PreviewTitle = styled.h2`
	font-size: 21px !important;
	line-height: 1.25;
  font-weight: 400;
  font-size: 24px;
  margin: 0.67em 0;
  margin-bottom: 40px;
  span {
    color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

export const PreviewSubtitle = styled.p`
	margin: 10px 0 20px;
	color: ${({ theme }) => theme.palette.brand.silver};
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: 22px;
`;

export const MentionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  .point {
    background-color: transparent;
    padding: 0;
  }
`;

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 12px;
  margin-top: 30px;;

	h3 {
		margin: 0;
		font-size: 14px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
`;

export const CardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;

	@media (max-width: 1200px) {
		grid-template-columns: 1fr;
	}
`;

export const Card = styled.article`
	background: ${({ theme }) => theme.palette.brand.paper};
	border-radius: 12px;
	padding: 14px;

	h4 {
		margin: 0;
		font-size: 16px;
	}

	p {
		margin: 7px 0 0;
		font-size: 14px;
		color: ${({ theme }) => theme.palette.brand.black};
	}
`;

export const EmptyState = styled.p`
	margin: 0;
	font-size: 14px;
	color: ${({ theme }) => theme.palette.brand.silver};
`;

const breakpointColumnsObj = {
  default: 3,
  1700: 2,
  1300: 1,
};

export const MasonryContainer = styled(Masonry).attrs({
  breakpointCols: breakpointColumnsObj,
})`
  display: flex;
  gap: 20px;

  [class*="MasonryItem"] {
    margin-bottom: 20px;
    cursor: default;
  }
`;

export const MasonryItem = styled.div`
  break-inside: avoid;
  display: flex;
  flex-direction: column;
  gap: 0;
  cursor: grab;
  width: 100%;
  .field {
    width: 100%;
  }
  &:active {
    cursor: grabbing;
  }
`;

export const MentionContext = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.white};
  padding: 10px;
  margin-bottom: 12px;
  span {
    display: block;
    margin-bottom: 12px;
    background-color: ${({ theme }) => theme.palette.brand.paper};
    width: fit-content;
    color: ${({ theme }) => theme.palette.brand.silver};
    font-size: 12px;
    font-weight: 700;
    padding: 6px 8px;
    border-radius: 4px;;
  }
`;
