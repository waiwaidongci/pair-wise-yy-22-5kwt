import { useState, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { DashboardPage } from "./pages/DashboardPage";
import { RelicsPage } from "./pages/RelicsPage";
import { DamagesPage } from "./pages/DamagesPage";
import { PlansPage } from "./pages/PlansPage";
import { ImagesPage } from "./pages/ImagesPage";
import "./styles.css";

const PAGE_VIEWS: Record<string, () => ReactElement> = {
  "/dashboard": DashboardPage,
  "/relics": RelicsPage,
  "/damages": DamagesPage,
  "/plans": PlansPage,
  "/images": ImagesPage
};

function PlaceholderPage({ name }: { name: string }) {
  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>{name}</h1>
        </div>
      </section>
      <section className="panel">
        <p>该模块仍在建设中，影像对照档案请前往「影像版本」页。</p>
      </section>
    </main>
  );
}

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const current = routes.find((route) => route.route === active) ?? routes[0];
  const View = PAGE_VIEWS[active] ?? (() => <PlaceholderPage name={current?.name ?? ""} />);
  return (
    <div className="shell">
      <aside>
        <div className="brand">文物修复档案协作平台</div>
        <nav>
          {routes.map((route) => (
            <button
              key={route.route}
              className={active === route.route ? "active" : ""}
              onClick={() => setActive(route.route)}
            >
              {route.name}
            </button>
          ))}
        </nav>
      </aside>
      <View />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
