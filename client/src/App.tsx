import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MyQuotes from "./pages/MySubscription";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import LocationLanding from "./pages/LocationLanding";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEdit from "./pages/AdminBlogEdit";
import KakaoChat from "./components/KakaoChat";
import Majang from "@/pages/Majang";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/my-quotes" component={MyQuotes} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/category/:slug" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/area/majang" component={Majang} />
      <Route path="/area/:slug" component={LocationLanding} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/blog/new" component={AdminBlogEdit} />
      <Route path="/admin/blog/:id/edit" component={AdminBlogEdit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
