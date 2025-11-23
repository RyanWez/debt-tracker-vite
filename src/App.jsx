import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import ToastContainer from './components/ToastContainer';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Debts from './pages/Debts';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Lock from './pages/Lock';

function App() {
  return (
    <DataProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="debts" element={<Debts />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="lock" element={<Lock />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
