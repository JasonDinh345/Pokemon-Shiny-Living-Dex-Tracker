type SearchProps = {
    value: string;
    setSearchQuery: (value: string) => void;
};
export function SearchBar({value, setSearchQuery}: SearchProps) {
    return (
        <search>
            <input
                type="search"
                name="pokeSearch"
                value={value}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for shiny..."
                aria-label="Search Pokemon"
            />
        </search>
    );
}
