import { useState } from 'react'
import './App.css'

import Sidebar from './Sidebar.jsx'

function App() {
  
  return(

    // create the grid layout for the main content
    <div className="app-grid">
      <Sidebar/>
      <main className="content">

      </main>
    </div>

  );

}

export default App
