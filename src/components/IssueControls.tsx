import type {
    SortOption,
    StatusFilter,
} from "../types";

type IssueControlsProps = {
    searchTerm: string;
    statusFilter: StatusFilter;
    sortOption: SortOption;

    onSearchChange: (value: string) => void;
    onStatusFilterChange:
    (value: StatusFilter) => void;
    onSortChange:
    (value: SortOption) => void;
};

function IssueControls(
    props: IssueControlsProps
) {
    return (
        <section>
            <input
                type="text"
                placeholder="Search issues..."
                value={props.searchTerm}
                onChange={(event) =>
                    props.onSearchChange(
                        event.target.value
                    )
                }
            />

            <label>
                Status:

                <select
                    value={props.statusFilter}
                    onChange={(event) =>
                        props.onStatusFilterChange(
                            event.target.value as StatusFilter
                        )
                    }
                >
                    <option value="All">All</option>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">
                        In Progress
                    </option>
                    <option value="Done">Done</option>
                </select>
            </label>

            <label>
                Sort:

                <select
                    value={props.sortOption}
                    onChange={(event) =>
                        props.onSortChange(
                            event.target.value as SortOption
                        )
                    }
                >
                    <option value="Newest">
                        Newest
                    </option>
                    <option value="Oldest">
                        Oldest
                    </option>
                    <option value="Priority">
                        Priority
                    </option>
                    <option value="Title">
                        Title
                    </option>
                </select>
            </label>
        </section>
    );
}

export default IssueControls;
