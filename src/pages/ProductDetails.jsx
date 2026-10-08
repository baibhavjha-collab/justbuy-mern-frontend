import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiStar,
  FiShoppingCart,
  FiArrowLeft,
} from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();

  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((r) => setP(r.data))
      .catch(() => nav('/products'));

    api
      .get(`/reviews/product/${id}`)
      .then((r) => setReviews(r.data))
      .catch(() => setReviews([]));
  }, [id, nav]);

  const buy = async () => {
    if (!user) {
      toast('Please login first');
      return;
    }

    await add(p._id, qty);
    nav('/cart');
  };

  async function submitReview(e) {
    e.preventDefault();

    if (!user) {
      toast('Please login to review this product');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post(
        `/reviews/product/${id}`,
        {
          rating: Number(rating),
          comment,
        }
      );

      setReviews((prev) => [data, ...prev]);
      setComment('');

      toast.success('Review submitted');

      const refreshed = await api.get(`/products/${id}`);
      setP(refreshed.data);
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          'Unable to submit review'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!p) {
    return (
      <div className="center page-space">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <button
          className="back"
          onClick={() => nav(-1)}
        >
          <FiArrowLeft /> Back
        </button>

        <div className="details">
          <div className="details-image">
            <img
              src={p.image}
              alt={p.name}
            />
          </div>

          <div className="details-content">
            <span className="eyebrow">
              {p.category?.name} · {p.brand}
            </span>

            <h1>{p.name}</h1>

            <div className="rating">
              <FiStar /> {p.rating.toFixed(1)}
              <span>
                {p.numReviews} reviews
              </span>
            </div>

            <h2>
              ₹{p.price.toLocaleString('en-IN')}
            </h2>

            <p>{p.description}</p>

            <p
              className={
                p.stock
                  ? 'stock'
                  : 'stock danger-text'
              }
            >
              {p.stock
                ? `${p.stock} units available`
                : 'Out of stock'}
            </p>

            {p.stock > 0 && (
              <div className="buy-row">
                <div className="quantity">
                  <button
                    disabled={qty <= 1}
                    onClick={() =>
                      setQty(qty - 1)
                    }
                  >
                    -
                  </button>

                  <span>{qty}</span>

                  <button
                    disabled={qty >= p.stock}
                    onClick={() =>
                      setQty(qty + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn"
                  onClick={buy}
                >
                  <FiShoppingCart />
                  Add to cart
                </button>
              </div>
            )}
          </div>
        </div>

        <section className="reviews-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                CUSTOMER FEEDBACK
              </span>

              <h2>Reviews</h2>
            </div>
          </div>

          {user && (
            <form
              className="form-card review-form"
              onSubmit={submitReview}
            >
              <h3>Share your experience</h3>

              <label>
                Rating

                <select
                  value={rating}
                  onChange={(e) =>
                    setRating(e.target.value)
                  }
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option
                      key={n}
                      value={n}
                    >
                      {n} star{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Review

                <textarea
                  required
                  minLength={5}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Tell other shoppers what you think..."
                />
              </label>

              <button
                className="btn"
                disabled={submitting}
              >
                {submitting
                  ? 'Submitting...'
                  : 'Submit review'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length ? (
              reviews.map((r) => (
                <article
                  className="review-card"
                  key={r._id}
                >
                  <div className="review-top">
                    <strong>
                      {r.user?.name || 'Customer'}
                    </strong>

                    <span>
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>

                  <p>{r.comment}</p>

                  <small>
                    {new Date(
                      r.createdAt
                    ).toLocaleDateString('en-IN')}
                  </small>
                </article>
              ))
            ) : (
              <div className="empty">
                <FiStar />

                <p>
                  No reviews yet. Be the first to
                  share your experience.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}