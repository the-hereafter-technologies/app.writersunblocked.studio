import * as Styled from "./style";
export const SceneCellStats = ({
  threadCount,
  wordCount,
}: {
  threadCount: number;
  wordCount: number;
}) => {
  return (
    <Styled.SceneCellStatsContainer>
      <div>
        <Styled.SceneCellStatsCard>
          <span>{wordCount}</span>
          <span>Words</span>
        </Styled.SceneCellStatsCard>
      </div>
      <div>
        <Styled.SceneCellStatsCard>
          <span>{threadCount}</span>
          <span>Threads</span>
        </Styled.SceneCellStatsCard>
      </div>
    </Styled.SceneCellStatsContainer>
  );
};
