interface IProps {
  readonly children?: React.ReactNode;
  readonly onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  readonly props?: { [key: string]: string };
}

export default function Button({ children, onClick, props }: IProps) {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`px-4 py-2 bg-green-500 rounded rounded-xl font-semibold ${props?.className}`}
    >
      {children}
    </button>
  );
}
