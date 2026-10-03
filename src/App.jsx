import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import List from './pages/List';
export default function App() {
 return <div className="d-flex flex-column min-vh-100"><Header /><main className="container py-4 flex-grow-1"><Routes><Route path="/" element={<Home favoritesCount={0} teamsCount={0} />} /><Route path="/list" element={<List />} /></Routes></main><Footer /></div>;
}
