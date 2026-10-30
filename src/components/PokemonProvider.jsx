import { useEffect, useState } from 'react';
import App from '../App';

function PokemonProvider() {
  const savedFavorites = JSON.parse(localStorage.getItem('favoritePokemon')) || [];
  const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];

  const [favorites, setFavorites] = useState(savedFavorites);
  const [teams, setTeams] = useState(savedTeams);

  useEffect(() => {
    localStorage.setItem('favoritePokemon', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('pokemonTeams', JSON.stringify(teams));
  }, [teams]);

  function addFavorite(pokemon) {
    const newFavorites = [...favorites, pokemon];
    setFavorites(newFavorites);
  }

  function removeFavorite(id) {
    const remainingFavorites = favorites.filter((pokemon) => pokemon.id !== id);
    setFavorites(remainingFavorites);
  }

  function addTeam(name) {
    const newTeam = {
      id: Date.now(),
      name: name,
      pokemon: [],
    };

    const newTeams = [...teams, newTeam];
    setTeams(newTeams);
  }

  function removeTeam(teamId) {
    const remainingTeams = teams.filter((team) => team.id !== teamId);
    setTeams(remainingTeams);
  }

  function addToTeam(teamId, pokemon) {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        const newPokemon = [...team.pokemon, pokemon];
        return { ...team, pokemon: newPokemon };
      }

      return team;
    });

    setTeams(newTeams);
  }

  function removeFromTeam(teamId, pokemonId) {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        const remainingPokemon = team.pokemon.filter((pokemon) => pokemon.id !== pokemonId);
        return { ...team, pokemon: remainingPokemon };
      }

      return team;
    });

    setTeams(newTeams);
  }

  return (
    <App
      favorites={favorites}
      teams={teams}
      addFavorite={addFavorite}
      removeFavorite={removeFavorite}
      addTeam={addTeam}
      removeTeam={removeTeam}
      addToTeam={addToTeam}
      removeFromTeam={removeFromTeam}
    />
  );
}

export default PokemonProvider;
