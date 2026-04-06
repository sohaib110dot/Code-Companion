import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Privacy = lazy(() => import("./pages/privacy"));
const Terms = lazy(() => import("./pages/terms"));
const Contact = lazy(() => import("./pages/contact"));
const Disclaimer = lazy(() => import("./pages/disclaimer"));
const FAQs = lazy(() => import("./pages/faqs"));
const DMCA = lazy(() => import("./pages/dmca"));

const ConvertVideoToMp3 = lazy(() => import("./pages/articles/convert-video-to-mp3"));
const ConvertWithoutSoftware = lazy(() => import("./pages/articles/convert-without-software"));
const Mp3VsWav = lazy(() => import("./pages/articles/mp3-vs-wav"));
const ExtractAudio = lazy(() => import("./pages/articles/extract-audio"));
const MobileConvert = lazy(() => import("./pages/articles/mobile-convert"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/privacy-policy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/contact" component={Contact} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/faqs" component={FAQs} />
        <Route path="/dmca" component={DMCA} />
        <Route path="/convert-video-to-mp3" component={ConvertVideoToMp3} />
        <Route path="/convert-without-software" component={ConvertWithoutSoftware} />
        <Route path="/mp3-vs-wav" component={Mp3VsWav} />
        <Route path="/extract-audio" component={ExtractAudio} />
        <Route path="/mobile-convert" component={MobileConvert} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
