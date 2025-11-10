import Navbar from "./components/Layout/Navbar";
import { Routes, Route, Navigate, useLocation } from "react-router";
import Home from "./pages/Home/Home";
import Drugs from "./pages/Brand/Brand";
import Footer from "./components/Layout/Footer";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import PageLoader from "./components/PageLoader/PageLoader";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";
import NewsPage from "./pages/NewsPage/NewsPage";
import TestPage from "./pages/TestPage/TestPage";
import Brand from "./pages/Brand/Brand";
import BrandDetail from "./pages/BrandDetails/BrandDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import Generic from "./pages/Generic/Generic";
import GenericDetail from "./pages/GenericDetails/GenericDetail";

import Pharmaceuticals from "./pages/Pharmaceutical/Pharmaceutical";
import PharmaceuticalDetail from "./pages/PharmaceuticalDetail/PharmaceuticalDetail";
import DoctorAdvice from "./pages/DoctorAdvice/DoctorAdvice";
import TestDetails from "./pages/TestDetails/TestDetails";
import GenericAllopathic from "./pages/GenericAllopathic/GenericAllopathic";
import BrandAllopathic from "./pages/BrandAllopathic/BrandAllopathic"
import Leaders from "./pages/Leaders/Leaders";
import LeaderDetail from "./pages/LeaderDetail/LeaderDetail";

const HIDE_NAVBAR = ["/v1/admin/dashboard"];
const HIDE_FOOTER = ["/v1/admin/dashboard"];

const App = () => {
  const location = useLocation();
  const { pathname } = location;

  const { authUser, authLoading } = useAuth();
  const isAuthenticated = Boolean(authUser);
  if (authLoading) return <PageLoader />;

  return (
    <div>
      <ScrollToTop />
      {!HIDE_NAVBAR.includes(pathname) && !pathname.startsWith("/admin") && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drugs" element={<Drugs />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/tests" element={<TestPage />} />
        <Route path="/tests/:id" element={<TestDetails />} />

        <Route path="/brands-allophathic" element={<BrandAllopathic/>} />
        <Route path="/brands-herbal" element={<Brand />} />
        <Route path="/brands/:id" element={<BrandDetail />} />

        <Route path="/generics-allophathic" element={<GenericAllopathic />} />
        <Route path="/generics-herbal" element={<Generic />} />
        <Route path="/generics/:id" element={<GenericDetail />} />

        <Route path="/pharmaceuticals" element={<Pharmaceuticals />} />
        <Route path="/pharmaceuticals/:id" element={<PharmaceuticalDetail />} />
        <Route path="/doctor-advice" element={<DoctorAdvice />} />

        <Route path="/leaders" element={<Leaders />} />
        <Route path="/leaders/:id" element={<LeaderDetail/>} />

        {/* Hidden Route */}
        <Route
          path="/v1/admin/login"
          element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/" />}
        />
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              authUser={authUser}
            />
          }
        >
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!HIDE_FOOTER.includes(pathname) && !pathname.startsWith("/admin") && (
        <Footer />
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default App;
