import type {
    Issue,
    Priority,
    Status
} from './types';
type StatusFilter = "All" | Status;
type SortOption =
    | "Newest"
    | "Oldest"
    | "Priority"
    | "Title";
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
import IssuesSummary from './components/IssueSummary';

function App() {
    const [showIssues, setShowIssues] = useState(true);
    const [issues, setIssues] = useState<Issue[]>(initialIssues);
    const [newIssueTitle, setNewIssueTitle] = useState("");
    const [newIssuePriority, setNewIssuePriority] =
        useState<Priority>("Medium");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("Newest");

    const totalIssues = issues.length;
    const todoCount = issues.filter((issue) => issue.status === "Todo").length
    const inProgressCount = issues.filter((issue) =>
        issue.status === "In Progress").length
    const doneCount = issues.filter((issue) => issue.status === "Done").length

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

    const matchingIssues = issues.filter((issue) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const matchesStatus =
            statusFilter === "All" ||
            issue.status === statusFilter;

        const matchesSearch = issue.title
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesStatus && matchesSearch;
    });

    const priorityOrder: Record<Priority, number> = {
        High: 3,
        Medium: 2,
        Low: 1,
    };

    const sortedIssues = [...matchingIssues];

    if (sortOption === "Title") {
        sortedIssues.sort((a, b) =>
            a.title.localeCompare(b.title))
    }

    if (sortOption === "Newest") {
        sortedIssues.sort((a, b) => b.id - a.id)
    }

    if (sortOption === "Oldest") {
        sortedIssues.sort((a, b) => a.id - b.id)
    }

    if (sortOption === "Priority") {
        sortedIssues.sort((a, b) =>
            priorityOrder[b.priority] - priorityOrder[a.priority])
    }
    return (
        <div>

            <main>
                <Header />
                <IssuesSummary
                    total={totalIssues}
                    todo={todoCount}
                    inProgress={inProgressCount}
                    done={doneCount}
                />
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
                <label>
                    Sort by:
                    <select
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value as
                            SortOption)}>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Priority">Priority</option>
                        <option value="Title">Title</option>
                    </select>
                </label>
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

                {showIssues && sortedIssues.map((issue) => (
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
