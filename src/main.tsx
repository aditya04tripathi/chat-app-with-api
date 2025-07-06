import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootProvider from "./components/Providers.tsx";
import { IndexPage } from "./pages/IndexPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import OnboardingPage from "./pages/OnboardingPage.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import { PoemsPage } from "./pages/PoemsPage.tsx";
import { OnePoemPage } from "./pages/OnePoemPage.tsx";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RootProvider>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Helmet>
                <title>Chat 💬 | I ❤️ YOU</title>
                <meta name="description" content="Welcome to my crush's gift. Start chatting with your partner!" />
              </Helmet>
              <IndexPage />
            </AppLayout>
          }
        />
        <Route
          path="/poems"
          element={
            <AppLayout>
              <Helmet>
                <title>Poems 📖 | I ❤️ YOU</title>
                <meta name="description" content="Explore a collection of beautiful poems." />
              </Helmet>
              <PoemsPage />
            </AppLayout>
          }
        />
        <Route
          path="/poems/:poemId"
          element={
            <AppLayout>
              <OnePoemPage />
            </AppLayout>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <AuthLayout>
              <Helmet>
                <title>Sign In | I ❤️ YOU</title>
                <meta name="description" content="Sign in to your account to continue using the app." />
              </Helmet>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <AuthLayout>
              <Helmet>
                <title>Sign Up | I ❤️ YOU</title>
                <meta name="description" content="Create an account to start using the app." />
              </Helmet>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </RootProvider>
  </BrowserRouter>
);
