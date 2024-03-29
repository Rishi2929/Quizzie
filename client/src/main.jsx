import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

export const Context = createContext({ isAuthenticated: false, selected: 0 })

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)


  return (
    <Context.Provider value={{
      isAuthenticated, setIsAuthenticated,
      loading, setLoading,
      selected, setSelected
    }}>
      <App />
    </Context.Provider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AppWrapper />
  // </React.StrictMode>
)
