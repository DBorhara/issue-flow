import { useState } from "react";
import type { Status, Priority } from '../types'
type IssueCardProps = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
    onStatusChange: (id: number, status: Status) => void;
    onTitleChange: (id: number, title: string) => void;
    onPriorityChange: (id: number, priority: Priority) => void;
    onDelete: (id: number) => void;
}
function IssueCard(props: IssueCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(props.title);
    const [editedPriority, setEditedPriority] =
        useState<Priority>(props.priority);

    function saveChanges() {
        if (editedTitle.trim() === "") {
            return
        }

        props.onTitleChange(props.id, editedTitle.trim())
        props.onPriorityChange(props.id, editedPriority)

        setIsEditing(false)
    }

    function cancelEditing() {
        setEditedTitle(props.title)
        setEditedPriority(props.priority)
        setIsEditing(false)
    }
    return (
        <div>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(event) =>
                            setEditedTitle(event.target.value)} />
                    <select
                        value={editedPriority}
                        onChange={(event) =>
                            setEditedPriority(event.target.value as Priority)}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <button onClick={saveChanges}>
                        Save
                    </button>
                    <button onClick={cancelEditing}>
                        Cancel
                    </button>
                </div>
            )
                : (
                    <div>
                        <h3>{props.title}</h3>

                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    </div>
                )}
            <label>
                Status:
                <select
                    value={props.status}
                    onChange={(event) =>
                        props.onStatusChange(props.id, event.target.value as
                            Status)}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress"> In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </label>

            <p>Priority:{props.priority}</p>
            <button onClick={() => setIsEditing(true)}>
                Edit
            </button>
            <button onClick={() => props.onDelete(props.id)}>
                Delete
            </button>
        </div >
    );
}

export default IssueCard;
