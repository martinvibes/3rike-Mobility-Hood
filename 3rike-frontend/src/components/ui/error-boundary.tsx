// Top-level safety net. If any descendant throws during render or in a
// lifecycle hook, this catches it and shows a friendly retry screen instead
// of the white-screen-of-death. Keep it minimal — heavy logic here would
// itself be a source of crashes.

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // In production we'd ship this to Sentry / a logging service. For now,
    // logging to console is enough so devs can see the original stack.
    console.error("[ErrorBoundary] caught:", error, info);
  }

  handleReload = () => {
    // Full reload is the safest reset — clears any stuck React state without
    // touching session storage (so the user stays logged in).
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-100 bg-white shadow-2xl overflow-hidden min-h-200 relative flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-[#909090] mb-2 max-w-xs leading-relaxed">
            We hit an unexpected error. Reloading the page usually fixes it.
          </p>

          {/* Surface the message in a small dev-friendly drawer — keeps
              ordinary users from seeing a wall of stack trace, but doesn't
              hide it from anyone debugging. */}
          <details className="text-xs text-[#909090] mb-8 max-w-xs">
            <summary className="cursor-pointer hover:text-gray-600">
              Show technical details
            </summary>
            <pre className="text-left mt-2 p-3 bg-gray-50 rounded-lg overflow-x-auto text-[10px] font-mono whitespace-pre-wrap break-words">
              {this.state.error.message}
            </pre>
          </details>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={this.handleReload}
              className="h-12 bg-[#01C259] hover:bg-[#00a049] text-white rounded-xl font-medium cursor-pointer"
            >
              Reload page
            </Button>
            <Button
              onClick={this.handleGoHome}
              variant="ghost"
              className="h-11 text-gray-700 cursor-pointer"
            >
              Go to home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
