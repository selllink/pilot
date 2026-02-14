import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CreatePage } from './pages/CreatePage'
import { ViewPage } from './pages/ViewPage'
import { SuccessPage } from './pages/SuccessPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditPage } from './pages/EditPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CreatePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/create/success" element={<SuccessPage />} />
        <Route path="/v/:shortSlug" element={<ViewPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/edit/:id" element={<EditPage />} />
      </Route>
    </Routes>
  )
}

export default App
