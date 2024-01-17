import './App.module.scss'
import Dashboard from './pages/DashboardPage/Dashboard';
import Login from './pages/LoginPage/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Dashboard />} />
      </Routes>
    </Router>

  )
}

export default App
