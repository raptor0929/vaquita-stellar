import { InputHTMLAttributes } from "react";

interface IProps {
  readonly label: string;
  readonly value?: string;
  readonly onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly disabled?: boolean;
  readonly props?: InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
  };
}

export default function Input({ label, value, onChange, props }: IProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <label htmlFor={label} className="w-0 h-0 p-0 overflow-hidden">
        {label}
      </label>
      <input
        id={label}
        value={value}
        onChange={onChange}
        placeholder={label}
        disabled={props?.disabled}
        {...props}
        className={`px-4 py-2 bg-slate-100 rounded-xl text-slate-700 w-full ${props?.className}`}
      />
    </div>
  );
}
