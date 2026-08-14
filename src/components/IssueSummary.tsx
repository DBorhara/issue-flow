type IssueSummaryProps = {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}

function IssuesSummary(props: IssueSummaryProps) {
    return (
        <section className="summary">
            <div className="summary-card">
                <span>Total</span>
                <strong>{props.total}</strong>
            </div>

            <div className="summary-card">
                <span>Todo</span>
                <strong>{props.todo}</strong>
            </div>

            <div className="summary-card">
                <span>In Progress</span>
                <strong>{props.inProgress}</strong>
            </div>

            <div className="summary-card">
                <span>Done</span>
                <strong>{props.done}</strong>
            </div>
        </section>
    )
}

export default IssuesSummary;
