import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { unknownImage } from '../components/PokemonCard';

// De Engelse namen van de stats met de Nederlandse naam die we laten zien.
const statNames = {
  hp: 'HP',
  attack: 'Aanval',
  defense: 'Verdediging',
  'special-attack': 'Speciale aanval',
  'special-defense': 'Speciale verdediging',
  speed: 'Snelheid',
};

// De pagina met alle info over 1 Pokemon, hier kan je hem favoriet maken of in een team zetten.
function Detail({ favorites, addFavorite, removeFavorite, teams, addToTeam }) {
  // Het nummer van de Pokemon uit de url, bij /detail/25 is id dus 25.
  const { id } = useParams();

  // Hiermee kunnen we terug naar de vorige pagina.
  const navigate = useNavigate();

  // De opgehaalde Pokemon, eerst nog leeg (null).
  const [pokemon, setPokemon] = useState(null);

  // Extra info zoals de beschrijving, de generatie en de habitat.
  const [species, setSpecies] = useState(null);

  // De Pokemon in de evolutielijn, bijvoorbeeld Bulbasaur, Ivysaur en Venusaur.
  const [evolutions, setEvolutions] = useState([]);

  // Het team dat je in de keuzelijst hebt gekozen.
  const [teamId, setTeamId] = useState('');

  // Een melding zoals "Dit team is vol", met een kleur (success of danger).
  const [message, setMessage] = useState(null);

  // Haalt na elkaar de Pokemon, de soort en de evolutielijn op, en opnieuw als het nummer in de url verandert.
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

      // Loopt van de eerste Pokemon steeds een evolutie verder tot er niks meer komt.
      // Het nummer halen we uit de url, bij .../pokemon-species/1/ is dat het 7e stukje.
      const evolutionList = [];
      let step = evolutionData.chain;

      while (step) {
        evolutionList.push({ id: step.species.url.split('/')[6], name: step.species.name });
        step = step.evolves_to[0];
      }

      setPokemon(pokemonData);
      setSpecies(speciesData);
      setEvolutions(evolutionList);
    }

    fetchPokemon();
  }, [id]);

  // Zolang de Pokemon nog niet binnen is zie je een laadtekst.
  if (!pokemon || !species) {
    return <p className="text-muted">Pokemon laden...</p>;
  }

  // Een kleine versie van de Pokemon die we bewaren in de favorieten en teams.
  const smallPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.front_default || unknownImage,
    types: pokemon.types.map((type) => type.type.name),
  };

  // Kijkt of deze Pokemon al in je favorieten staat (true of false).
  const isFavorite = favorites.some((item) => item.id === pokemon.id);

  // Pakt de Engelse beschrijving.
  const description = species.flavor_text_entries.find((entry) => entry.language.name === 'en');

  // Voegt de Pokemon toe aan het gekozen team als dat mag, anders zie je een foutmelding.
  function handleAdd() {
    const team = teams.find((item) => item.id === Number(teamId));

    if (!team) {
      setMessage({ type: 'danger', text: 'Kies eerst een team.' });
    } else if (team.pokemon.length >= 6) {
      setMessage({ type: 'danger', text: 'Dit team is vol, er mogen maximaal 6 Pokemon in.' });
    } else if (team.pokemon.some((item) => item.id === pokemon.id)) {
      setMessage({ type: 'danger', text: 'Deze Pokemon zit al in dit team.' });
    } else {
      addToTeam(team.id, smallPokemon);
      setMessage({ type: 'success', text: `${pokemon.name} zit nu in ${team.name}!` });
    }
  }

  // Is de Pokemon al favoriet dan halen we hem weg, anders voegen we hem toe.
  function handleFavorite() {
    if (isFavorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(smallPokemon);
    }
  }

  // Bovenaan een grote kaart met de Pokemon en de knoppen, daaronder 4 kaarten met meer info.
  return (
    <section>
      <button className="btn btn-outline-secondary mb-3" type="button" onClick={() => navigate(-1)}>
        Terug
      </button>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-5 text-center bg-light rounded mb-3 mb-md-0">
              <img className="detail-image" src={smallPokemon.image} alt={pokemon.name} />
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

              {/* De rare enters (\n en \f) in de tekst vervangen we door spaties. */}
              {description && <p>{description.flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ')}</p>}

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

                  <button className="btn btn-primary" type="button" onClick={handleAdd}>
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
                {/* De API geeft decimeters en hectogram, daarom delen we door 10. */}
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
                {/* Een stat is maximaal 255, zo rekenen we uit hoe vol de balk is. */}
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
