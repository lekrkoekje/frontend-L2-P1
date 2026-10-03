import { useEffect, useState } from 'react';

import PokemonCard from '../components/PokemonCard';

// De namen van alle 18 Pokemon types.
const typeNames = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

// De pagina met alle Pokemon en een zoekbalk.
function List() {
  // Alle Pokemon, eerst is de lijst nog leeg.
  const [pokemonList, setPokemonList] = useState([]);

  // De tekst die je in de zoekbalk typt.
  const [search, setSearch] = useState('');

  // Haalt alle Pokemon op als de pagina opent, het nummer halen we uit de url (het 7e stukje).
  useEffect(() => {
    async function fetchPokemon() {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=-1');
      const data = await response.json();

      const pokemon = data.results.map((item) => ({ id: Number(item.url.split('/')[6]), name: item.name, types: [] }));

      // Haalt elk type op en zet dat type bij al zijn Pokemon, zo zijn het maar 18 fetches.
      for (const typeName of typeNames) {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const typeData = await typeResponse.json();

        for (const item of typeData.pokemon) {
          const pokemonId = Number(item.pokemon.url.split('/')[6]);
          const found = pokemon.find((p) => p.id === pokemonId);

          if (found) {
            found.types[item.slot - 1] = typeName;
          }
        }
      }

      setPokemonList(pokemon);
    }

    fetchPokemon();
  }, []);

  // Alleen de Pokemon waarvan de naam of het nummer past bij de zoektekst.
  const shownPokemon = pokemonList.filter((pokemon) => pokemon.name.includes(search.toLowerCase()) || String(pokemon.id) === search);

  // Bovenaan de titel en de zoekbalk, daaronder alle kaartjes.
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
