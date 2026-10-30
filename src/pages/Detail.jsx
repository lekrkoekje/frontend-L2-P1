import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { unknownImage } from '../components/PokemonCard';

const statNames = {
  hp: 'HP',
  attack: 'Aanval',
  defense: 'Verdediging',
  'special-attack': 'Speciale aanval',
  'special-defense': 'Speciale verdediging',
  speed: 'Snelheid',
};

function Detail({ favorites, addFavorite, removeFavorite, teams, addToTeam }) {

  const { id } = useParams();

  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);

  const [species, setSpecies] = useState(null);

  const [evolutions, setEvolutions] = useState([]);

  const [teamId, setTeamId] = useState('');

  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      setPokemon(null);
      setMessage(null);

      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData = await pokemonResponse.json();

      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();

      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      const evolutionList = [];
      let step = evolutionData.chain;

      while (step) {
        const evolution = {
          id: step.species.url.split('/')[6],
          name: step.species.name,
        };

        evolutionList.push(evolution);
        step = step.evolves_to[0];
      }

      setPokemon(pokemonData);
      setSpecies(speciesData);
      setEvolutions(evolutionList);
    }

    fetchPokemon();
  }, [id]);

  if (!pokemon || !species) {
    return <p className="text-muted">Pokemon laden...</p>;
  }

  const savedPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.front_default || unknownImage,
    types: pokemon.types.map((type) => type.type.name),
  };

  const isFavorite = favorites.some((item) => item.id === pokemon.id);

  const description = species.flavor_text_entries.find((entry) => entry.language.name === 'en');
  let descriptionText = '';

  if (description) {
    descriptionText = description.flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ');
  }

  function handleAddToTeam() {
    const team = teams.find((item) => item.id === Number(teamId));

    if (!team) {
      setMessage({ type: 'danger', text: 'Kies eerst een team.' });
      return;
    }

    if (team.pokemon.length >= 6) {
      setMessage({ type: 'danger', text: 'Dit team is vol, er mogen maximaal 6 Pokemon in.' });
      return;
    }

    const alreadyInTeam = team.pokemon.some((item) => item.id === pokemon.id);

    if (alreadyInTeam) {
      setMessage({ type: 'danger', text: 'Deze Pokemon zit al in dit team.' });
      return;
    }

    addToTeam(team.id, savedPokemon);
    setMessage({ type: 'success', text: `${pokemon.name} zit nu in ${team.name}!` });
  }

  function handleFavorite() {
    if (isFavorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(savedPokemon);
    }
  }

  return (
    <section>
      <button className="btn btn-outline-secondary mb-3" type="button" onClick={() => navigate(-1)}>
        Terug
      </button>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-5 text-center bg-light rounded mb-3 mb-md-0">
              <img className="detail-image" src={savedPokemon.image} alt={pokemon.name} />
            </div>

            <div className="col-md-7 ps-md-4">
              <p className="text-muted m-0">#{pokemon.id}</p>

              <h1 className="fw-bold text-capitalize">{pokemon.name}</h1>

              <div className="mb-3">
                {pokemon.types.map((type) => (
                  <span key={type.type.name} className={`badge text-capitalize fs-6 me-1 type-${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}

                {species.is_legendary && <span className="badge bg-warning text-dark fs-6 me-1">Legendarisch</span>}

                {species.is_mythical && <span className="badge bg-info text-dark fs-6 me-1">Mythisch</span>}
              </div>

              {description && <p>{descriptionText}</p>}

              <button
                className={isFavorite ? 'btn btn-danger w-100 mb-3' : 'btn btn-outline-danger w-100 mb-3'}
                type="button"
                onClick={handleFavorite}
              >
                {isFavorite ? 'Verwijder uit favorieten' : 'Maak favoriet'}
              </button>

              {teams.length === 0 && (
                <Link className="btn btn-outline-secondary w-100" to="/teams">
                  Maak eerst een team aan
                </Link>
              )}

              {teams.length > 0 && (
                <div className="input-group">
                  <select className="form-select" value={teamId} onChange={(event) => setTeamId(event.target.value)}>
                    <option value="">Kies een team</option>

                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.pokemon.length}/6)
                      </option>
                    ))}
                  </select>

                  <button className="btn btn-primary" type="button" onClick={handleAddToTeam}>
                    Toevoegen aan team
                  </button>
                </div>
              )}

              {message && <div className={`alert alert-${message.type} mt-3 mb-0`}>{message.text}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-lg-2 g-4">
        <div className="col">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Gegevens</div>

            <table className="table m-0">
              <tbody>
                <tr>
                  <td className="text-muted">Lengte</td>
                  <td>{pokemon.height / 10} m</td>
                </tr>
                <tr>
                  <td className="text-muted">Gewicht</td>
                  <td>{pokemon.weight / 10} kg</td>
                </tr>
                <tr>
                  <td className="text-muted">Generatie</td>
                  <td className="text-capitalize">{species.generation.name}</td>
                </tr>
                <tr>
                  <td className="text-muted">Habitat</td>
                  <td className="text-capitalize">{species.habitat ? species.habitat.name : 'Onbekend'}</td>
                </tr>
                <tr>
                  <td className="text-muted">Kleur</td>
                  <td className="text-capitalize">{species.color.name}</td>
                </tr>
                <tr>
                  <td className="text-muted">Basis ervaring</td>
                  <td>{pokemon.base_experience}</td>
                </tr>
                <tr>
                  <td className="text-muted">Vangkans</td>
                  <td>{species.capture_rate} van 255</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Stats</div>

            <table className="table align-middle m-0">
              <tbody>
                {pokemon.stats.map((stat) => (
                  <tr key={stat.stat.name}>
                    <td className="text-muted">{statNames[stat.stat.name]}</td>
                    <td className="fw-bold">{stat.base_stat}</td>
                    <td className="w-50">
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${(stat.base_stat / 255) * 100}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Vaardigheden</div>

            <ul className="list-group list-group-flush">
              {pokemon.abilities.map((ability) => (
                <li className="list-group-item d-flex justify-content-between text-capitalize" key={ability.ability.name}>
                  {ability.ability.name}

                  {ability.is_hidden && <span className="badge rare-badge">Verborgen</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Evolutie</div>

            <div className="card-body d-flex flex-wrap justify-content-center gap-3">
              {evolutions.map((evolution) => (
                <Link className="text-center text-decoration-none text-dark" to={`/detail/${evolution.id}`} key={evolution.id}>
                  <img
                    className="evolution-image"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                    alt={evolution.name}
                  />
                  <p className="text-capitalize m-0">{evolution.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
