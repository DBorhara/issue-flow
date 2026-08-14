import type {
    Issue,
    Priority,
    Status
} from './types';
type StatusFilter = "All" | Status;
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
    const [newIssuePriority, setNewIssuePriority] =
        useState<Priority>("Medium");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
    const [searchTerm, setSearchTerm] = useState("");

    function addIssue() {
        if (newIssueTitle.trim() == "") {
            return;
        }
        setIssues((currentIssues) => {
            const nextId = Math.max(0, ...currentIssues.map((issue) =>
                issue.id)) + 1;
            const newIssue: Issue = {
                id: nextId,
                title: newIssueTitle,
                status: "Todo",
                priority: newIssuePriority
            };
            console.log("nextid:" + nextId)
            return [...currentIssues, newIssue]
        });
        setNewIssueTitle("")
        setNewIssuePriority("Medium")
    }
    function updateIssueStatus(id: number, newStatus: Status) {
        setIssues((currentIssues) =>
            currentIssues.map((issue) => {
                if (issue.id === id) {
                    return {
                        ...issue,
                        status: newStatus,
                    };
                }

                return issue;
            })
        );
    }
    function deleteIssue(id: number) {
        setIssues((currentIssues) =>
            currentIssues.filter((issue) => issue.id !== id))
    }

    function updateIssueTitle(id: number, newTitle: string) {
        setIssues((currentIssues) =>
            currentIssues.map((issue) => {
                if (issue.id === id) {
                    return {
                        ...issue,
                        title: newTitle
                    }
                }
                return issue;
            })
        )
    }

    function updateIssuePriority(id: number, newPriority: Priority) {
        setIssues((currentIssues) =>
            currentIssues.map((issue) => {
                if (issue.id === id) {
                    return {
                        ...issue,
                        priority: newPriority
                    }
                }
                return issue;
            }
            ))
    }

    function handleSumbit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        addIssue();
    }

    const filteredIssues = issues.filter((issue) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const matchStatus = statusFilter == "All"
            || issue.status == statusFilter;

        const matchSearch = issue.title
            .toLowerCase()
            .includes(normalizedSearch);

        return matchStatus && matchSearch;

    });
    return (
        <div>

            <main>
                <Header />

                <button onClick={() => {
                    setShowIssues((current) =>
                        !current)
                }} >
                    {showIssues ? "Hide Issues" : "Show Issues"}
                </button>
                <input
                    type='text'
                    placeholder='Search Issues'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)} />
                <h2> My Issues </h2>
                <form onSubmit={handleSumbit}>
                    <input
                        type="text"
                        value={newIssueTitle}
                        onChange={(event) =>
                            setNewIssueTitle(event.target.value)}
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
                                setStatusFilter(event.target.value as
                                    StatusFilter)
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
                        id={issue.id}
                        title={issue.title}
                        status={issue.status}
                        priority={issue.priority}
                        onStatusChange={updateIssueStatus}
                        onTitleChange={updateIssueTitle}
                        onPriorityChange={updateIssuePriority}
                        onDelete={deleteIssue}
                    />
                ))}
            </main>
        </div>)
}

export default App
