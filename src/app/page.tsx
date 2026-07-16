import Navbar from "@/src/app/home-components/Navbar";
import Hero from "@/src/app/home-components/Hero";

import WebDevelopmentIntro from "@/src/app/home-components/WebDevelopment";
import SecureAuth from "@/src/app/home-components/SecureAuth";
import AnalyticsDashboard from "@/src/app/home-components/AnalyticsDashboard";
import ProductManagement from "@/src/app/home-components/ProductManagement";
import AuditLogging from "@/src/app/home-components/AuditLogging";
import MultiTenantStore from "@/src/app/home-components/MultiTenantStore";
import Technologies from "@/src/app/home-components/Technologies";
import EngineeringHighlights from "@/src/app/home-components/EngineeringHighlights";

import SoftwareTesting from "@/src/app/home-components/SoftwareTesting";
import UnitTesting from "@/src/app/home-components/UnitTesting";
import IntegrationTesting from "@/src/app/home-components/IntegrationTesting";
import EndToEndTesting from "@/src/app/home-components/EndToEndTesting";
import PerformanceTesting from "@/src/app/home-components/PerformanceTesting";
import ProjectOutcome from "@/src/app/home-components/ProjectOutcome";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <Hero />

      {/* ================= WEB DEVELOPMENT ================= */}
      <section id="web-development">
        <WebDevelopmentIntro />
        <SecureAuth />
        <AnalyticsDashboard />
        <ProductManagement />
        <AuditLogging />
        <MultiTenantStore />
        <Technologies />
        <EngineeringHighlights />
      </section>

      {/* ================= SOFTWARE TESTING ================= */}
      <section id="software-testing">
        <SoftwareTesting />
        <UnitTesting />
        <IntegrationTesting />
        <EndToEndTesting />
        <PerformanceTesting />
      </section>

      {/* ================= PROJECT OUTCOME ================= */}
      <section id="project-outcome">
        <ProjectOutcome />
      </section>
    </main>
  );
}
