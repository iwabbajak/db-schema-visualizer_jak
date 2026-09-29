import { Group, Rect } from "react-konva";

import KonvaText from "./dumb/KonvaText";
import FieldDetails from "./FieldDetails/FieldDetails";

import {
  COLUMN_HEIGHT,
  FONT_SIZES,
  PADDINGS,
  TABLE_COLOR_HEIGHT,
  TABLE_REMARKS_COLUMN_WIDTH,
} from "@/constants/sizing";
import { useThemeColors } from "@/hooks/theme";
import { useTableColor } from "@/hooks/tableColor";
import { useTableWidth } from "@/hooks/table";

interface TableHeaderProps {
  title: string;
  note?: string;
}

const TableHeader = ({ title, note }: TableHeaderProps) => {
  const themeColors = useThemeColors();
  const tableColors = useTableColor(title);
  const tablePreferredWidth = useTableWidth();
  const tableMarkerColor = tableColors?.regular ?? "red";
  const fieldsWidth = tablePreferredWidth - TABLE_REMARKS_COLUMN_WIDTH;
  const fieldNameWidth = fieldsWidth * 0.58;

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
        width={tablePreferredWidth - TABLE_REMARKS_COLUMN_WIDTH - PADDINGS.sm}
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
        width={tablePreferredWidth - TABLE_REMARKS_COLUMN_WIDTH}
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
        width={fieldsWidth - fieldNameWidth}
        height={COLUMN_HEIGHT}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.md}
        fontStyle="bold"
      />
      <KonvaText
        text="Remarks"
        x={tablePreferredWidth - TABLE_REMARKS_COLUMN_WIDTH}
        y={TABLE_COLOR_HEIGHT + COLUMN_HEIGHT * 2}
        fill={themeColors.tableHeader.fg}
        width={TABLE_REMARKS_COLUMN_WIDTH}
        height={COLUMN_HEIGHT}
        padding={PADDINGS.xs}
        fontSize={FONT_SIZES.md}
        fontStyle="bold"
      />
    </Group>
  );
};

export default TableHeader;
