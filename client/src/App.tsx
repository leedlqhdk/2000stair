import { lazy, Suspense, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Seo from "./components/Seo";
import { ThemeProvider } from "./contexts/ThemeContext";
import { getSeoForPath } from "@/data/areaSeo";
import { initAnalytics, trackPageview } from "@/lib/analytics";
import Home from "./pages/Home";
import KakaoChat from "./components/KakaoChat";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const MyQuotes = lazy(() => import("./pages/MySubscription"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Records = lazy(() => import("./pages/Records"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));
const NeighborhoodArea = lazy(() => import("./pages/NeighborhoodArea"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminBlogEdit = lazy(() => import("./pages/AdminBlogEdit"));
const AdminField = lazy(() => import("./pages/AdminField"));
const AdminFieldArea = lazy(() => import("./pages/AdminFieldArea"));
const AdminQuotes = lazy(() => import("./pages/AdminQuotes"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const Majang = lazy(() => import("@/pages/Majang"));
const Daewol = lazy(() => import("@/pages/Daewol"));
const Sindun = lazy(() => import("@/pages/Sindun"));
const Bubal = lazy(() => import("@/pages/Bubal"));
const Baeksa = lazy(() => import("@/pages/Baeksa"));
const Gonjiam = lazy(() => import("@/pages/Gonjiam"));
const About = lazy(() => import("@/pages/About"));
const Qna = lazy(() => import("@/pages/Qna"));
const BeforeAfter = lazy(() => import("@/pages/BeforeAfter"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Services = lazy(() => import("./pages/Services"));
const StairCleaning = lazy(() => import("./pages/StairCleaning"));
const BathroomCleaning = lazy(() => import("./pages/BathroomCleaning"));
const GlassCleaning = lazy(() => import("./pages/GlassCleaning"));
const OfficeCleaning = lazy(() => import("./pages/OfficeCleaning"));
const OpsStatus = lazy(() => import("@/pages/OpsStatus"));
const Guide = lazy(() => import("@/pages/Guide"));
const Areas = lazy(() => import("@/pages/Areas"));
const MobileQuote = lazy(() => import("@/pages/MobileQuote"));
const Card = lazy(() => import("@/pages/Card"));

function ScrollToTop() {
  const [location] = useLocation();
  const previousLocation = useRef(location);
  const positions = useRef(new Map<string, number>());
  const isBackOrForward = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let frame = 0;
    const saveHistoryPosition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const state = window.history.state && typeof window.history.state === "object"
          ? window.history.state
          : {};
        window.history.replaceState({ ...state, __scrollY: window.scrollY }, "");
      });
    };

    const handlePopState = () => {
      isBackOrForward.current = true;
    };

    window.addEventListener("popstate", handlePopState, true);
    window.addEventListener("scroll", saveHistoryPosition, { passive: true });
    saveHistoryPosition();

    return () => {
      window.removeEventListener("popstate", handlePopState, true);
      window.removeEventListener("scroll", saveHistoryPosition);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const previousPath = previousLocation.current;

    if (previousPath !== location) {
      positions.current.set(previousPath, window.scrollY);
    }

    previousLocation.current = location;
    const hash = window.location.hash;
    const delay = hash && location !== "/" ? 120 : 0;

    const scrollTimer = window.setTimeout(() => {
      const historyPosition = Number(window.history.state?.__scrollY);
      const shouldRestoreHome = location === "/" && Number.isFinite(historyPosition) && historyPosition > 0;

      if (isBackOrForward.current || shouldRestoreHome) {
        isBackOrForward.current = false;
        const savedPosition = shouldRestoreHome
          ? historyPosition
          : positions.current.get(location) ?? 0;

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: savedPosition, left: 0, behavior: "auto" });
          });
        });
        return;
      }

      if (location === "/") {
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      if (hash) {
        const element = document.querySelector(hash);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, delay);

    return () => window.clearTimeout(scrollTimer);
  }, [location]);

  return null;
}

function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageview(location);
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
    setLocation("/admin/quotes");
  }, [setLocation]);

  return null;
}

function WorkRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/records");
  }, [setLocation]);

  return null;
}

function RouteRedirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [setLocation, to]);

  return null;
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

function GwangoArea() {
  return <NeighborhoodArea areaSlug="gwango" />;
}

function ChangjeonArea() {
  return <NeighborhoodArea areaSlug="changjeon" />;
}

function JungniArea() {
  return <NeighborhoodArea areaSlug="jungni" />;
}

function JeungpoArea() {
  return <NeighborhoodArea areaSlug="jeungpo" />;
}

function AdminNoIndex() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  const routeSeo = getSeoForPath(location);
  const routeRobots = routeSeo && "robots" in routeSeo ? routeSeo.robots : undefined;

  useEffect(() => {
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');

    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }

    if (isAdminRoute) {
      document.title = "관리자 페이지 | 이천계단지기";
      robots.setAttribute("content", "noindex, nofollow, noarchive");
      return;
    }

    robots.setAttribute("content", routeRobots ?? "index, follow");
  }, [isAdminRoute, routeRobots]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <AnalyticsTracker />
      <AdminNoIndex />
      <RouteSeo />
      <AreaNavbar />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path="/about" component={About} />
          <Route path="/qna" component={Qna} />
          <Route path="/before-after" component={BeforeAfter} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/services" component={Services} />
          <Route path="/services/stair" component={StairCleaning} />
          <Route path="/services/bathroom" component={BathroomCleaning} />
          <Route path="/services/glass" component={GlassCleaning} />
          <Route path="/services/office" component={OfficeCleaning} />
          <Route path="/ops" component={OpsStatus} />
          <Route path="/guide" component={Guide} />
          <Route path="/my-quotes" component={MyQuotes} />
          <Route path="/blog">
            <RouteRedirect to="/records" />
          </Route>
          <Route path="/records" component={Records} />
          <Route path="/work" component={WorkRedirect} />
          <Route path="/work/:slug" component={WorkDetail} />
          <Route path="/areas" component={Areas} />
          <Route path="/quote" component={MobileQuote} />
          <Route path="/card" component={Card} />
          <Route path="/blog/category/:slug" component={Blog} />
          <Route path="/blog/:id" component={BlogDetail} />
          <Route path="/area/majang" component={Majang} />
          <Route path={"/area/Majang"}>
            <RouteRedirect to="/area/majang" />
          </Route>
          <Route path="/area/daewol" component={Daewol} />
          <Route path="/area/sindun" component={Sindun} />
          <Route path="/area/downtown">
            <RouteRedirect to="/areas" />
          </Route>
          <Route path="/area/gwango" component={GwangoArea} />
          <Route path="/area/changjeon" component={ChangjeonArea} />
          <Route path="/area/jungni" component={JungniArea} />
          <Route path="/area/jeungpo" component={JeungpoArea} />
          <Route path="/area/songjeong">
            <RouteRedirect to="/area/jungni" />
          </Route>
          <Route path="/area/bubal" component={Bubal} />
          <Route path="/area/baeksa" component={Baeksa} />
          <Route path="/area/gonjiam" component={Gonjiam} />
          <Route path="/area/:slug" component={LocationLanding} />
          <Route path="/admin" component={AdminRedirect} />
          <Route path="/admin/quotes" component={AdminQuotes} />
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/field/areas/:slug" component={AdminFieldArea} />
          <Route path="/admin/field" component={AdminField} />
          <Route path="/admin/reviews" component={AdminReviews} />
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
  const isBareRoute = location === "/card";
  const hideChrome = isAdminRoute || isBareRoute;
  const hideFooter = hideChrome;

  return (
    <>
      <Router />
      {!hideFooter && <Footer />}
      {!hideChrome && <ScrollToTopButton />}
      {!hideChrome && <KakaoChat />}
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
