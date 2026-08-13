import type { Status, Priority } from '../types'
type IssueCardProps = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
    onStatusChange: (id: number, status: Status) => void;
    onDelete: (id: number) => void;
}
function IssueCard(props: IssueCardProps) {
    return (
        <div>
            <h3>{props.title}</h3>
            <label>
                Status:
                <select
                    value={props.status}
                    onChange={(event) =>
                        props.onStatusChange(props.id, event.target.value as Status)}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress"> In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </label>

            <p>Priority:{props.priority}</p>

            <button onClick={() => props.onDelete(props.id)}>
                Delete
            </button>
        </div >
    );
}

export default IssueCard;
