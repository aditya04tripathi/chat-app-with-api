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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RootProvider>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <IndexPage />
            </AppLayout>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </RootProvider>
  </BrowserRouter>,
);
