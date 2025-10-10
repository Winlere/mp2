import { useState, useEffect } from "react";
import dbApi from "../Api";

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  genres: string[];
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export function useReviews(id: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dbApi
      .get(`/movie/${id}/reviews`)
      .then((res: { data: { results: Review[] } }) => {
        setReviews(res.data.results);
        setLoading(false);
      });
  }, [id]);
  return { reviews, loading };
}

export function useMovieData() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genresMap, setGenresMap] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  // fetch genres
  useEffect(() => {
    dbApi.get("/genre/movie/list").then((res) => {
      const genreMap = res.data.genres.reduce((acc: any, genre: any) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      setGenresMap(genreMap);
    });
  }, []);

  // fetch movies
  useEffect(() => {
    if (Object.keys(genresMap).length === 0) {
      return; // Wait for genres to load first
    }

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
          genres: m.genre_ids.map((genre_id: number) => genresMap[genre_id]),
        }))
      );
      // optional: de-dup by id in case pages overlap
      const dedup = Array.from(new Map(merged.map((m) => [m.id, m])).values());
      setMovies(dedup);
      setLoading(false);
    });
  }, [genresMap]);

  return { movies, loading, genresMap };
}
