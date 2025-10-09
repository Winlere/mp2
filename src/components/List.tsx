import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dbApi from "../Api";
import "./List.css";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  genres: string[];
}

function translateRateToStars(rate: number) {
  if (rate >= 8.25) {
    return "★★★★★";
  } else if (rate >= 8) {
    return "★★★★♡";
  } else if (rate >= 7.5) {
    return "★★★♡";
  } else return "★★♡";
}

function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  return (
    <div className="movie-card">
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <p>
        {translateRateToStars(movie.vote_average)} {movie.vote_average}
      </p>
      <p>{movie.genres.join(", ")}</p>
      <img src={movie.poster_path} alt={movie.title} />
      <button onClick={() => navigate(`/detail/${movie.id}`)}>
        View Details
      </button>
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

function List() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreslist, setGenreslist] = useState<{ [key: number]: string }>({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [rankby, setRankby] = useState("title");

  // set default rankby
  useEffect(() => {
    setRankby("vote_average");
  }, []);

  // fetch genres
  useEffect(() => {
    dbApi.get("/genre/movie/list").then((res) => {
      const genreMap = res.data.genres.reduce((acc: any, genre: any) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      setGenreslist(genreMap);
    });
  }, []);

  // fetch movies
  useEffect(() => {
    const pages = Array.from({ length: 10 }, (_, idx) => idx + 1);
    Promise.all(
      pages.map((i) =>
        dbApi.get("/discover/movie", {
          params: {
            language: "en-US",
            page: i,
            sort_by: "vote_average.desc",
            "vote_count.gte": 1000,
            // OR query: Drama (18) OR Animation (16)
            with_genres: "18|16", // Axios will URL-encode the pipe
            // tip: you can also add include_adult: false if needed
          },
        })
      )
    ).then((responses) => {
      const merged = responses.flatMap((res) =>
        res.data.results.map((m: Movie) => ({
          ...m,
          poster_path: `https://image.tmdb.org/t/p/w500/${m.poster_path}`,
          genres: m.genre_ids.map((genre_id: number) => genreslist[genre_id]),
        }))
      );
      // optional: de-dup by id in case pages overlap
      const dedup = Array.from(new Map(merged.map((m) => [m.id, m])).values());
      setMovies(dedup);
    });
  }, [genreslist]);

  // loading
  if (movies.length === 0) {
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

  // render
  return (
    <div>
      <SearchBar setSearch={setSearch} />
      <RankByBar setRankby={setRankby} />
      <MovieList
        movies={movies
          .filter((movie) => movie.title.includes(search))
          .sort(rankbyFunctor as (a: Movie, b: Movie) => number)}
      />
    </div>
  );
}

export default List;
