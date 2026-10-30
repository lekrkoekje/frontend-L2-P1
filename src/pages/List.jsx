import { useEffect, useState } from 'react';

import PokemonCard from '../components/PokemonCard';

const typeNames = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

function List() {
  const [pokemonList, setPokemonList] = useState([]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchPokemon() {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=-1');
      const data = await response.json();

      const pokemon = data.results.map((item) => {
        const pokemonId = Number(item.url.split('/')[6]);

        return {
          id: pokemonId,
          name: item.name,
          types: [],
        };
      });

      for (const typeName of typeNames) {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const typeData = await typeResponse.json();

        for (const item of typeData.pokemon) {
          const pokemonId = Number(item.pokemon.url.split('/')[6]);
          const matchingPokemon = pokemon.find((pokemon) => pokemon.id === pokemonId);

          if (matchingPokemon) {
            matchingPokemon.types[item.slot - 1] = typeName;
          }
        }
      }

      setPokemonList(pokemon);
    }

    fetchPokemon();
  }, []);

  const shownPokemon = pokemonList.filter((pokemon) => {
    const matchesName = pokemon.name.includes(search.toLowerCase());
    const matchesNumber = String(pokemon.id) === search;

    return matchesName || matchesNumber;
  });

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold m-0">Alle Pokemon</h2>
      </div>

      <input
        className="form-control form-control-lg mb-4"
        type="text"
        placeholder="Zoek op naam of nummer..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {pokemonList.length === 0 && <p className="text-muted">Pokemon laden...</p>}

      {pokemonList.length > 0 && shownPokemon.length === 0 && <p className="text-muted">Geen Pokemon gevonden.</p>}

      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3">
        {shownPokemon.map((pokemon) => (
          <div className="col" key={pokemon.id}>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              types={pokemon.types}
              image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default List;
