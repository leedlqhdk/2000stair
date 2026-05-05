import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MyQuotes from "./pages/MySubscription";
import KakaoChat from "./components/KakaoChat";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/my-quotes" component={MyQuotes} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <KakaoChat />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
