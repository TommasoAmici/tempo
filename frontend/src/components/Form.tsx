type Props = JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLFormElement> &
  React.InputHTMLAttributes<HTMLFormElement>;

export function Form(props: Props) {
  return <form {...props} className="flex flex-col gap-4 rounded p-8 shadow-lg" />;
}
