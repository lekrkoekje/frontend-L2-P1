import { useState } from 'react';
import { Link } from 'react-router-dom';

function Teams({ teams, addTeam, removeTeam, removeFromTeam }) {

  const [teamName, setTeamName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = teamName.trim();

    if (trimmedName === '') {
      return;
    }

    addTeam(trimmedName);
    setTeamName('');
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold m-0">Mijn teams</h2>
        <span className="badge bg-secondary">{teams.length} team(s)</span>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form className="input-group" onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="text"
              placeholder="Naam van je nieuwe team"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />

            <button className="btn btn-primary" type="submit">
              Team maken
            </button>
          </form>
        </div>
      </div>

      {teams.length === 0 && <p className="text-muted text-center">Je hebt nog geen teams. Maak hierboven je eerste team.</p>}

      <div className="row row-cols-1 row-cols-lg-2 g-3">
        {teams.map((team) => (
          <div className="col" key={team.id}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <b className="fs-5">{team.name}</b>

                <div>
                  <span className={team.pokemon.length === 6 ? 'badge bg-success me-2' : 'badge bg-secondary me-2'}>
                    {team.pokemon.length}/6
                  </span>

                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeTeam(team.id)}>
                    Verwijder team
                  </button>
                </div>
              </div>

              <div className="card-body">
                {team.pokemon.length === 0 && (
                  <p className="text-muted m-0">
                    Dit team is nog leeg. Ga naar <Link to="/list">alle Pokemon</Link> en voeg er een toe.
                  </p>
                )}

                <div className="row row-cols-3 row-cols-sm-6 g-2">
                  {team.pokemon.map((pokemon) => (
                    <div className="col" key={pokemon.id}>
                      <div className="team-slot position-relative text-center">
                        <Link className="text-decoration-none text-dark" to={`/detail/${pokemon.id}`}>
                          <img className="team-image" src={pokemon.image} alt={pokemon.name} />
                          <p className="small text-capitalize m-0">{pokemon.name}</p>
                        </Link>

                        <button
                          className="btn-close btn-sm remove-button"
                          type="button"
                          onClick={() => removeFromTeam(team.id, pokemon.id)}
                        ></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Teams;
