import { styled } from "@stitches/react";

const DateTimePicker = styled("input", {
  padding: "6px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
});

export default function DateTimeCellWithPicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: (newValue: string) => void;
}) {
  return (
    <DateTimePicker
      type="datetime-local"
      value={new Date(value).toISOString().slice(0, 16)} // Convert to 'YYYY-MM-DDTHH:MM'
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
