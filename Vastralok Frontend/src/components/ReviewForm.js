import React, { useState } from "react";
import api from "../axiosConfig"; // your axios instance

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [review, setReview] = useState({
    reviewerName: "",
    comment: "",
    rating: 5,
  });

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/products/${productId}/reviews`, review);
      setReview({ reviewerName: "", comment: "", rating: 5 });
      onReviewAdded(res.data); // notify parent to refresh list
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <input
        type="text"
        name="reviewerName"
        placeholder="Your Name"
        value={review.reviewerName}
        onChange={handleChange}
        required
      />
      <textarea
        name="comment"
        placeholder="Write your review..."
        value={review.comment}
        onChange={handleChange}
        required
      />
      <select name="rating" value={review.rating} onChange={handleChange}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
