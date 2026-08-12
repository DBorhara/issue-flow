type Issue = {
    id: number;
    title: string;
    status: string;
    priority: string;
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

    function addIssue() {
        if (newIssueTitle.trim() == "") {
            return;
        }
        const newIssue: Issue = {
            id: issues.length + 1,
            title: newIssueTitle,
            status: "Todo",
            priority: "Medium"
        };
        setIssues((currentIssues) => [...currentIssues, newIssue])
        setNewIssueTitle("")
    }
    return (
        <div>

            <main>
                <Header />

                <button onClick={() => { setShowIssues((current) => !current) }} >
                    {showIssues ? "Hide Issues" : "Show Issues"}
                </button>

                <h2> My Issues </h2>
                <input
                    type="text"
                    value={newIssueTitle}
                    onChange={(event) => setNewIssueTitle(event.target.value)}
                />
                <button onClick={addIssue}>
                    Add Issue
                </button>
                {showIssues && issues.map((issue) => (
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
