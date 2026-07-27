export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_shiny: string;
    };
    types: {
        slot: number;
        type: {
            name: string;
        };
    }[];
}
