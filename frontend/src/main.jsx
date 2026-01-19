import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { store } from "./redux/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
        <Provider store={store}>
                <ErrorBoundary>
                        <App />
                </ErrorBoundary>
        </Provider>
);
