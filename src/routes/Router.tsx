import { createBrowserRouter, Navigate } from "react-router-dom";
import Results from "@/components/Results";
import WizardLayout from "../app/WizardLayout";
import { WizardProvider } from "../app/WizardContext";
import Step1Basics from "../steps/Step1Basics";
import Step2Problem from "../steps/Step2Problem";
import Step3Implementation from "../steps/Step3Implementation";
import Step4Finalize from "../steps/Step4Finalize";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/wizard/step-1" replace /> },
  { path: "/results", element: <Results /> },
  {
    path: "/wizard",
    element: (
      <WizardProvider>
        <WizardLayout />
      </WizardProvider>
    ),
    children: [
      { path: "step-1", element: <Step1Basics /> },
      { path: "step-2", element: <Step2Problem /> },
      { path: "step-3", element: <Step3Implementation /> },
      { path: "step-4", element: <Step4Finalize /> },
    ],
  },
]);