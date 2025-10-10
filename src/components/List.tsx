import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Movie, useMovieData } from "./Data";
import "./List.css";

function translateRateToStars(rate: number) {
  if (rate >= 8.25) {
    return "★★★★★";
  } else if (rate >= 8) {
    return "★★★★☆";
  } else if (rate >= 7.5) {
    return "★★★★";
  } else return "★★★☆";
}

function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  return (
    <div className="movie-card" onClick={() => navigate(`/detail/${movie.id}`)}>
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <p>
        {translateRateToStars(movie.vote_average)} {movie.vote_average}
      </p>
      <p>{movie.genres.join(", ")}</p>
      <img src={movie.poster_path} alt={movie.title} />
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

function SearchBar({ setSearch }: { setSearch: (search: string) => void }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function RankByBar({ setRankby }: { setRankby: (rankby: string) => void }) {
  return (
    <div>
      <button onClick={() => setRankby("title")}>Title</button>
      <button onClick={() => setRankby("release_date")}>Release Date</button>
      <button onClick={() => setRankby("vote_average")}>Vote Average</button>
    </div>
  );
}

function SortBar({ setSort }: { setSort: (sort: string) => void }) {
  return (
    <div>
      <button onClick={() => setSort("asc")}>Asc</button>
      <button onClick={() => setSort("desc")}>Desc</button>
    </div>
  );
}

function List() {
  const { movies, loading } = useMovieData();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [rankby, setRankby] = useState("title");

  // set default rankby
  useEffect(() => {
    setRankby("vote_average");
  }, []);

  // loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // rankby functor
  const rankbyFunctor = (a: Movie, b: Movie) => {
    if (rankby === "title") {
      return a.title.localeCompare(b.title);
    } else if (rankby === "release_date") {
      return a.release_date.localeCompare(b.release_date);
    } else if (rankby === "vote_average") {
      return b.vote_average - a.vote_average;
    }
  };

  // asc or desc functor
  const ascOrDescFunctor = (Movies: Movie[]) => {
    if (sort === "asc") {
      return Movies.reverse();
    } else {
      return Movies;
    }
  };
  // render
  return (
    <div>
      <SearchBar setSearch={setSearch} />
      <RankByBar setRankby={setRankby} />
      <SortBar setSort={setSort} />
      <MovieList
        movies={ascOrDescFunctor(
          movies
            .filter((movie) => movie.title.includes(search))
            .sort(rankbyFunctor as (a: Movie, b: Movie) => number)
        )}
      />
    </div>
  );
}

export default List;
