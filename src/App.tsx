import type {
    Issue,
    Priority,
    SortOption,
    Status,
    StatusFilter
} from './types';
import './App.css'
import { useState, useEffect } from "react"
import Header from './components/Header'
import IssueCard from './components/IssueCard'
import IssuesSummary from './components/IssueSummary';
import IssueForm from './components/IssueForm';
import IssueControls from './components/IssueControls';

function App() {
    const [showIssues, setShowIssues] = useState(true);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Newest");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadIssues() {
            try {
                const response = await fetch(
                    "/api/issues",
                    { signal: controller.signal }
                )
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`)
                }
                const data: Issue[] = await response.json();
                setIssues(data);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setError("Unable to load issues.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadIssues();

        return () => {
            controller.abort();
        }
    }, [])

    const totalIssues = issues.length;
    const todoCount = issues.filter((issue) => issue.status === "Todo").length
    const inProgressCount = issues.filter((issue) =>
        issue.status === "In Progress").length
    const doneCount = issues.filter((issue) => issue.status === "Done").length

    async function addIssue(title: string, priority: Priority): Promise<boolean> {
        try {
            const response = await fetch("/api/issues", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, priority })
            })
            if (!response.ok) {
                throw new Error(
                    `Request failed: ${response.status}`
                );
            }

            const newIssue: Issue =
                await response.json();

            setIssues((currentIssues) => [
                ...currentIssues,
                newIssue,
            ]);

            return true;
        } catch {
            return false
        }
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
                    {isLoading && (<p>Loading Issues</p>)}
                    {error && (
                        <p role="alert">{error}</p>
                    )}
                    {!isLoading
                        && !error
                        && showIssues
                        && sortedIssues.map((issue) => (
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
