import {Game} from '@/types/games';

export const games: Game[] = [
    // Gen 1
    {
        name: 'Red',
        generation: 1,
        shinyMethods: ['Random Encounter']
    },
    {
        name: 'Blue',
        generation: 1,
        shinyMethods: ['Random Encounter']
    },
    {
        name: 'Yellow',
        generation: 1,
        shinyMethods: ['Random Encounter']
    },

    // Gen 2
    {
        name: 'Gold',
        generation: 2,
        shinyMethods: ['Random Encounter', 'Breeding', 'Odd Egg']
    },
    {
        name: 'Silver',
        generation: 2,
        shinyMethods: ['Random Encounter', 'Breeding', 'Odd Egg']
    },
    {
        name: 'Crystal',
        generation: 2,
        shinyMethods: ['Random Encounter', 'Breeding', 'Odd Egg']
    },

    // Gen 3
    {
        name: 'Ruby',
        generation: 3,
        shinyMethods: ['Random Encounter', 'Fishing', 'Soft Reset']
    },
    {
        name: 'Sapphire',
        generation: 3,
        shinyMethods: ['Random Encounter', 'Fishing', 'Soft Reset']
    },
    {
        name: 'Emerald',
        generation: 3,
        shinyMethods: ['Random Encounter', 'Fishing', 'Soft Reset']
    },
    {
        name: 'FireRed',
        generation: 3,
        shinyMethods: ['Random Encounter', 'Fishing', 'Safari Zone', 'Soft Reset']
    },
    {
        name: 'LeafGreen',
        generation: 3,
        shinyMethods: ['Random Encounter', 'Fishing', 'Safari Zone', 'Soft Reset']
    },

    // Gen 4
    {
        name: 'Diamond',
        generation: 4,
        shinyMethods: ['Poké Radar', 'Masuda Method', 'Honey Trees', 'Safari Zone', 'Soft Reset']
    },
    {
        name: 'Pearl',
        generation: 4,
        shinyMethods: ['Poké Radar', 'Masuda Method', 'Honey Trees', 'Safari Zone', 'Soft Reset']
    },
    {
        name: 'Platinum',
        generation: 4,
        shinyMethods: ['Poké Radar', 'Masuda Method', 'Honey Trees', 'Safari Zone', 'Soft Reset']
    },
    {
        name: 'HeartGold',
        generation: 4,
        shinyMethods: ['Pokéwalker', 'Headbutt', 'Safari Zone', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'SoulSilver',
        generation: 4,
        shinyMethods: ['Pokéwalker', 'Headbutt', 'Safari Zone', 'Masuda Method', 'Soft Reset']
    },

    // Gen 5
    {
        name: 'Black',
        generation: 5,
        shinyMethods: ['Masuda Method', 'Soft Reset', 'Random Encounter']
    },
    {
        name: 'White',
        generation: 5,
        shinyMethods: ['Masuda Method', 'Soft Reset', 'Random Encounter']
    },
    {
        name: 'Black 2',
        generation: 5,
        shinyMethods: ['Hidden Grotto', 'Masuda Method', 'Soft Reset', 'Random Encounter']
    },
    {
        name: 'White 2',
        generation: 5,
        shinyMethods: ['Hidden Grotto', 'Masuda Method', 'Soft Reset', 'Random Encounter']
    },

    // Gen 6
    {
        name: 'X',
        generation: 6,
        shinyMethods: ['Friend Safari', 'Horde', 'Chain Fishing', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Y',
        generation: 6,
        shinyMethods: ['Friend Safari', 'Horde', 'Chain Fishing', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Omega Ruby',
        generation: 6,
        shinyMethods: ['DexNav', 'Horde', 'Chain Fishing', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Alpha Sapphire',
        generation: 6,
        shinyMethods: ['DexNav', 'Horde', 'Chain Fishing', 'Masuda Method', 'Soft Reset']
    },

    // Gen 7
    {
        name: 'Sun',
        generation: 7,
        shinyMethods: ['SOS', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Moon',
        generation: 7,
        shinyMethods: ['SOS', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Ultra Sun',
        generation: 7,
        shinyMethods: ['SOS', 'Ultra Wormhole', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Ultra Moon',
        generation: 7,
        shinyMethods: ['SOS', 'Ultra Wormhole', 'Masuda Method', 'Soft Reset']
    },
    {
        name: "Let's Go Pikachu",
        generation: 7,
        shinyMethods: ['Catch Combo', 'Lure', 'Soft Reset']
    },
    {
        name: "Let's Go Eevee",
        generation: 7,
        shinyMethods: ['Catch Combo', 'Lure', 'Soft Reset']
    },

    // Gen 8
    {
        name: 'Sword',
        generation: 8,
        shinyMethods: ['Brilliant Pokémon', 'Dynamax Adventures', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Shield',
        generation: 8,
        shinyMethods: ['Brilliant Pokémon', 'Dynamax Adventures', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Brilliant Diamond',
        generation: 8,
        shinyMethods: ['Poké Radar', 'Grand Underground', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Shining Pearl',
        generation: 8,
        shinyMethods: ['Poké Radar', 'Grand Underground', 'Masuda Method', 'Soft Reset']
    },
    {
        name: 'Legends: Arceus',
        generation: 8,
        shinyMethods: ['Mass Outbreak', 'Massive Mass Outbreak', 'Random Encounter']
    },

    // Gen 9
    {
        name: 'Scarlet',
        generation: 9,
        shinyMethods: ['Sandwich', 'Mass Outbreak', 'Isolated Encounter', 'Masuda Method']
    },
    {
        name: 'Violet',
        generation: 9,
        shinyMethods: ['Sandwich', 'Mass Outbreak', 'Isolated Encounter', 'Masuda Method']
    }
] as const;
