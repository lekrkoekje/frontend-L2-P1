import { useState } from 'react';
import { Link } from 'react-router-dom';

import PokemonCard from '../components/PokemonCard';

// De pagina met al je favoriete Pokemon.
function Favorites({ favorites, removeFavorite }) {
  // De tekst die je in de zoekbalk typt.
  const [search, setSearch] = useState('');

  // Alleen de favorieten waarvan de naam of het nummer past bij de zoektekst.
  const shownFavorites = favorites.filter((pokemon) => pokemon.name.includes(search.toLowerCase()) || String(pokemon.id) === search);

  // Zonder favorieten zie je een knop naar de Pokemon, anders een zoekbalk en de kaartjes met een kruisje.
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold m-0">Mijn favorieten</h2>
        <span className="badge bg-secondary">{favorites.length} favoriet(en)</span>
      </div>

      {favorites.length === 0 && (
        <div className="card card-body border-0 shadow-sm text-center p-5">
          <p className="text-muted">Je hebt nog geen favorieten. Open een Pokemon en klik op "Maak favoriet".</p>

          <div>
            <Link className="btn btn-primary" to="/list">
              Naar alle Pokemon
            </Link>
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <input
          className="form-control form-control-lg mb-4"
          type="text"
          placeholder="Zoek in je favorieten op naam of nummer..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      )}

      {favorites.length > 0 && shownFavorites.length === 0 && <p className="text-muted">Geen favorieten gevonden.</p>}

      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3">
        {shownFavorites.map((pokemon) => (
          <div className="col" key={pokemon.id}>
            <PokemonCard id={pokemon.id} name={pokemon.name} image={pokemon.image} types={pokemon.types}>
              <button className="btn-close remove-button" type="button" onClick={() => removeFavorite(pokemon.id)}></button>
            </PokemonCard>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Favorites;
