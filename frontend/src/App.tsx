import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/Layout/DashboardLayout";
import PumpToken from "./pages/PumpToken";
import PumpHistory from "./pages/PumpHistory";
import "@coinbase/onchainkit/styles.css";
import OnchainProviders from "./context/OnchainProviders";

function App() {
  return (
    <OnchainProviders>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="pump" element={<PumpToken />} />
              <Route path="history" element={<PumpHistory />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </OnchainProviders>
  );
}

export default App;
