import type {
    Issue,
    Priority,
    SortOption,
    Status,
    StatusFilter
} from './types';
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
import IssueForm from './components/IssueForm';
import IssueControls from './components/IssueControls';

function App() {
    const [showIssues, setShowIssues] = useState(true);
    const [issues, setIssues] = useState<Issue[]>(initialIssues);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Newest");

    const totalIssues = issues.length;
    const todoCount = issues.filter((issue) => issue.status === "Todo").length
    const inProgressCount = issues.filter((issue) =>
        issue.status === "In Progress").length
    const doneCount = issues.filter((issue) => issue.status === "Done").length

    function addIssue(title: string, priority: Priority) {
        setIssues((currentIssues) => {
            const nextId = Math.max(0, ...currentIssues.map((issue) => issue.id)) + 1

            const newIssue: Issue = {
                id: nextId,
                title,
                status: "Todo",
                priority
            }
            return [...currentIssues, newIssue];
        })
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
        <div className='app'>

            <Header />
            <main className='main-content'>
                <IssuesSummary
                    total={totalIssues}
                    todo={todoCount}
                    inProgress={inProgressCount}
                    done={doneCount}
                />

                <section className='issue-panel'>
                    <div className="issue-panel-header">
                        <h2> Issues </h2>
                        <button className='seconday-button'
                            onClick={() => {
                                setShowIssues((current) =>
                                    !current)
                            }} >
                            {showIssues ? "Hide Issues" : "Show Issues"}
                        </button>
                    </div>
                    <IssueForm onAddIssue={addIssue} />
                    <IssueControls
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        sortOption={sortOption}
                        onSearchChange={setSearchTerm}
                        onStatusFilterChange={setStatusFilter}
                        onSortChange={setSortOption}
                    />
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
                </section>
            </main>
        </div>)
}

export default App
