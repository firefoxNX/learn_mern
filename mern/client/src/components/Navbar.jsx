import {NavLink} from "react-router-dom";
import Turnstone from "turnstone";

const maxItems = 10;

export default function Navbar() {
    const listbox = [{
        id: "employees",
        name: "Employees",
        displayField: 'searchResult',
        searchType: 'contains',
        data: (query) =>
            fetch(`http://localhost:5050/record/search?q=${encodeURIComponent(query)}&limit=${maxItems}`)
                .then(
                    response => response.json().then(data => data.map(employee => ({...employee, searchResult: `${employee.name} - ${employee.position}`})))
                )
    }];

    return (
        <div>
            <nav className="flex justify-between items-center mb-6">
                <NavLink to="/">
                    <img alt="MongoDB logo" className="h-32 inline" src="/mern.png"></img>
                </NavLink>
                <div className="flex items-center p-2">
                    <label htmlFor="search" className="mr-4 text-2xl">Search</label>
                    <Turnstone
                        cancelButton={true}
                        debounceWait={250}
                        id="search"
                        listbox={listbox}
                        listboxIsImmutable={true}
                        matchText={true}
                        maxItems={maxItems}
                        name="search"
                        noItemsMessage="No employees found"
                        placeholder="Search for employees"
                        styles={{
                            input: "border border-input rounded-md h-9 px-3 w-128",
                            listbox: "absolute bg-white border border-input mt-1 rounded-md shadow-lg w-full z-10",
                            listItem: "p-2",
                            listItemHover: "bg-gray-100",
                            noItems: "p-2",
                            highlightedItem: "bg-gray-100"
                        }}
                        typeahead={true}
                    />
                </div>

                <NavLink
                    className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
                    to="/create">
                    Create Employee
                </NavLink>

            </nav>
        </div>
    );
}
