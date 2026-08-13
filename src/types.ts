export type Status = "Todo" | "In Progress" | "Done"

export type Priority = "Low" | "Medium" | "High"

export type Issue = {
    id: number;
    title: string;
    status: Status;
    priority: Priority;
}
