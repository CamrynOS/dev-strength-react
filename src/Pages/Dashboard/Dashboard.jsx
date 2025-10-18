import styles from './Dashboard.module.css'

function Dashboard() {

    return(
        <main>
            <h1 className='page-title'>Dashboard</h1>
            <div className={styles.streakWidget}>
                <h2>0 Day Streak</h2>
            </div>
            <div className='widget-container'>
                <div className="widget">
                    <h2 className="widget-header">Last Workout</h2>
                </div>
                <div className="widget">
                    <h2 className="widget-header">Today's Workout</h2>
                </div>
            </div>
        </main>
        
    );

}

export default Dashboard