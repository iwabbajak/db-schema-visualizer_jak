import { Group, Rect } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";

import KonvaText from "./dumb/KonvaText";
import FieldDetails from "./FieldDetails/FieldDetails";

import {
  COLUMN_HEIGHT,
  FONT_SIZES,
  PADDINGS,
  TABLE_COLOR_HEIGHT,
} from "@/constants/sizing";
import { useThemeColors } from "@/hooks/theme";
import { useTableColor } from "@/hooks/tableColor";
import { useTableColumnDimensions, useTableWidth } from "@/hooks/table";

const RESIZE_HANDLE_WIDTH = 8;

interface ResizeHandleProps {
  boundaryX: number;
  y: number;
  color: string;
  onResize: (boundaryX: number) => void;
}

const ResizeHandle = ({ boundaryX, y, color, onResize }: ResizeHandleProps) => {
  const handleDrag = (event: KonvaEventObject<DragEvent>) => {
    event.cancelBubble = true;
    onResize(event.target.x() + RESIZE_HANDLE_WIDTH / 2);
  };

  const stopTableDrag = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    event.cancelBubble = true;
  };

  return (
    <>
      <Rect
        x={boundaryX - 0.5}
        y={y}
        width={1}
        height={COLUMN_HEIGHT}
        fill={color}
        opacity={0.45}
        listening={false}
      />
      <Rect
        x={boundaryX - RESIZE_HANDLE_WIDTH / 2}
        y={y}
        width={RESIZE_HANDLE_WIDTH}
        height={COLUMN_HEIGHT}
        fill="rgba(0, 0, 0, 0.001)"
        draggable
        onMouseDown={stopTableDrag}
        onTouchStart={stopTableDrag}
        onDragStart={(event) => {
          event.cancelBubble = true;
        }}
        onDragMove={handleDrag}
        onDragEnd={handleDrag}
        onMouseEnter={(event) => {
          const stage = event.target.getStage();
          if (stage != null) stage.container().style.cursor = "col-resize";
        }}
        onMouseLeave={(event) => {
          const stage = event.target.getStage();
          if (stage != null) stage.container().style.cursor = "default";
        }}
      />
    </>
  );
};

interface TableHeaderProps {
  title: string;
  note?: string;
}

const TableHeader = ({ title, note }: TableHeaderProps) => {
  const themeColors = useThemeColors();
  const tableColors = useTableColor(title);
  const tablePreferredWidth = useTableWidth();
  const {
    fieldNameWidth,
    typeWidth,
    remarksWidth,
    resizeFieldBoundary,
    resizeRemarksBoundary,
  } = useTableColumnDimensions();
  const tableMarkerColor = tableColors?.regular ?? "red";
  const fieldsWidth = fieldNameWidth + typeWidth;
  const columnHeaderY = TABLE_COLOR_HEIGHT + COLUMN_HEIGHT * 2;

  return (
    <Group>
      <Rect
        cornerRadius={[PADDINGS.sm, PADDINGS.sm]}
        fill={tableMarkerColor}
        height={TABLE_COLOR_HEIGHT}
        width={tablePreferredWidth}
      />

      <Rect
        y={TABLE_COLOR_HEIGHT}
        fill={themeColors.tableHeader.bg}
        width={tablePreferredWidth}
        height={COLUMN_HEIGHT}
      />

      <KonvaText
        text={title}
        y={TABLE_COLOR_HEIGHT}
        fill={themeColors.tableHeader.fg}
        width={tablePreferredWidth}
        height={COLUMN_HEIGHT}
        align="center"
        strokeWidth={PADDINGS.xs}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.tableTitle}
      />

      <Rect
        y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT}
        fill={themeColors.tableHeader.bg}
        width={tablePreferredWidth}
        height={COLUMN_HEIGHT * 2}
      />

      <KonvaText
        text={note ?? ""}
        ellipsis
        wrap="none"
        x={PADDINGS.sm}
        y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT}
        fill={themeColors.text[700]}
        width={fieldsWidth - PADDINGS.sm}
        height={COLUMN_HEIGHT}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.md}
      />
      {note != null && note.length > 0 ? (
        <Group y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT}>
          <FieldDetails note={note} />
        </Group>
      ) : null}

      <KonvaText
        text="Field"
        x={PADDINGS.sm}
        y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT * 2}
        fill={themeColors.tableHeader.fg}
        width={fieldNameWidth}
        height={COLUMN_HEIGHT}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.md}
        fontStyle="bold"
      />
      <KonvaText
        text="Type"
        x={fieldNameWidth}
        y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT * 2}
        fill={themeColors.tableHeader.fg}
        width={typeWidth}
        height={COLUMN_HEIGHT}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.md}
        fontStyle="bold"
      />
      <KonvaText
        text="Remarks"
        x={fieldsWidth}
        y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT * 2}
        fill={themeColors.tableHeader.fg}
        width={remarksWidth}
        height={COLUMN_HEIGHT}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.md}
        fontStyle="bold"
      />
      <ResizeHandle
        boundaryX={fieldNameWidth}
        y={columnHeaderY}
        color={themeColors.tableHeader.fg}
        onResize={resizeFieldBoundary}
      />
      <ResizeHandle
        boundaryX={fieldsWidth}
        y={columnHeaderY}
        color={themeColors.tableHeader.fg}
        onResize={resizeRemarksBoundary}
      />
    </Group>
  );
};

export default TableHeader;
