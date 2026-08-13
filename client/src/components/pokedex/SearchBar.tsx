type SearchProps = {
    value: string;
    setSearchQuery: (value: string) => void;
};
export function SearchBar({value, setSearchQuery}: SearchProps) {
    return (
        <search className="rounded-3xl overflow-hidden shadow-normal border-2 border-darkprimary bg-secondary w-1/2 p-2 flex flex-row gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="size-5 text-gray-400"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
            </svg>
            <input
                type="search"
                name="pokeSearch"
                value={value}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for shiny..."
                aria-label="Search Pokemon"
                className="size-full border-0 focus:outline-none"
            />
        </search>
    );
}
