import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContextV1";
import {
  getReviewsForProperty,
  canPostReviewForProperty,
  addPropertyReview,
} from "../../api/propertiesApi";
import { FaStar } from "react-icons/fa";

const PLACEHOLDER_IMG =
  "https://imgs.search.brave.com/m5jHohAkzrVAxMl5d5AwPtOFIgWGGxv2V6c5BQQNous/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LURvd25sb2FkLnBu/Zw";

export default function Reviews({ property, setHasReviews }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [canPost, setCanPost] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await getReviewsForProperty(property.id);
        setReviews(res.data.reviews || []);
        if (user) {
          const eligibility = await canPostReviewForProperty(property.id);
          setCanPost(eligibility.data.canPost);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [property.id, user]);

  useEffect(() => {
    if (setHasReviews) {
      setHasReviews(canPost || reviews.length > 0);
    }
  }, [reviews, canPost, setHasReviews]);

  if (!canPost && reviews.length === 0) return null;

  const handleAddReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating first");
      return;
    }
    if (!newReview.trim()) {
      toast.error("Review cannot be empty");
      return;
    }

    try {
      setAdding(true);
      const res = await addPropertyReview(property.id, newReview, rating);

      const newReviewObj = {
        ...res.data.review,
        firstName: user.firstName,
        lastName: user.lastName,
        profile_image: user.profile_image || PLACEHOLDER_IMG,
      };

      setReviews(prev => [newReviewObj, ...prev]);
      setNewReview("");
      setRating(0);
      setModalOpen(false); // close modal after adding
      toast.success("Review added successfully!");
      if (setHasReviews) setHasReviews(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 max-w-2xl mx-auto flex flex-col h-[450px] relative">
      <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4">
        Reviews for {property.title?.trim() || "this property"}
      </h2>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-5 pr-2">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-3 border rounded-xl hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={rev.profile_image || PLACEHOLDER_IMG}
                alt={rev.firstName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-800 font-semibold text-sm">
                  {rev.firstName} {rev.lastName}
                </p>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={idx < rev.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm ml-11">{rev.review_text}</p>
          </div>
        ))}
      </div>

      {/* Fixed Add Review Button */}
      {canPost && (
        <button
          onClick={() => setModalOpen(true)}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-xl font-medium shadow-lg transition"
        >
          Add Review
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-3">Add Your Review</h3>

            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl transition-transform duration-150 ${
                    star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"
                  } hover:scale-125`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <textarea
              value={newReview}
              onChange={e => setNewReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none mb-3"
              rows={4}
              disabled={adding}
            />

            <button
              onClick={handleAddReview}
              disabled={adding || rating === 0 || !newReview.trim()}
              className={`w-full py-2 px-5 rounded-xl text-white font-medium transition ${
                adding || rating === 0 || !newReview.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {adding ? "Adding..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}