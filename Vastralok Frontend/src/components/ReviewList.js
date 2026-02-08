import React, { useEffect, useState } from "react";
import api from "../axiosConfig";

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState(product.reviews ||[]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/products/${productId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="review-list">
      {reviews.map((rev) => (
        <div key={rev.id} className="review-card">
          <strong>{rev.reviewerName}</strong> - {rev.rating} ⭐
          <p>{rev.comment}</p>
          <small>{new Date(rev.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
