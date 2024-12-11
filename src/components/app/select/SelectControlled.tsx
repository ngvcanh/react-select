import { SelectPrimitive } from "./types";

export interface SelectControlledProps {
  name?: string;
  value: SelectPrimitive[];
  multiple?: boolean;
}

export function SelectControlled(props: SelectControlledProps) {
  const { name, value, multiple } = props;

  if (!name) {
    return null;
  }

  if (!multiple) {
    return (
      <input type="hidden" name={name} value={value[0]} />
    );
  }

  const multipleName = name.endsWith("[]") ? name : `${name}[]`;

  return (
    <>
      {value.map((v) => (
        <input key={v} type="hidden" name={multipleName} value={v} />
      ))}
    </>
  );
}
