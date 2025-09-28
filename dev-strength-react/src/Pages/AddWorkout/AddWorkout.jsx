import { useState } from 'react';
import styles from './AddWorkout.module.css'


function AddWorkout() {

    // keep track of the form data
    const [workoutName, setWorkoutName] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    const [exercise, setExercise] = useState("");
    const [weight, setWeight] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState("");

    // array to keep track of the current exercises added from the form
    const [currentExercises, setCurrentExercises] = useState([]);

    // way to track if the form element should be editable or not
    const [isEditable, setIsEditable] = useState(true);

    /**
     * @description handles the click event of the add exercise button by adding the exercise 
     *              to the current exercises array
     * @param {Object} event the object from clicking the button
     */
    const handleAddExercise = (event) => {
        event.preventDefault(); // stops the form from refreshing the page, so we can access the data
        const newExercise = {exercise, weight, sets, reps, rpe};
        // ... notation just takes all of the currentExcerises and appends on newExercise by makinga a new array
        setCurrentExercises([...currentExercises, newExercise]);

        // clear all the form elements EXCEPT the name, date, and notes
        setExercise("");
        setWeight("");
        setSets("");
        setReps("");
        setRpe("");

        setIsEditable(false); // change the state so that the name, date, and notes elements cannot be changed
    }

    /**
     * @description handles the click event of the save workout button by packaging up the new workout
     * and adding it to local storage
     */
    const handleSaveWorkout = () => {
        const newWorkout = {
            name: workoutName, 
            date: date,
            notes: notes,
            exercises: currentExercises,
        };

        const savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
        const updatedWorkouts = [...savedWorkouts, newWorkout];
        localStorage.setItem("workout", JSON.stringify(updatedWorkouts));

        // clear the rest of the elements and currentExcersises array and let elements be editable again
        setWorkoutName("");
        setDate("");
        setNotes("");
        setCurrentExercises([]);
        setIsEditable(true);
    }

    return(
        <main>
            <h1 className='page-title'>Add Workout</h1>
            <div className='widget-container'>
                <div className={styles.addExerciseWidget}>
                    <h2>Add Exercise</h2>
                    <form className={styles.workoutForm} onSubmit={handleAddExercise}>
                        <label>Workout Name:
                            <input type="text" value={workoutName} placeholder="Legs" readOnly={!isEditable} required onChange={(e) => setWorkoutName(e.target.value)}/>
                        </label>
                        <label>Date:
                            <input type="date" value={date} readOnly={!isEditable} required onChange={(e) => setDate(e.target.value)}/>
                        </label>
                        <label>Exercise:
                            <input type="text" value={exercise} placeholder="Squats" required onChange={(e) => setExercise(e.target.value)}/>
                        </label>
                        <label>Weight:
                            <input type="number" value={weight} requried onChange={(e) => setWeight(e.target.value)}/>
                        </label>
                        <label>Sets:
                            <input type="number" value={sets} required onChange={(e) => setSets(e.target.value)}/>
                        </label>
                        <label>Reps Per Set:
                            <input type="number" value={reps} required onChange={(e) => setReps(e.target.value)}/>
                        </label>
                        <label>RPE (1-10):
                            <input type="number" value={rpe} max="10" required onChange={(e) => setRpe(e.target.value)}/>
                        </label>
                        <label>Notes:
                            <textarea value={notes} placeholder="Optional" readOnly={!isEditable} required onChange={(e) => setNotes(e.target.value)}/>
                        </label>
                        <button type="submit">Add Exercise</button>
                    </form>
                </div>
                <div className={styles.workoutSummaryWidget}>
                    <h2>Workout Summary</h2>
                    {currentExercises.length === 0 ? (
                        <p>No exercises added yet.</p>
                    ) : (
                    <ul>
                        {currentExercises.map((exercise, idx) => (
                            <li key={idx}>
                                <b>{exercise.exercise}</b> ~ {exercise.reps} reps x {exercise.sets} sets @ {exercise.weight}lbs (RPE: {exercise.rpe})
                            </li>
                        ))}
                    </ul>)}
                    <button onClick={handleSaveWorkout} disabled={currentExercises.length === 0}>Save Workout</button>
                </div>
            </div>
        </main>
    );
}

export default AddWorkout