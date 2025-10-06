import styles from './ChangeSchedule.module.css'
import { useEffect, useState } from 'react';

function ChangeSchedule() {

    // keep track of the schedule and whether the user is editing
    const [isEditing, setIsEditing] = useState(false);
    const [schedule, setSchedule] = useState({
        Monday: {workoutName: "", exercises: []},
        Tuesday: {workoutName: "", exercises: []},
        Wednesday: {workoutName: "", exercises: []},
        Thursday: {workoutName: "", exercises: []},
        Friday: {workoutName: "", exercises: []},
        Saturday: {workoutName: "", exercises: []},
        Sunday: {workoutName: "", exercises: []}
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // on component mount, get the saved schedule from local storage and set the schedule useState to it
    useEffect(() => {
        const savedSchedule = localStorage.getItem("workoutSchedule");
        if (savedSchedule) {
            setSchedule(JSON.parse(savedSchedule));
        }
    }, []);

    // when save button is clicked, the current schedule on screen will be saved to localStorage
    // the isEditing useState will be set to false, to show the current schedule screen instead of editing
    const saveSchedule = () => {
        localStorage.setItem("workoutSchedule", JSON.stringify(schedule));
        setIsEditing(false);
    }

    // when a user types in a new workout name, it will set the schedule to the all of the prev items except for the 
    // selected day's new workout name
    const updateWorkoutName = (day, workoutName) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {...prev[day], workoutName}
        }));
    };

    // when the add exercise button is clicked, the schedule will be set to all of the prev items except for the 
    // selected day's exercise array, which will now hold all of the previous elements + the new exercise
    const addExercise = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                exercises: [...prev[day].exercises, '']
            }
        }));
    };

    // when the user types a new exercise name, it will set the schedule to the all of the prev items except for the selected
    // day's exercise array, which will map every exercise and index in the current array to the new exercise name if the 
    // index in the array is the same as the exercise's index. else the exercise will stay the same
    const updateExercise = (day, exerciseIndex, exerciseName) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                exercises: prev[day].exercises.map((exercise, index) => index === exerciseIndex ? exerciseName : exercise)
            }
        }));
    };

    // when the "x" button is clicked, the exercise will be removed by keeping all other schedule items the same, except for
    // the selected day's exercise array, which will be filtered to include all exercises whose index in the array is 
    // not the same as the index of the exercise to be deleted
    const removeExercise = (day, exerciseIndex) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                exercises: prev[day].exercises.filter((_, index) => index !== exerciseIndex)
            }
        }));
    };

    // a check to see if the day in the array is the current day in real time 
    const isToday = (day) => {
        const today = new Date().toLocaleDateString('en-US', {weekday: 'long'});
        return day === today;
    }

    return(
        <main>
            <h1 className='page-title'>Schedule</h1>
            <div className={styles.subheader}>
                <h2>{isEditing ? "Edit Schedule" : "Current Schedule"}</h2>
                <div className={styles.controls}>
                    
                    {/* if the user isn't editing, show the edit schedule button. else the user is editing
                    and will show the save and cancel buttons */}
                    {!isEditing ? (
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Schedule</button>
                    ) : (
                        <div className={styles.editControls}>
                            <button className={styles.saveButton} onClick={saveSchedule}>Save Changes</button>
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.scheduleContainer}>
                {/* for all the days in the days array, make a div for each day card. 
                if the day isToday, show the icon displaying "TODAY".  
                in each div, there is an h3 with the text of the day from the days array using the index
                if the user isn't editing and there is a workout name associated with the day, show the workout name within a span tag next to the name of the day*/}
                {days.map((day, index) => (
                    <div key={day} className={`${styles.dayCard} ${isToday(day) ? styles.todayCard : ''}`}>
                        <h3 className={styles.dayTitle}>

                            {isToday(day) && <span className={styles.todayBadge}>TODAY</span>}
                            <span className={styles.dayTitleUnderline}>{days[index]}</span>
                            
                            {!isEditing && schedule[day].workoutName && (
                                <span className={styles.inlineWorkoutName}>
                                    - {schedule[day].workoutName}
                                </span>
                            )}
                        </h3>
                        
                        {/* if the user is editing, then the edit mode div will show */}
                        {isEditing ? (
                            <div className={styles.editMode}>
                                <input 
                                    type="text"
                                    placeholder="Workout name (e.g., Back Day)" 
                                    value={schedule[day].workoutName} // going into schedule array using day from map function
                                    onChange={(e) => updateWorkoutName(day, e.target.value)}
                                    className={styles.workoutInput} />

                                <div className={styles.exercisesSection}>
                                    {/* map each of the day's exercises to the exercise name and index */}
                                    {schedule[day].exercises.map((exercise, exerciseIndex) => (
                                        <div key={exerciseIndex} className={styles.exerciseRow}>
                                            <input
                                                type="text"
                                                placeholder="Exercise name"
                                                value={exercise}
                                                onChange={(e) => updateExercise(day, exerciseIndex, e.target.value)}
                                                className={styles.exerciseInput}/>
                                            <button onClick={() => removeExercise(day, exerciseIndex)} 
                                                    className={styles.removeButton}>X
                                            </button>
                                        </div>
                                    ))}

                                    <button onClick={() => addExercise(day)} className={styles.addExerciseButton}>+ Add Exercise</button>
                                </div>
                            </div>

                        ) : ( // if the user isn't editing, this div will show
                            <div className={styles.viewMode}>
                                {/* if there is a workout name for the day, show it */}
                                {schedule[day].workoutName ? (
                                    // if there is at least 1 exercise then show the exercises
                                    schedule[day].exercises.length > 0 && (
                                        <div className={styles.exercisesContainer}>
                                            {schedule[day].exercises.map((exercise, exerciseIndex) => (
                                                <span key={exerciseIndex} className={styles.exerciseItem}>{exercise}</span>
                                            ))}
                                        </div>
                                    )

                                // if there isn't a workout name, then automatically show that day as a rest day
                                ) : (
                                    <div className={styles.restDay}>
                                        <span className={styles.restDayText}>Rest Day</span>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                ))}

            </div>
        </main>
    );
}

export default ChangeSchedule