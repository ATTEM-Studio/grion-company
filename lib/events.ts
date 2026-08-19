// Lightweight same-page communication between BottleneckSelector and
// DiagnosisForm, without pulling in a state-management library for one
// value. BottleneckSelector dispatches this when the visitor picks a
// bottleneck type; DiagnosisForm listens and prefills the "현재 가장 큰
// 고민" field so the self-diagnosis interaction carries through into the
// contact form instead of resetting to a blank ask.
export const BOTTLENECK_SELECTED_EVENT = "grion:bottleneck-selected";

export type BottleneckSelectedDetail = {
  concern: string;
};
