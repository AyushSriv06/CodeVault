import React from 'react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="h-screen w-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
                    <h1 className="text-2xl font-bold mb-4 text-destructive">Something went wrong.</h1>
                    <div className="bg-muted p-4 rounded-md mb-6 overflow-auto max-w-full w-full max-h-[500px]">
                        <p className="font-mono text-red-500 mb-2">{this.state.error && this.state.error.toString()}</p>
                        <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <Button onClick={() => window.location.reload()}>Reload Page</Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
