import PropTypes from "prop-types";

import AutoArrangeTableButton from "./AutoArrage/AutoArrangeTables";
import ThemeToggler from "./ThemeToggler/ThemeToggler";
import DetailLevelToggle from "./DetailLevelToggle/DetailLevelToggle";
import FitToViewButton from "./FitToView/FitToView";
import ExportButton from "./Export/Export";

const Toolbar = ({
  onFitToView,
  onDownload,
  zoomScale,
  onZoomChange,
}: {
  onFitToView: () => void;
  onDownload: () => void;
  zoomScale: number;
  onZoomChange: (scale: number) => void;
}) => {
  return (
    <div className="flex absolute [&_svg]:w-5 [&_svg]:h-5 px-6 py-1 bottom-14 text-sm bg-gray-100 dark:bg-gray-700 shadow-lg rounded-2xl">
      <AutoArrangeTableButton />
      <DetailLevelToggle />
      <FitToViewButton onClick={onFitToView} />
      <hr className="mx-4 my-1 w-px h-6 bg-gray-300" />
      <label className="flex items-center gap-2 px-2" title="Zoom diagram">
        <span className="sr-only">Zoom diagram</span>
        <input
          aria-label="Zoom diagram"
          type="range"
          min={5}
          max={400}
          step={1}
          value={Math.round(zoomScale * 100)}
          onChange={(event) => {
            onZoomChange(Number(event.currentTarget.value) / 100);
          }}
          className="w-28 cursor-pointer accent-blue-600"
        />
        <output className="w-10 text-right tabular-nums" aria-live="polite">
          {Math.round(zoomScale * 100)}%
        </output>
      </label>
      <hr className="mx-4 my-1 w-px h-6 bg-gray-300" />
      <ExportButton onDownload={onDownload} />
      <hr className="mx-4 my-1 w-px h-6 bg-gray-300" />
      <ThemeToggler />
    </div>
  );
};

Toolbar.propTypes = {
  onFitToView: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  zoomScale: PropTypes.number.isRequired,
};

export default Toolbar;
