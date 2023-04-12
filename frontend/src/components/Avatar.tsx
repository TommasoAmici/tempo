import BoringAvatar from "boring-avatars";

type Props = {
  className?: string;
  seed: string;
};

export function Avatar({ className, seed }: Props) {
  return (
    <div className={className}>
      <BoringAvatar name={seed} variant="beam" />
    </div>
  );
}
