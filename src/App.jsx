import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';
import Teams from './pages/Teams';
import Favorites from './pages/Favorites';

function App({ favorites, teams, addFavorite, removeFavorite, addTeam, removeTeam, addToTeam, removeFromTeam }) {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home favoritesCount={favorites.length} teamsCount={teams.length} />} />
        <Route path="/list" element={<List />} />
        <Route path="/detail/:id" element={<Detail favorites={favorites} addFavorite={addFavorite} removeFavorite={removeFavorite} teams={teams} addToTeam={addToTeam} />} />
        <Route path="/teams" element={<Teams teams={teams} addTeam={addTeam} removeTeam={removeTeam} removeFromTeam={removeFromTeam} />} />
        <Route path="/favorieten" element={<Favorites favorites={favorites} removeFavorite={removeFavorite} />} />
        <Route path="*" element={<Home favoritesCount={favorites.length} teamsCount={teams.length} />} />
      </Route>
    </Routes>
  );
}

export default App;
