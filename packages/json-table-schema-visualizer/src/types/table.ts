export interface TableDimensionProviderValue {
  width: number;
  fieldNameWidth: number;
  typeWidth: number;
  remarksWidth: number;
  resizeFieldBoundary: (boundaryX: number) => void;
  resizeRemarksBoundary: (boundaryX: number) => void;
}
