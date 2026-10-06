import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { TableDimensionProviderValue } from "@/types/table";
import { TABLE_REMARKS_COLUMN_WIDTH } from "@/constants/sizing";

export const TableDimensionContext = createContext<
  TableDimensionProviderValue | undefined
>(undefined);

interface TablesInfoProviderProps {
  width: number;
  children: ReactNode;
}

const MIN_COLUMN_WIDTH = 60;

const TableDimensionProvider = ({
  children,
  width,
}: TablesInfoProviderProps) => {
  const [fieldNameWidth, setFieldNameWidth] = useState(
    () => (width - TABLE_REMARKS_COLUMN_WIDTH) * 0.58,
  );
  const [remarksWidth, setRemarksWidth] = useState(TABLE_REMARKS_COLUMN_WIDTH);

  useEffect(() => {
    setFieldNameWidth((width - TABLE_REMARKS_COLUMN_WIDTH) * 0.58);
    setRemarksWidth(TABLE_REMARKS_COLUMN_WIDTH);
  }, [width]);

  const typeWidth = width - fieldNameWidth - remarksWidth;

  const resizeFieldBoundary = useCallback(
    (boundaryX: number) => {
      setFieldNameWidth(
        Math.max(
          MIN_COLUMN_WIDTH,
          Math.min(boundaryX, width - remarksWidth - MIN_COLUMN_WIDTH),
        ),
      );
    },
    [remarksWidth, width],
  );

  const resizeRemarksBoundary = useCallback(
    (boundaryX: number) => {
      setRemarksWidth(
        Math.max(
          MIN_COLUMN_WIDTH,
          Math.min(width - boundaryX, width - fieldNameWidth - MIN_COLUMN_WIDTH),
        ),
      );
    },
    [fieldNameWidth, width],
  );

  const contextValue = useMemo(() => {
    return {
      width,
      fieldNameWidth,
      typeWidth,
      remarksWidth,
      resizeFieldBoundary,
      resizeRemarksBoundary,
    };
  }, [
    fieldNameWidth,
    remarksWidth,
    resizeFieldBoundary,
    resizeRemarksBoundary,
    typeWidth,
    width,
  ]);

  return (
    <TableDimensionContext.Provider value={contextValue}>
      {children}
    </TableDimensionContext.Provider>
  );
};

export default TableDimensionProvider;
