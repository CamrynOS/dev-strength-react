import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'

import Sidebar from './Sidebar.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import AddWorkout from './Pages/AddWorkout/AddWorkout.jsx'
import History from './Pages/History/History.jsx'
import Stats from './Pages/Stats/Stats.jsx'
import ChangeSchedule from './Pages/History/History.jsx'

function App() {
  
  return(

    // create the grid layout for the main content
    <Router>
      <div className="app-grid">
        <Sidebar/>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-workout" element={<AddWorkout />} />
            <Route path="/history" element={<History />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/change-schedule" element={<ChangeSchedule />} />
          </Routes>
        </main>

      </div>
    </Router>
  );

}

export default App
