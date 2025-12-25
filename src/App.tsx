/**
 * App 根组件
 */

import { Route } from "@solidjs/router";
import { Header } from "./components/Header";
import { HomePage } from "./pages/Home";
import { ComponentsPage } from "./pages/Components";
import { SolidFlowPage } from "./pages/SolidFlow";
import { DocsPage } from "./pages/Docs";
import { BlocksPage } from "./pages/Blocks";
import { ChartsPage } from "./pages/Charts";

const App = () => {
  return (
    <div class="min-h-screen bg-background">
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/components" component={ComponentsPage} />
      <Route path="/solidflow" component={SolidFlowPage} />
      <Route path="/blocks" component={BlocksPage} />
      <Route path="/charts" component={ChartsPage} />
    </div>
  );
};

export default App;
