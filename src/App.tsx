import { Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CreatePage } from './pages/CreatePage'
import { ViewPage } from './pages/ViewPage'
import { SuccessPage } from './pages/SuccessPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditPage } from './pages/EditPage'
import { SellerListingsPage } from './pages/SellerListingsPage'

function EditPageWithKey() {
  const location = useLocation()
  return <EditPage key={location.key} />
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CreatePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/create/success" element={<SuccessPage />} />
        <Route path="/v/:shortSlug" element={<ViewPage />} />
        <Route path="/u/:creatorSlug" element={<SellerListingsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/edit/:id" element={<EditPageWithKey />} />
      </Route>
    </Routes>
  )
}

export default App
