import { Button } from "./Button";

type Props =
  | {
      heading: string;
      description: React.ReactNode;
      primaryAction?: never;
      secondaryAction?: never;
    }
  | {
      heading: string;
      description: React.ReactNode;
      primaryAction: React.ReactNode;
      secondaryAction?: never;
    }
  | {
      heading: string;
      description: React.ReactNode;
      primaryAction: React.ReactNode;
      /**
       * A secondary action can only be provided if a primary action is also provided.
       */
      secondaryAction: React.ReactNode;
    };

export function Hero({ heading, description, primaryAction, secondaryAction }: Props) {
  const hasActions =
    (primaryAction !== undefined && primaryAction !== null) ||
    (secondaryAction !== undefined && secondaryAction !== null);

  return (
    <section className="flex max-w-2xl flex-col items-center py-12">
      <p className="mb-8 text-center text-5xl font-extrabold lg:text-6xl xl:text-7xl">{heading}</p>
      <div className="max-w-xl text-center text-xl text-neutral-600">{description}</div>
      {hasActions && (
        <div className="mt-8 flex items-center gap-4">
          {primaryAction && (
            <Button variant="primary" size="large" as="div">
              {primaryAction}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" size="large" as="div">
              {secondaryAction}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
