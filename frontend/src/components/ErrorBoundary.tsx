import { Component, ErrorInfo, ReactNode } from "react";

import BombIcon from "../assets/bomb.svg";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />;
    }

    return this.props.children;
  }
}

function DefaultFallback() {
  return <BombIcon />;
}
