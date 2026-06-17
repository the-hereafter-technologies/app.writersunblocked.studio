import ArrowDownIcon from "./icons/arrow-down.svg";
import * as Style from "./style";
import { EditorMode } from "./types";

const EditorModes = Object.values(EditorMode);

export interface ModeChangeProps {
  onChange: (mode: EditorMode) => void;
  mode: EditorMode;
}

/**
 * ModeChange description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered ModeChange component.
 */

export const ModeChange = ({ mode, onChange }: ModeChangeProps) => {
  return (
    <Style.ModeChangeContainer>
      <Style.ModeSelectContainer>
        <span className="connection-status" />
        <div>
          Mode{" "}
          <span className={`current-mode mode-${mode.toLowerCase()}`}>
            {mode}
          </span>
        </div>
        <button type="button">
          <ArrowDownIcon />
        </button>
      </Style.ModeSelectContainer>
      <Style.ModeListContainer>
        {EditorModes.map((modeOption) => (
          <li key={modeOption}>
            <Style.ModeOption
              type="button"
              onClick={() => onChange(modeOption)}
              $active={modeOption === mode}
            >
              {modeOption}
            </Style.ModeOption>
          </li>
        ))}
      </Style.ModeListContainer>
    </Style.ModeChangeContainer>
  );
};
