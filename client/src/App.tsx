import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MyQuotes from "./pages/MySubscription";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Records from "./pages/Records";
import LocationLanding from "./pages/LocationLanding";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEdit from "./pages/AdminBlogEdit";
import KakaoChat from "./components/KakaoChat";
import Navbar from "./components/Navbar";
import Majang from "@/pages/Majang";
import Daewol from "@/pages/Daewol";
import Sindun from "@/pages/Sindun";
import Downtown from "@/pages/Downtown";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (location === "/") {
      if (window.location.hash) {
        window.history.replaceState(null, "", "/");
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const hash = window.location.hash;

    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 120);

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function AreaNavbar() {
  const [location] = useLocation();

  if (!location.startsWith("/area/")) return null;

  return <Navbar />;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <AreaNavbar />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/my-quotes" component={MyQuotes} />
        <Route path="/blog" component={Records} />
        <Route path="/records" component={Records} />
        <Route path="/areas" component={Blog} />
        <Route path="/blog/category/:slug" component={Blog} />
        <Route path="/blog/:id" component={BlogDetail} />
        <Route path="/area/majang" component={Majang} />
        <Route path={"/area/Majang"} component={Majang} />
        <Route path="/area/daewol" component={Daewol} />
        <Route path="/area/sindun" component={Sindun} />
        <Route path="/area/downtown" component={Downtown} />
        <Route path="/area/:slug" component={LocationLanding} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/blog/new" component={AdminBlogEdit} />
        <Route path="/admin/blog/:id/edit" component={AdminBlogEdit} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <KakaoChat />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
