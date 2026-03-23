import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/home";
import About from "./pages/about";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Contact from "./pages/contact";

import ConvertVideoToMp3 from "./pages/articles/convert-video-to-mp3";
import ConvertWithoutSoftware from "./pages/articles/convert-without-software";
import Mp3VsWav from "./pages/articles/mp3-vs-wav";
import ExtractAudio from "./pages/articles/extract-audio";
import MobileConvert from "./pages/articles/mobile-convert";

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
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/privacy-policy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/convert-video-to-mp3" component={ConvertVideoToMp3} />
      <Route path="/convert-without-software" component={ConvertWithoutSoftware} />
      <Route path="/mp3-vs-wav" component={Mp3VsWav} />
      <Route path="/extract-audio" component={ExtractAudio} />
      <Route path="/mobile-convert" component={MobileConvert} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
