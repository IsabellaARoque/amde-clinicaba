export interface FocusGeometry {
  viewportTop: number;
  viewportHeight: number;
  inputTop: number;
  inputHeight: number;
  keyboardTop: number;
  scrollY: number;
}
export function focusedScrollTarget({
  viewportTop,
  viewportHeight,
  inputTop,
  inputHeight,
  keyboardTop,
  scrollY,
}: FocusGeometry): number {
  const top = viewportTop + 12;
  const bottom = Math.min(viewportTop + viewportHeight, keyboardTop) - 20;
  const delta =
    inputHeight > bottom - top
      ? inputTop - top
      : inputTop + inputHeight > bottom
      ? inputTop + inputHeight - bottom
      : inputTop < top
      ? inputTop - top
      : 0;
  return Math.max(0, scrollY + delta);
}
