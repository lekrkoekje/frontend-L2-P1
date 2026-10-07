import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';
import Teams from './pages/Teams';
import Favorites from './pages/Favorites';

// Het hoofdonderdeel van de website, hier worden de favorieten en teams bewaard.
function App() {
  // Haalt de favorieten en teams uit het geheugen van de browser, of begint met een lege lijst.
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoritePokemon')) || []);
  const [teams, setTeams] = useState(JSON.parse(localStorage.getItem('pokemonTeams')) || []);

  // Slaat de favorieten op als ze veranderen, zo zijn ze er na een refresh nog.
  useEffect(() => {
    localStorage.setItem('favoritePokemon', JSON.stringify(favorites));
  }, [favorites]);

  // Slaat de teams op als ze veranderen.
  useEffect(() => {
    localStorage.setItem('pokemonTeams', JSON.stringify(teams));
  }, [teams]);

  // Voegt een Pokemon toe aan de favorieten.
  function addFavorite(pokemon) {
    setFavorites([...favorites, pokemon]);
  }

  // Haalt een Pokemon uit de favorieten.
  function removeFavorite(id) {
    setFavorites(favorites.filter((pokemon) => pokemon.id !== id));
  }

  // Maakt een nieuw leeg team, Date.now() gebruiken we als uniek id.
  function addTeam(name) {
    setTeams([...teams, { id: Date.now(), name: name, pokemon: [] }]);
  }

  // Verwijdert een heel team.
  function removeTeam(teamId) {
    setTeams(teams.filter((team) => team.id !== teamId));
  }

  // Zet een Pokemon in het team met dit id, de andere teams blijven hetzelfde.
  function addToTeam(teamId, pokemon) {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        return { ...team, pokemon: [...team.pokemon, pokemon] };
      }

      return team;
    });

    setTeams(newTeams);
  }

  // Haalt een Pokemon uit het team met dit id, de andere teams blijven hetzelfde.
  function removeFromTeam(teamId, pokemonId) {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        return { ...team, pokemon: team.pokemon.filter((pokemon) => pokemon.id !== pokemonId) };
      }

      return team;
    });

    setTeams(newTeams);
  }

  // Elke Route koppelt een url aan een pagina, path="*" vangt alle onbekende urls op.
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home favoritesCount={favorites.length} teamsCount={teams.length} />} />

          <Route path="/list" element={<List />} />

          <Route
            path="/detail/:id"
            element={
              <Detail
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                teams={teams}
                addToTeam={addToTeam}
              />
            }
          />

          <Route
            path="/teams"
            element={<Teams teams={teams} addTeam={addTeam} removeTeam={removeTeam} removeFromTeam={removeFromTeam} />}
          />

          <Route path="/favorieten" element={<Favorites favorites={favorites} removeFavorite={removeFavorite} />} />

          <Route path="*" element={<Home favoritesCount={favorites.length} teamsCount={teams.length} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
