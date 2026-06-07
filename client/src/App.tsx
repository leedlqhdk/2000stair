import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Seo from "./components/Seo";
import { ThemeProvider } from "./contexts/ThemeContext";
import { getSeoForPath } from "@/data/areaSeo";
import Home from "./pages/Home";
import MyQuotes from "./pages/MySubscription";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Records from "./pages/Records";
import WorkDetail from "./pages/WorkDetail";
import LocationLanding from "./pages/LocationLanding";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEdit from "./pages/AdminBlogEdit";
import KakaoChat from "./components/KakaoChat";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Majang from "@/pages/Majang";
import Daewol from "@/pages/Daewol";
import Sindun from "@/pages/Sindun";
import Downtown from "@/pages/Downtown";
import Bubal from "@/pages/Bubal";
import Baeksa from "@/pages/Baeksa";
import About from "@/pages/About";
import Qna from "@/pages/Qna";
import OpsStatus from "@/pages/OpsStatus";
import Guide from "@/pages/Guide";

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

function RouteSeo() {
  const [location] = useLocation();
  const seo = getSeoForPath(location);

  if (!seo) return null;

  return <Seo {...seo} />;
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
      <RouteSeo />
      <AreaNavbar />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/about" component={About} />
        <Route path="/qna" component={Qna} />
        <Route path="/ops" component={OpsStatus} />
        <Route path="/guide" component={Guide} />
        <Route path="/my-quotes" component={MyQuotes} />
        <Route path="/blog" component={Records} />
        <Route path="/records" component={Records} />
        <Route path="/work/:slug" component={WorkDetail} />
        <Route path="/areas" component={Blog} />
        <Route path="/blog/category/:slug" component={Blog} />
        <Route path="/blog/:id" component={BlogDetail} />
        <Route path="/area/majang" component={Majang} />
        <Route path={"/area/Majang"} component={Majang} />
        <Route path="/area/daewol" component={Daewol} />
        <Route path="/area/sindun" component={Sindun} />
        <Route path="/area/downtown" component={Downtown} />
        <Route path="/area/bubal" component={Bubal} />
        <Route path="/area/baeksa" component={Baeksa} />
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
          <Footer />
          <KakaoChat />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
