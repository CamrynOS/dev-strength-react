import styles from './ChangeSchedule.module.css'
import { useState } from 'react';

function ChangeSchedule() {
    const [isEditing, setIsEditing] = useState(false);

    return(
        <main>
            <h1>Schedule</h1>
            <div className={styles.subheader}>
                <h2>{isEditing ? "Edit Schedule" : "Current Schedule"}</h2>
                <div>
                    {!isEditing ? (
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Schedule</button>
                    ) : (
                        <div>
                            <button className={styles.saveButton}>Save Changes</button>
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ChangeSchedule