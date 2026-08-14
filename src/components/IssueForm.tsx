import { useState } from "react";
import type { Priority } from "../types";

type IssueFormProps = {
    onAddIssue: (title: string, priority: Priority) => void;
};

function IssueForm(props: IssueFormProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] =
        useState<Priority>("Medium");

    function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (title.trim() === "") {
            return;
        }

        props.onAddIssue(title.trim(), priority);

        setTitle("");
        setPriority("Medium");
    }

    return (
        <form className="issue-form" onSubmit={handleSubmit}>
            <input
                className="issue-form-input"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(event) =>
                    setTitle(event.target.value)
                }
            />

            <select
                className="issue-form-select"
                value={priority}
                onChange={(event) =>
                    setPriority(
                        event.target.value as Priority
                    )
                }
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <button type="submit">
                Add Issue
            </button>
        </form>
    );
}

export default IssueForm;
