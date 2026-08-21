import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../Layout/Root';
import MarketplaceHero from '../pages/MarketPlace';
import RegisterChoice from '../pages/RegisterChoice';
import OrganizationRegisterForm from '../pages/OrganizationRegisterForm';
import RegisterIndividualForm from '../pages/IndividualRegisterForm';
import Login from '../pages/Login';
import SingleProject from '../pages/SingleProject';
import Profile from '../pages/Profile';
import VerifyOtp from '../pages/VerifyOtp';
import ForgotPassword from '../pages/ForgotPassword';
import NotificationPage from '../pages/NotificationPage';
import HelpSupport from '../pages/HelpSupport';
import BugReport from '../pages/BugReport';
import ContactFormPage from '../pages/ContactFormPage';
import GlobalLogout from '../pages/GlobalLogout';
import Pricing from "../pages/Pricing";
import IndividualPricing from "../pages/IndividualPricing";
import PricingGateway from "../pages/PricingGateway";

import DashboardLayout from '../pages/DashboardLayout';
import Overview from '../Components/Dashboard/Overview';
import Certificates from '../Components/Dashboard/Certificates';
import Transactions from '../Components/Dashboard/Transactions';
import ProjectDetails from '../Components/Dashboard/ProjectDetails';
import ImpactGoals from '../Components/Dashboard/ImpactGoals';
import OrganizationOverview from '../Components/Dashboard/OrganizationOverview';
import TeamMembers from '../Components/Dashboard/TeamMembers';
import ESGReports from '../Components/Dashboard/ESGReports';
import APIAccess from '../Components/Dashboard/APIAccess';
import RequireAuth from '../Components/RequireAuth'; 
import ErrorPage from '../pages/ErrorPage';
import DashboardRedirect from "../Components/DashboardRedirect";
import FeatureGate from "../Components/FeatureGate";
import Settings from '../pages/Settings';
import MarketplaceHeroPage from '../pages/MarketplacePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route index element={<MarketplaceHeroPage />} />
        <Route path="MarketplaceHero" element={<MarketplaceHero />} />
        <Route path="/project/:id" element={<SingleProject />} />
          <Route path="MarketplaceHero/pricing" element={<Pricing />} />
  <Route path="MarketplaceHero/individual-pricing" element={<IndividualPricing />} />

      </Route>
 <Route path="/profile" element={<Profile />} />
      <Route path="/register-choice" element={<RegisterChoice />} />
      <Route
  path="/register"
  element={<OrganizationRegisterForm />}
/>

<Route
  path="/register-individual"
  element={<RegisterIndividualForm />}
/>

      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/logout" element={<GlobalLogout />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/notification" element={<NotificationPage />} />
           <Route path="/help" element={<HelpSupport />} />
           <Route path="/PricingGateway" element={<PricingGateway />} />
            <Route path="/report-bug" element={<BugReport />} />
               <Route path="/contact-form" element={<ContactFormPage />} />
                <Route path="/settings" element={<Settings />} />
                

                	 <Route 
  path="dashboard" 
  element={<RequireAuth><DashboardLayout /></RequireAuth>} 
  errorElement={<ErrorPage />}
>
  {/* Redirect to correct dashboard page based on role */}
  <Route index element={<DashboardRedirect />} />

  {/* Individual user routes */}
  <Route path="overview" element={<Overview />} />
  <Route path="certificates" element={<Certificates />} />
  <Route path="transactions" element={<Transactions />} />
  <Route path="MarketplaceHero" element={<MarketplaceHero />} />
  <Route path="project/:id" element={<ProjectDetails />} />
  <Route path="goals" element={<ImpactGoals allowedRoles={["individual"]} />} />

  {/* Business user routes */}
  <Route path="org-overview" element={<OrganizationOverview allowedRoles={["organization"]} />} />
<Route
  path="api-access"
  element={
    <FeatureGate feature="APIAccess">
      <APIAccess />
    </FeatureGate>
  }
/>

<Route
  path="team"
  element={
    <FeatureGate feature="Team">
      <TeamMembers />
    </FeatureGate>
  }
/>

<Route
  path="esg-reports"
  element={
    <FeatureGate feature="ESG Reports">
      <ESGReports />
    </FeatureGate>
  }
/>
</Route>
    </>
  )
);

export default router;
