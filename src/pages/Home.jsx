import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// De homepagina, de eerste pagina die je ziet.
function Home({ favoritesCount, teamsCount }) {
  // De willekeurige Pokemon, eerst nog leeg (null).
  const [pokemon, setPokemon] = useState(null);

  // Haalt een willekeurige Pokemon (nummer 1 t/m 1025) op als de pagina opent.
  useEffect(() => {
    async function fetchRandomPokemon() {
      const randomId = Math.floor(Math.random() * 1025) + 1;

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();

      setPokemon(data);
    }

    fetchRandomPokemon();
  }, []);

  // Bovenaan de welkomstkaart met de willekeurige Pokemon, daaronder 3 kaarten naar de andere pagina's.
  return (
    <section>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center">
            <div className="col-md-7 text-center text-md-start">
              <h1 className="fw-bold">Welkom trainer!</h1>

              <p className="lead text-muted">Zoek je favoriete Pokemon op, bewaar ze en maak je eigen teams van 6.</p>

              <Link className="btn btn-primary btn-lg me-2 mb-2" to="/list">
                Bekijk alle Pokemon
              </Link>

              <Link className="btn btn-outline-secondary btn-lg mb-2" to="/teams">
                Mijn teams
              </Link>
            </div>

            <div className="col-md-5 text-center">
              {!pokemon && <p className="text-muted">Pokemon laden...</p>}

              {pokemon && (
                <Link className="text-decoration-none text-dark" to={`/detail/${pokemon.id}`}>
                  <img className="home-pokemon" src={pokemon.sprites.front_default} alt={pokemon.name} />
                  <p className="text-capitalize fw-bold m-0">{pokemon.name}</p>
                  <p className="small text-muted">Klik voor meer info</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3">
        <div className="col">
          <Link className="card pokemon-card h-100 border-0 shadow-sm text-decoration-none text-dark" to="/list">
            <div className="card-body">
              <h5 className="fw-bold">Pokemon</h5>
              <p className="text-muted m-0">Bekijk alle Pokemon.</p>
            </div>
          </Link>
        </div>

        <div className="col">
          <Link className="card pokemon-card h-100 border-0 shadow-sm text-decoration-none text-dark" to="/teams">
            <div className="card-body">
              <h5 className="fw-bold">Teams</h5>
              <p className="text-muted m-0">Je hebt {teamsCount} team(s).</p>
            </div>
          </Link>
        </div>

        <div className="col">
          <Link className="card pokemon-card h-100 border-0 shadow-sm text-decoration-none text-dark" to="/favorieten">
            <div className="card-body">
              <h5 className="fw-bold">Favorieten</h5>
              <p className="text-muted m-0">Je hebt {favoritesCount} favoriet(en).</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
