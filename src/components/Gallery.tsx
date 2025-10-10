import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Movie, useMovieData } from "./Data";
import "./Gallery.scss";

function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  return (
    <div className="movie-card">
      <img
        src={movie.poster_path}
        alt={movie.title}
        onClick={() => navigate(`/detail/${movie.id}`)}
      />
    </div>
  );
}

function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <div>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

function GenreBar({
  genresMap,
  setGenres,
}: {
  genresMap: { [key: number]: string };
  setGenres: (genres: number) => void;
}) {
  let _keys = Object.keys(genresMap).map(Number);
  let _values = Object.values(genresMap);
  // prepend -1: All
  const keys = [-1, ..._keys];
  const values = ["All", ..._values];
  const buttons = Array.from({ length: keys.length }, (_, i) => (
    <button key={keys[i]} onClick={() => setGenres(keys[i])}>
      {values[i]}
    </button>
  ));
  return <>{buttons}</>;
}

function Gallery() {
  const { movies, loading, genresMap } = useMovieData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<number>(-1);

  // Initialize genre from URL on mount
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) {
      setGenres(Number(genreParam));
    }
  }, [searchParams]);

  // Update URL when genre changes
  const handleSetGenres = (genreId: number) => {
    setGenres(genreId);
    if (genreId === -1) {
      setSearchParams({});
    } else {
      setSearchParams({ genre: genreId.toString() });
    }
  };

  // loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // rankby functor
  const rankbyFunctor = (a: Movie, b: Movie) => {
    return b.vote_average - a.vote_average;
  };

  // filter functor
  const filterFunctor = (movie: Movie) => {
    return genres === -1 ? true : movie.genre_ids.includes(genres);
  };

  // render
  return (
    <div>
      <GenreBar genresMap={genresMap} setGenres={handleSetGenres} />
      <MovieList
        movies={movies
          .filter(filterFunctor)
          .sort(rankbyFunctor as (a: Movie, b: Movie) => number)}
      />
    </div>
  );
}

export default Gallery;
