import { Routes, Route } from 'react-router-dom'
import Layout from '@/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Callback from '@/pages/Callback'
import Home from '@/pages/Home'

function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  )
}

export default Router
