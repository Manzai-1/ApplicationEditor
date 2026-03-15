import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Verify from '@/pages/Verify'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import CV from '@/pages/CV/CV'

function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/" element={<CV />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default Router
