export interface Generation {
    id: number;
    name: string;
    main_region: {
        name: string;
    };
    pokemon_species: {
        name: string;
        url: string;
    }[];
}
