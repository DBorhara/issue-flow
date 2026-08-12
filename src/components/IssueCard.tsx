type IssueCardProps = {
    title: string;
    status: string;
    priority: string;
}
function IssueCard(props: IssueCardProps) {
    return (
        <div>
            <h3>{props.title}</h3>
            <p>{props.status}</p>
            <p>{props.priority}</p>
        </div>
    );
}

export default IssueCard;
