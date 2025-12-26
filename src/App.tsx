/**
 * App 根组件
 */

import { Route, Router } from "@solidjs/router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { ComponentsPage } from "./pages/Components";
import { SolidFlowPage } from "./pages/SolidFlow";
import { DocsPage } from "./pages/Docs";
import { BlocksPage } from "./pages/Blocks";
import { ChartsPage } from "./pages/Charts";
import { WorkflowPage } from "./pages/Workflow";
import { FiberPage } from "./pages/Fiber";

const App = () => {
  return (
    <Router root={(props) => <Layout>{props.children}</Layout>}>
      <Route path="/" component={HomePage} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/components" component={ComponentsPage} />
      <Route path="/solidflow" component={SolidFlowPage} />
      <Route path="/blocks" component={BlocksPage} />
      <Route path="/charts" component={ChartsPage} />
      <Route path="/workflow" component={WorkflowPage} />
      <Route path="/fiber" component={FiberPage} />
    </Router>
  );
};

export default App;
