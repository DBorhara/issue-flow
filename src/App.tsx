type Priority = "Low" | "Medium" | "High";
type Status = "Todo" | "In Progress" | "Done";
type StatusFilter = "All" | Status;
type Issue = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
}
const initialIssues: Issue[] = [
    {
        id: 1,
        title: "Login button does not work",
        status: "Todo",
        priority: "High",
    },
    {
        id: 2,
        title: "Create dashboard layout",
        status: "In Progress",
        priority: "Medium",
    },
    {
        id: 3,
        title: "Add search functionality",
        status: "Done",
        priority: "Low",
    },
    {
        id: 4,
        title: "Add dark mode",
        status: "Todo",
        priority: "Low",
    }
];
import './App.css'
import { useState } from "react"
import Header from './components/Header'
import IssueCard from './components/IssueCard'

function App() {
    const [showIssues, setShowIssues] = useState(true);
    const [issues, setIssues] = useState<Issue[]>(initialIssues);
    const [newIssueTitle, setNewIssueTitle] = useState("");
    const [newIssuePriority, setNewIssuePriority] = useState<Priority>("Medium");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
    function addIssue() {
        if (newIssueTitle.trim() == "") {
            return;
        }
        const newIssue: Issue = {
            id: issues.length + 1,
            title: newIssueTitle,
            status: "Todo",
            priority: newIssuePriority
        };
        setIssues((currentIssues) => [...currentIssues, newIssue])
        setNewIssueTitle("")
        setNewIssuePriority("Medium")
    }

    function handleSumbit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        addIssue();
    }
    const filteredIssues = issues.filter((issue) => {
        if (statusFilter === "All") {
            return true;
        }

        return issue.status === statusFilter;
    });
    return (
        <div>

            <main>
                <Header />

                <button onClick={() => { setShowIssues((current) => !current) }} >
                    {showIssues ? "Hide Issues" : "Show Issues"}
                </button>

                <h2> My Issues </h2>
                <form onSubmit={handleSumbit}>
                    <input
                        type="text"
                        value={newIssueTitle}
                        onChange={(event) => setNewIssueTitle(event.target.value)}
                    />

                    <select
                        value={newIssuePriority}
                        onChange={(event) => {
                            setNewIssuePriority(event.target.value as Priority)
                        }}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <label>
                        Filter by status:

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value as StatusFilter)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </label>
                    <button type='submit'>
                        Add Issue
                    </button>
                </form>

                {showIssues && filteredIssues.map((issue) => (
                    <IssueCard
                        key={issue.id}
                        title={issue.title}
                        status={issue.status}
                        priority={issue.priority}
                    />
                ))}
            </main>
        </div>)
}

export default App
