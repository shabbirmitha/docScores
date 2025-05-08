import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
