import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Explore from './pages/Explore'
import SavedLeads from './pages/SavedLeads'
import Campaigns from './pages/Campaigns'
import CampaignsCreate from './pages/CampaignsCreate'
import CampaignView from './pages/CampaignView'
import EmailTemplates from './pages/EmailTemplates'
import Settings from './pages/Settings'
import Support from './pages/Support'
import EmailTemplatesCreate from './pages/EmailTemplatesCreate'
import EmailTemplatesEdit from './pages/EmailTemplatesEdit'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            } />
            <Route path="/saved-leads" element={
              <ProtectedRoute>
                <SavedLeads />
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } />
            <Route path="/campaigns/create" element={
              <ProtectedRoute>
                <CampaignsCreate />
              </ProtectedRoute>
            } />
            <Route path="/campaigns/:id" element={
              <ProtectedRoute>
                <CampaignView />
              </ProtectedRoute>
            } />
            <Route path="/email-templates" element={
              <ProtectedRoute>
                <EmailTemplates />
              </ProtectedRoute>
            } />
            <Route path="/email-templates/create" element={
              <ProtectedRoute>
                <EmailTemplatesCreate />
              </ProtectedRoute>
            } />
            <Route path="/email-templates/edit/:id" element={
              <ProtectedRoute>
                <EmailTemplatesEdit />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App