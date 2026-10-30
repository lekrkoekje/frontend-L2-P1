import { Link } from 'react-router-dom';

export const unknownImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

function PokemonCard({ id, name, image, types, children }) {
  function handleImageError(event) {
    event.target.src = unknownImage;
  }

  return (
    <div className="card pokemon-card h-100 text-center border-0 shadow-sm">
      <Link className="card-body text-decoration-none text-dark" to={`/detail/${id}`}>
        <img
          className="pokemon-image"
          src={image || unknownImage}
          alt={name}
          loading="lazy"
          onError={handleImageError}
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
