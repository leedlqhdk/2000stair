import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Seo from "./components/Seo";
import { ThemeProvider } from "./contexts/ThemeContext";
import { getSeoForPath } from "@/data/areaSeo";
import Home from "./pages/Home";
import KakaoChat from "./components/KakaoChat";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const MyQuotes = lazy(() => import("./pages/MySubscription"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Records = lazy(() => import("./pages/Records"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminBlogEdit = lazy(() => import("./pages/AdminBlogEdit"));
const AdminField = lazy(() => import("./pages/AdminField"));
const Majang = lazy(() => import("@/pages/Majang"));
const Daewol = lazy(() => import("@/pages/Daewol"));
const Sindun = lazy(() => import("@/pages/Sindun"));
const Downtown = lazy(() => import("@/pages/Downtown"));
const Bubal = lazy(() => import("@/pages/Bubal"));
const Baeksa = lazy(() => import("@/pages/Baeksa"));
const Gonjiam = lazy(() => import("@/pages/Gonjiam"));
const NeighborhoodArea = lazy(() => import("@/pages/NeighborhoodArea"));
const About = lazy(() => import("@/pages/About"));
const Qna = lazy(() => import("@/pages/Qna"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Services = lazy(() => import("./pages/Services"));
const StairCleaning = lazy(() => import("./pages/StairCleaning"));
const BathroomCleaning = lazy(() => import("./pages/BathroomCleaning"));
const GlassCleaning = lazy(() => import("./pages/GlassCleaning"));
const OfficeCleaning = lazy(() => import("./pages/OfficeCleaning"));
const OpsStatus = lazy(() => import("@/pages/OpsStatus"));
const Guide = lazy(() => import("@/pages/Guide"));


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

function AdminRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/admin/blog");
  }, [setLocation]);

  return null;
}

function GwangoArea() {
  return <NeighborhoodArea areaSlug="gwango" />;
}

function ChangjeonArea() {
  return <NeighborhoodArea areaSlug="changjeon" />;
}

function SongjeongArea() {
  return <NeighborhoodArea areaSlug="songjeong" />;
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

function AdminNoIndex() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  useEffect(() => {
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');

    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }

    if (isAdminRoute) {
      document.title = "ê´ë¦¬ì íì´ì§ | ì´ì²ê³ë¨ì§ê¸°";
      robots.setAttribute("content", "noindex, nofollow, noarchive");
      return;
    }

    robots.setAttribute("content", "index, follow");
  }, [isAdminRoute]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <AdminNoIndex />
      <RouteSeo />
      <AreaNavbar />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path="/about" component={About} />
          <Route path="/qna" component={Qna} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/services" component={Services} />
          <Route path="/services/stair" component={StairCleaning} />
          <Route path="/services/bathroom" component={BathroomCleaning} />
          <Route path="/services/glass" component={GlassCleaning} />
          <Route path="/services/office" component={OfficeCleaning} />
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
          <Route path="/area/gwango" component={GwangoArea} />
          <Route path="/area/changjeon" component={ChangjeonArea} />
          <Route path="/area/songjeong" component={SongjeongArea} />
          <Route path="/area/bubal" component={Bubal} />
          <Route path="/area/baeksa" component={Baeksa} />
          <Route path="/area/gonjiam" component={Gonjiam} />
          <Route path="/area/:slug" component={LocationLanding} />
          <Route path="/admin" component={AdminRedirect} />
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/field" component={AdminField} />
          <Route path="/admin/blog/new" component={AdminBlogEdit} />
          <Route path="/admin/blog/:id/edit" component={AdminBlogEdit} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function AppChrome() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      <Router />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <KakaoChat />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppChrome />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
