type IssueSummaryProps = {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}

function IssuesSummary(props: IssueSummaryProps) {
    return (

        <section>
            <h2> Overview </h2>
            <p>Total: {props.total}</p>
            <p>Todo: {props.todo}</p>
            <p>In Progress: {props.inProgress}</p>
            <p>Done: {props.done}</p>
        </section>
    )
}

export default IssuesSummary;
