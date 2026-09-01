import { useState } from "react";
import type { Status, Priority } from '../types'
type IssueCardProps = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
    onStatusChange: (id: number, status: Status) => void;
    onUpdate: (id: number, title: string, priority: Priority) => Promise<boolean>;
    onDelete: (id: number) => void;
}
function IssueCard(props: IssueCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(props.title);
    const [editedPriority, setEditedPriority] =
        useState<Priority>(props.priority);

    async function saveChanges() {
        const trimmedTitle = editedTitle.trim();

        if (trimmedTitle === "") {
            return;
        }

        const success = await props.onUpdate(
            props.id,
            trimmedTitle,
            editedPriority
        );

        if (success) {
            setIsEditing(false);
        }
    }
    function cancelEditing() {
        setEditedTitle(props.title);
        setEditedPriority(props.priority);
        setIsEditing(false);
    }

    return (
        <article className="issue-card">
            {isEditing ? (
                <div className="issue-edit">
                    <input
                        className="issue-edit-input"
                        type="text"
                        value={editedTitle}
                        onChange={(event) =>
                            setEditedTitle(event.target.value)
                        }
                    />

                    <select
                        value={editedPriority}
                        onChange={(event) =>
                            setEditedPriority(
                                event.target.value as Priority
                            )
                        }
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <div className="issue-actions">
                        <button onClick={saveChanges}>
                            Save
                        </button>

                        <button
                            className="secondary-button"
                            onClick={cancelEditing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="issue-card-main">
                        <div>
                            <h3>{props.title}</h3>

                            <div className="issue-badges">
                                <span
                                    className={`badge priority-${props.priority.toLowerCase()}`}
                                >
                                    {props.priority}
                                </span>
                            </div>
                        </div>

                        <div className="issue-actions">
                            <button
                                className="secondary-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    props.onDelete(props.id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="issue-card-footer">
                        <label>
                            Status

                            <select
                                value={props.status}
                                onChange={(event) =>
                                    props.onStatusChange(
                                        props.id,
                                        event.target.value as Status
                                    )
                                }
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">
                                    In Progress
                                </option>
                                <option value="Done">Done</option>
                            </select>
                        </label>
                    </div>
                </>
            )}
        </article>
    );
}

export default IssueCard;
