import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import styles from './Stats.module.css'

function Stats() {
    const [workouts, setWorkouts] = useState([]);
    const [filter, setFilter] = useState("");

    // on component load, set workouts array to the stored workouts in localStorage, or an empty array if nothing is stored
    useEffect(() => {
        setWorkouts(JSON.parse(localStorage.getItem("workouts")) || []);
    }, []);

    // turn stored workouts into a single array
    // same as using a forEach loop, but simpler design
    const allExercises = workouts.flatMap(w => 
        w.exercises.map(ex => ({ // going through exercises (the array stored inside each workout in localStorage that contains individual exercise objects)
            ...ex, // object spread notation to copy all key-value pairs into the new object
            date: w.date,
            workoutName: w.name
        }))
    );

    // if filter has a value, then condense allExercises array to only include the exercise objects that have the same name as filter
    // else, the search was left blank, meaning the user wants to see all exercises, so keep allExercises as is
    const filteredExercises = filter ? allExercises.filter(ex => ex.exercise.toLowerCase().includes(filter)) : allExercises;

    /*           -----calculating and storing all the stats-----          */

    // keep count acc of total volume, go through filteredExercises and multiply the weight, reps, sets for each exercise, leading to total volume
    // reduce is an easy way to convert the filteredExercises object to a single number
    const totalVolume = filteredExercises.reduce((acc, ex) => acc + ex.weight * ex.reps * ex.sets, 0);

    // if there are filtered exercises, keep count sum rpe to acc for all filtered exercise, then divide by amount of exercises for average (toFixed for 2 decimals)
    const avgRpe = filteredExercises.length ? (filteredExercises.reduce((acc, ex) => acc + parseFloat(ex.rpe), 0) / filteredExercises.length).toFixed(2) : 0;

    // storing stats for later use
    let topStat = "";
    let totalStat;
    let maxWeight;
    let sets;

    // if there is not a filter (i.e., user wants to reference all exercises)
    if (!filter) {

        // top exercise by number of sets
        const exerciseSets = {};

        // for ALL exercises, save each exercises num of sets to the key with exercise's name (e.g., pulldown: 2, squats: 7)
        allExercises.forEach(ex => { 
            const sets = ex.sets;
            exerciseSets[ex.exercise] = exerciseSets[ex.exercise] + sets;
        })

        // Object.entries() turns exerciseSets into a 2D array for easier sorting
        // sort elements (arrays) in descending order (aka largest to smallest)
        // [0][0] -> look into the first array (the array with largest sets value) and grab the first item (the exercise name)
        // ?. is used for safety in case the array is empty for some reason and will return undefined if so, adding "None" to provide an accurate description if so
        topStat = Object.entries(exerciseSets).sort((a,b) => b[1] - a[1])[0]?.[0] || "None";
        
        // total workouts is just the stored workouts' length
        totalStat = workouts.length;

    } else { // else there is a searched filter by the user

        // max weight is the max of all of the filteredExercises for a particular exercise
        maxWeight = Math.max(...filteredExercises.map(ex => ex.weight), 0);
        topStat = maxWeight ? `${maxWeight} lbs` : "None";

        // for each exercise in filtered excercises, sum up the number of sets for that particular exercise
        sets = 0;
        filteredExercises.forEach(ex => {
            sets += Number(ex.sets);
        })
        totalStat = sets;
    }

    // group all exercises by date to easily merge them all into the graph
    const groupByDate = filteredExercises.reduce((acc, ex) => {
        const date = ex.date;
        const volume = ex.weight * ex.reps * ex.sets;

        // if there is not already an entry associated with a date, then make a new entry with that date key
        if (!acc[date]) {
            acc[date] = {
                date, 
                totalWeight: 0,
                workoutName: ex.workoutName
            }
        }

        // set totalWeight (volume) for this date entry to be the volume for that date
        acc[date].totalWeight += volume;
        return acc; // just so we can iterate through again
    }, {});

    // turn object into array and sort, so that earliest date is on the left of the graph
    const chartData = Object.values(groupByDate).map(d => ({
        ...d,
        date: new Date(d.date)
    })).sort((a,b) => a.date - b.date);

    return(
        <main>
            <h1 className='page-title'>Workout Stats</h1>
            <div className={styles.viewFilterContainer}>
                <h2>View Stats For:</h2>
                <input className={styles.filterBar} value={filter} onChange={(e) => setFilter(e.target.value.toLowerCase())} placeholder='Enter exercise name (or leave blank for all)...'></input>
            </div>
            <div className={styles.quickStatsContainer}>
                <div className={styles.statWidget}>
                    <h3>{totalStat === sets ? `Total Sets` : `Total Workouts`}</h3>
                    <p>{totalStat}</p>
                </div>
                <div className={styles.statWidget}>
                    <h3>Total Volume</h3>
                    <p>{totalVolume} lbs</p>
                </div>
                <div className={styles.statWidget}>
                    <h3>Average RPE</h3>
                    <p>{avgRpe}</p>
                </div>
                <div className={styles.statWidget}>
                    <h3>{topStat === `${maxWeight} lbs` ? `Max Weight` : `Top Exercise`}</h3>
                    <p>{topStat}</p>
                </div>
            </div>
            <div className={styles.graphContainer}>
                <h3>Weight Lifted Over Time</h3>

                <ResponsiveContainer width="100%" aspect={2.5}>
                    <LineChart data={chartData}>
                        <CartesianGrid />
                        <XAxis dataKey="date" scale="time" type="number" domain={["auto","auto"]} 
                               tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {month: "2-digit", year: "2-digit"})}/>
                        <YAxis label={{value: "Total Volume (lbs)", angle: -90, position: "insideLeft", style: {textAnchor: "middle"}}} 
                                width={75} 
                                tickFormatter={(value) => `${(value > 10000 ? (value / 1000) + 'k' : value)}`}/>
                        <Tooltip contentStyle={{backgroundColor: "var(--card-background-clr", color: "var(--text-clr"}}
                                itemStyle={{color: "var(--text-clr)"}} 
                                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}`} formatter={(value, name, props) => [
                                `${value} lbs`, props.payload.workoutName]} />
                        <Line type="monotone" stroke="var(--primary-clr)" dataKey="totalWeight" strokeWidth={3} activeDot={{r:8}}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}

export default Stats