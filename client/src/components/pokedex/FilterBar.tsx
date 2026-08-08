'use client';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {capitilize} from '@/util/captilize';
import {orderByValues} from '@/data/filterValues';
import {Dispatch, SetStateAction, useState} from 'react';
import {Select} from '../ui/Select';
import {games} from '@/data/games';
import {ToggleButton} from '../ui/ToggleButton';
import {FilterValueType} from '@/app/pokedex/page';
type FilterBarProps = {
    filterValues: FilterValueType;
    setFilterValues: Dispatch<SetStateAction<FilterValueType>>;
};
export function FilterBar({filterValues, setFilterValues}: FilterBarProps) {
    const {allGen} = useAllPokemon();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;

        setFilterValues((prev) => {
            switch (name) {
                case 'gen':
                    return {
                        ...prev,
                        gen: value,
                        game: ''
                    };

                case 'game':
                    return {
                        ...prev,
                        game: value,
                        gen: ''
                    };

                default:
                    return {
                        ...prev,
                        [name]: value
                    };
            }
        });
    };
    const resetFilter = () => {
        setFilterValues({
            orderBy: '',
            gen: '',
            method: '',
            game: '',
            minEncounters: '',
            maxEncounters: '',
            minHuntStart: '',
            maxDateCaught: ''
        });
    };
    return (
        <div className="flex flex-row w-full gap-2 text-center items-center justify-center m-2">
            <Select onChange={handleChange} value={filterValues.gen} name="gen">
                <option value="" disabled>
                    Gen
                </option>
                {allGen.map((gen) => (
                    <option key={gen.name} value={gen.id}>
                        {capitilize(gen.main_region.name)}
                    </option>
                ))}
            </Select>
            or
            <Select onChange={handleChange} value={filterValues.game} name="game">
                <option value="" disabled>
                    Game
                </option>
                {games.map((game) => (
                    <option key={game.name}>{capitilize(game.name)}</option>
                ))}
            </Select>
            |
            <div className="flex flex-row items-center justify-center bg-secondary border-2 border-primary rounded-2xl p-1 gap-2 shadow-normal">
                <p>Encounters:</p>
                <input
                    type="number"
                    placeholder="min"
                    value={filterValues.minEncounters}
                    min={0}
                    onChange={handleChange}
                    name="minEncounters"
                    className="w-18 border-2 border-primary rounded-xl text-center"
                />
                to
                <input
                    type="number"
                    placeholder="max"
                    min={filterValues.minEncounters || 0}
                    value={filterValues.maxEncounters}
                    onChange={handleChange}
                    name="maxEncounters"
                    className="w-18 border-2 border-primary rounded-xl text-center"
                />
            </div>
            |
            <div className="flex flex-row items-center justify-center bg-secondary border-2 border-primary rounded-2xl p-1 gap-2 shadow-normal">
                <p>Hunt Dates:</p>
                <input
                    type="date"
                    placeholder="min"
                    value={filterValues.minHuntStart}
                    onChange={handleChange}
                    name="minHuntStart"
                    className="border-2 border-primary rounded-xl text-center"
                />
                to
                <input
                    type="date"
                    placeholder="max"
                    value={filterValues.maxDateCaught}
                    onChange={handleChange}
                    name="maxDateCaught"
                    min={filterValues.minHuntStart}
                    className="border-2 border-primary rounded-xl text-center"
                />
            </div>
            |
            <Select onChange={handleChange} value={filterValues.orderBy} name="orderBy">
                <option value="" disabled>
                    Sort by
                </option>
                {orderByValues.map((value) => (
                    <option key={value.id} value={value.id}>
                        {value.value}
                    </option>
                ))}
            </Select>
            |
            <div
                className="flex flex-row items-center justify-center bg-secondary border-2 border-primary rounded-2xl pl-2 pr-2 gap-2 hover:bg-primary  hover:border-darkprimary hover:text-secondary transition-colors duration-75 ease-in shadow-normal"
                onClick={resetFilter}
            >
                <p>Reset</p>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                </svg>
            </div>
        </div>
    );
}
