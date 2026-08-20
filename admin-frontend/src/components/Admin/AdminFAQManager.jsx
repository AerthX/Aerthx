import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/admin/faqs"; 

const FAQManager = ({ category, title }) => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, [category]);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API_URL}/${category}`);
      setFaqs(res.data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { question, answer, category }); 
      setQuestion("");
      setAnswer("");
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      console.error("Error adding FAQ:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error("Error deleting FAQ:", err);
    }
  };

  const handleUpdateFAQ = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`${API_URL}/${editingFAQ._id}`, {
      question: editingFAQ.question,
      answer: editingFAQ.answer,
      category,
    });
    setEditingFAQ(null);
    fetchFaqs();
  } catch (err) {
    console.error("Error updating FAQ:", err);
  }
};


  return (
    <div className="space-y-6">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-green-700">{title}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add FAQ
        </button>
      </div>

      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
  {faqs.length === 0 ? (
    <p className="p-4 text-gray-500">No FAQs available.</p>
  ) : (
    faqs.map((faq) => (
      <li
        key={faq._id}
        className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0"
      >
        {editingFAQ && editingFAQ._id === faq._id ? (
          <form
            className="flex flex-col lg:flex-row lg:items-center w-full gap-3"
            onSubmit={handleUpdateFAQ}
          >
            <input
              type="text"
              value={editingFAQ.question}
              onChange={(e) =>
                setEditingFAQ({ ...editingFAQ, question: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              value={editingFAQ.answer}
              onChange={(e) =>
                setEditingFAQ({ ...editingFAQ, answer: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingFAQ(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full">
            <div>
              <p className="font-semibold">{faq.question}</p>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
      <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEditingFAQ(faq)}
                className="text-blue-600 hover:underline"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(faq._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </li>
    ))
  )}
</ul>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Add New FAQ</h3>
            <form onSubmit={handleAddFAQ} className="space-y-4">
              <input
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded"
                required
              />
              <textarea
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded"
                rows="3"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminFAQPage = () => {
  return (
    <div className="space-y-12">
      <FAQManager category="resource" title="Resources - FAQs" />
      <FAQManager category="support" title="Help & Support - FAQs" />
    </div>
  );
};

export default AdminFAQPage;
