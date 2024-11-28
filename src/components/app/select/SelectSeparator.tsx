export interface SelectSeparatorProps {
  enabled: boolean;
}

export function SelectSeparator(props: SelectSeparatorProps) {
  const { enabled } = props;

  if (!enabled) {
    return null;
  }

  return (
    <div className="w-px h-4 bg-gray-200" />
  );
}
