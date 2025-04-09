
export interface CVColorStyles {
  background: string;
  leftCol: string;
  text: string;
  subtext: string;
  headerText: string;
  accent: string;
  border: string;
  sectionHeader: string;
  badge: string;
  separator: string;
}

export const getAppleInspiredColors = (): CVColorStyles => {
  // Always return light theme colors for CV view
  return {
    background: "bg-white",
    leftCol: "bg-gray-50",
    text: "text-gray-800",
    subtext: "text-gray-500",
    headerText: "text-black",
    accent: "text-blue-600",
    border: "border-gray-200",
    sectionHeader: "text-blue-600 font-semibold",
    badge: "bg-blue-50 text-blue-700",
    separator: "bg-gray-200"
  };
};
