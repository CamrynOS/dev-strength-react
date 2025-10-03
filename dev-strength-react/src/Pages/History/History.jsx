import { useEffect, useState } from 'react';
import styles from './History.module.css'

function History() {

    // state variables
    const [workouts, setWorkouts] = useState([]); // stores the workouts from localStorage
    const [sortBy, setSortBy] = useState("date-desc"); // current sort option selected
    const [expandedRows, setExpandedRows] = useState([]); // track which rows are expanded
    const [searchQuery, setSearchQuery] = useState(""); // current search input 

    // load the workouts saved in localStorage when the component mounts
    useEffect(() =>{
        const savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
        setWorkouts(savedWorkouts);
    }, []);

    /**
     * @description deletes a workout by index
     * @param {int} idx index of the workout to be deleted
     */
    const handleDeleteBtn = (idx) => {
        const updated = [...workouts];
        if (confirm(`Are you sure you want to delete the workout on ${updated[idx].date}?`)) {
            updated.splice(idx, 1); // remove the workout and only that 1 workout
            setWorkouts(updated); // update the workouts state
            localStorage.setItem("workouts", JSON.stringify(updated));
            alert("Workout deleted");
        }

    };

    /**
     * @description updates the sortBy to be the value of the sort option
     * @param {Object} e event when sort option changes
     */
    const handleSort = (e) => {
        setSortBy(e.target.value);
    };

    /**
     * @description apply filtering and sorting to the workouts displayed
     * @returns the filtered workouts that will be displayed in table
     */
    const getFilteredAndSortedWorkouts = () => {
        // filter by matching the search query to the workout names
        let filtered = workouts.filter((w) => 
            w.name.toLowerCase().includes(searchQuery.toLowerCase()));

        // sort based on current sort option
        switch(sortBy) {
            case "date-desc": 
                return filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
            case "date-asc":
                return filtered.sort((a,b) => new Date(a.date) - new Date(b.date));
            case "name-asc":
                return filtered.sort((a,b) => a.name.localeCompare(b.name));
            case "name-desc":
                return filtered.sort((a,b) => b.name.localeCompare(a.name));
            case "exercises-asc":
                return filtered.sort((a,b) => a.exercises.length - b.exercises.length);
            case "exercises-desc":
                return filtered.sort((a,b) => b.exercises.length - a.exercises.length);
            default:
                return filtered;
        }
    };

    /**
     * @description expands or collapses a row to view the workout details
     * @param {int} index index of row to be expanded
     */
    const toggleRow = (index) => {
        if (expandedRows.includes(index)) { // if the row is already expanded
            // resets the expandedRows to not include the row (i.e., collapse row)
            setExpandedRows(expandedRows.filter((i) => i !== index)); 
        } else {
            // expands the row
            setExpandedRows([...expandedRows, index]);
        }
    };

    return(
        <main>
            <h1 className="page-title">Workout History</h1>
            <div className={styles.filters}>
                <select className={styles.sortOptions} onChange={handleSort}>
                    <option value="date-desc">Date: Newest to Oldest</option>
                    <option value="date-asc">Date: Oldest to Newest</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="exercises-asc"># of Exercises: Low to High</option>
                    <option value="exercises-desc"># of Exercises: High to Low</option>
                </select>
                <input type="text" value={searchQuery} className={styles.searchBar} placeholder="Search by workout name or date..." onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            <div className={`widget-container`}>
                {workouts.length === 0 ? 
                <p>No workouts saved yet.</p> : 
                <table className={styles.historyTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th># of Exercises</th>
                            <th colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredAndSortedWorkouts().map((workout, idx) => (
                            <>
                                <tr key={idx} className={styles.row}>
                                    <td>{workout.date}</td>
                                    <td>{workout.name}</td>
                                    <td>{workout.exercises.length}</td>
                                    <td>
                                        <button className={styles.button} onClick={() => toggleRow(idx)}>
                                            {expandedRows.includes(idx) ? "Hide" : "View"}</button>
                                        <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDeleteBtn(idx)}>Delete</button>
                                    </td>
                                </tr>

                                {expandedRows.includes(idx) && (
                                <tr className={styles.detailsRow}>
                                    <td colSpan={4}>
                                        {workout.exercises.map(ex => (
                                            <div>
                                                <b>{ex.exercise}</b> ~ {ex.reps} reps x {ex.sets} sets @ {ex.weight}lbs (RPE: {ex.rpe})
                                            </div>
                                        ))}
                                        {workout.notes && (
                                            <p>
                                                <b>Notes: </b>{workout.notes}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>}
            </div>
        </main>
    );
}

export default History