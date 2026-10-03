import { Link } from 'react-router-dom';

// Dit plaatje laten we zien als een Pokemon geen eigen plaatje heeft.
export const unknownImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

// Een kaartje van een Pokemon, als je erop klikt ga je naar de detailpagina.
// children is een extra knop die je in het kaartje kan zetten, zoals een kruisje.
function PokemonCard({ id, name, image, types, children }) {
  // loading="lazy" laadt het plaatje pas als je ernaartoe scrolt, oude favorieten hebben soms nog geen types.
  // Bestaat het plaatje niet, dan laat onError een vraagteken zien.
  return (
    <div className="card pokemon-card h-100 text-center border-0 shadow-sm">
      <Link className="card-body text-decoration-none text-dark" to={`/detail/${id}`}>
        <img
          className="pokemon-image"
          src={image || unknownImage}
          alt={name}
          loading="lazy"
          onError={(event) => (event.target.src = unknownImage)}
        />
        <p className="small text-muted m-0">#{id}</p>
        <p className="fw-bold text-capitalize mb-1">{name}</p>

        {types &&
          types.map((type) => (
            <span key={type} className={`badge text-capitalize me-1 type-${type}`}>
              {type}
            </span>
          ))}
      </Link>

      {children}
    </div>
  );
}

export default PokemonCard;
