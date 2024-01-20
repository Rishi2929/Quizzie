import './App.module.scss'
import Poll from './components/Poll';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'
import styles from './styles/Login.module.scss';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/analytics' element={<Analytics />} />
      </Routes>
    </Router>

  )
}

export default App
