import { useParams, useNavigate } from "react-router-dom";
import { useReviews, Review, useMovieData } from "./Data";
import dbApi from "../Api";

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <h3 className="review-author">{review.author}</h3>
      <p className="review-content">{review.content}</p>
    </div>
  );
}

function Detail() {
  // get the id from the url
  const { id } = useParams();
  const navigate = useNavigate();

  // get the movie from the api
  const { movies } = useMovieData();
  const movie = movies.find((movie) => movie.id === Number(id));
  const previousMovie = movies.find((movie) => movie.id < Number(id));
  const nextMovie = movies.find((movie) => movie.id > Number(id));

  const { reviews, loading: reviewsLoading } = useReviews(Number(id));

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="detail">
      <h1 className="title">{movie?.title}</h1>
      <p className="overview">{movie?.overview}</p>
      <p className="release-date">{movie?.release_date}</p>
      <p className="vote-average">{movie?.vote_average}</p>
      <p className="genres">{movie?.genres.join(", ")}</p>
      <img src={movie?.poster_path} alt={movie?.title} className="poster" />
      <div className="previous-next-buttons">
        {previousMovie && (
          <button
            className="previous-button"
            onClick={() => navigate(`/detail/${previousMovie?.id}`)}
          >
            Previous
          </button>
        )}
        {nextMovie && (
          <button
            className="next-button"
            onClick={() => navigate(`/detail/${nextMovie?.id}`)}
          >
            Next
          </button>
        )}
      </div>

      <h2 className="reviews-title">Reviews</h2>
      {reviewsLoading ? (
        <div>Loading reviews...</div>
      ) : (
        <div className="reviews">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="no-reviews">No reviews available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Detail;
