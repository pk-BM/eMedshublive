import React from "react";
import { Route, Routes } from "react-router";
import NotFound from "../../components/NotFound";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminAnalytics from "../../components/Admin/Analytics/AdminAnalytics";
import AllNews from "../../components/Admin/News/AllNews";
import CreateNews from "../../components/Admin/News/AdminCreateNews";
import AllBrands from "../../components/Admin/Brands/AllBrands";
import AdminCreateBrand from "../../components/Admin/Brands/AdminCreateBrand";
import AllGenerics from "../../components/Admin/Generics/AllGenerics";
import AdminCreateGeneric from "../../components/Admin/Generics/AdminCreateGeneric";
import AdminUpdateBrand from "../../components/Admin/Brands/AdminUpdateBrand";
import AdminUpdateNews from "../../components/Admin/News/AdminUpdateNews";
import AllAdverisement from "../../components/Admin/Advertisements/AllAdverisement";
import AllPharmaceutical from "../../components/Admin/Pharmaceuticals/AllPharmaceutical";
import AllDoctors from "../../components/Admin/DoctorsAdvice/AllDoctors";
import AdminCreateDoctorAdvice from "../../components/Admin/DoctorsAdvice/AdminCreateDoctor";
import AdminUpdateDoctor from "../../components/Admin/DoctorsAdvice/AdminUpdateDoctor";
import AdminCreatePharmaceuticals from "../../components/Admin/Pharmaceuticals/AdminCreatePharmaceuticals";
import AdminUpdatePharmaceuticals from "../../components/Admin/Pharmaceuticals/AdminUpdatePharmaceuticals";
import AdminCreateAdvertisement from "../../components/Admin/Advertisements/AdminCreateAdvertisement";
import AdminUpdateAdvertisements from "../../components/Admin/Advertisements/AdminUpadateAdvertisement";
import AdminUpdateGenerics from "../../components/Admin/Generics/AdminUpdateGenerics";
import AllTests from "../../components/Admin/Tests/AllTests";
import AdminCreateTest from "../../components/Admin/Tests/AdminCreateTests";
import AdminUpdateTest from "../../components/Admin/Tests/AdminUpdateTests";
import AllTrustedCenter from "../../components/Admin/TrustedCenter/AllTrustedCenter";
import AdminCreateTrustedCenter from "../../components/Admin/TrustedCenter/AdminCreateTestedCenter";
import AdminUpdateTrustedCenter from "../../components/Admin/TrustedCenter/AdminUpdateTestedCenter";
import AdminCreateLeader from "../../components/Admin/Leaders/AdminCreateLeader";
import AllLeader from "../../components/Admin/Leaders/AllLeader";
import AdminUpdateLeader from "../../components/Admin/Leaders/AdminUpdateLeader";
import AdminAllBanners from "../../components/Admin/Banner/AdminAllBanners";
import AdminCreateBanner from "../../components/Admin/Banner/AdminCreateBanner";
import AdminUpdateBanner from "../../components/Admin/Banner/AdminUpdateBanner";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block w-64">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <AdminSidebar />
      </div>

      {/* Content Area */}
      <div className="flex-1 md:p-4 mt-14 md:mt-10 lg:mt-0">
        <Routes>
          <Route path="/dashboard" element={<AdminAnalytics />} />
          <Route path="/news" element={<AllNews />} />
          <Route path="/news/create" element={<CreateNews />} />
          <Route path="/news/update/:id" element={<AdminUpdateNews />} />

          <Route path="/generic" element={<AllGenerics />} />
          <Route path="/generic-create" element={<AdminCreateGeneric />} />
          <Route path="/generic-update/:id" element={<AdminUpdateGenerics />} />

          <Route path="/brands" element={<AllBrands />} />
          <Route path="/brand-create" element={<AdminCreateBrand />} />
          <Route path="/brand-update/:id" element={<AdminUpdateBrand />} />

          <Route path="/medical-test" element={<AllTests />} />
          <Route path="/medical-test/create" element={<AdminCreateTest />} />
          <Route
            path="/medical-test/update/:id"
            element={<AdminUpdateTest />}
          />

          <Route path="/trusted-center" element={<AllTrustedCenter />} />
          <Route
            path="/trusted-center/create"
            element={<AdminCreateTrustedCenter />}
          />
          <Route
            path="/trusted-center/update/:id"
            element={<AdminUpdateTrustedCenter />}
          />

          <Route path="/advertisement" element={<AllAdverisement />} />
          <Route
            path="/advertisement/create"
            element={<AdminCreateAdvertisement />}
          />
          <Route
            path="/advertisement/update/:id"
            element={<AdminUpdateAdvertisements />}
          />

          <Route path="/pharmaceuticals" element={<AllPharmaceutical />} />
          <Route
            path="/pharmaceuticals/create"
            element={<AdminCreatePharmaceuticals />}
          />
          <Route
            path="/pharmaceuticals/update/:id"
            element={<AdminUpdatePharmaceuticals />}
          />

          <Route path="/doctors" element={<AllDoctors />} />
          <Route path="/doctors/create" element={<AdminCreateDoctorAdvice />} />
          <Route path="/doctors/update/:id" element={<AdminUpdateDoctor />} />

          <Route path="/leaders" element={<AllLeader />} />
          <Route path="/leaders/create" element={<AdminCreateLeader />} />
          <Route path="/leaders/update/:id" element={<AdminUpdateLeader />} />

          <Route path="/banners" element={<AdminAllBanners />} />
          <Route path="/banner/create" element={<AdminCreateBanner />} />
          <Route path="/banner/update/:id" element={<AdminUpdateBanner />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
