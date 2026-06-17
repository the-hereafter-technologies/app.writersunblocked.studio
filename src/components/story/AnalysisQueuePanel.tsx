"use client";

import styled from "styled-components";

type ConnectionState =
	| "connecting"
	| "connected"
	| "reconnecting"
	| "disconnected"
	| "error";

interface AnalysisQueuePanelProps {
	connectionState: ConnectionState;
	threadTotal: number;
	lastAnalysisDiagnostic?: string | null;
}

const Panel = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.brand.black};
  background: ${({ theme }) => theme.palette.brand.paper};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.brand.paper};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Dot = styled.span<{ $state: ConnectionState }>`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({ $state }) => {
		if ($state === "connected") return "#22c55e";
		if ($state === "connecting" || $state === "reconnecting") return "#f59e0b";
		return "#dc2626";
	}};
`;

const Stats = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

export default function AnalysisQueuePanel({
	connectionState,
	threadTotal,
	lastAnalysisDiagnostic,
}: AnalysisQueuePanelProps) {
	return (
		<Panel>
			<Header>
				<Label>Analysis Queue</Label>
				<Dot $state={connectionState} title={connectionState} />
			</Header>
			<Stats>{threadTotal} threads total</Stats>
			{lastAnalysisDiagnostic ? <Stats>{lastAnalysisDiagnostic}</Stats> : null}
		</Panel>
	);
}
