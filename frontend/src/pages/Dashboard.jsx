import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

// 🔐 Decode JWT to get role
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");

  // Admin form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const role = getUserRole();
  const isAdmin = role === "ADMIN";

  // 🔐 Load sweets
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const loadSweets = async () => {
      try {
        const res = await api.get("/sweets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSweets(res.data);
      } catch {
        alert("Failed to load sweets");
      }
    };

    loadSweets();
  }, [navigate]);

  // 🛒 Purchase
  const purchaseSweet = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/sweets/${id}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSweets((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, quantity: s.quantity - 1 } : s
        )
      );
    } catch {
      alert("Purchase failed");
    }
  };

  // ➕ Add Sweet (Admin)
  const addSweet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/sweets",
        {
          name,
          category,
          price: Number(price),
          quantity: Number(quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSweets((prev) => [...prev, res.data.sweet]);
      setName("");
      setCategory("");
      setPrice("");
      setQuantity("");
    } catch {
      alert("Add sweet failed");
    }
  };

  // 🗑 Delete (Admin)
  const deleteSweet = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSweets((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // 📦 Restock (Admin)
  const restockSweet = async (id) => {
    const qty = prompt("Enter quantity to add");
    if (!qty) return;

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/sweets/${id}/restock`,
        { quantity: Number(qty) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSweets((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, quantity: res.data.quantity } : s
        )
      );
    } catch {
      alert("Restock failed");
    }
  };

  // 🔍 Search filter
  const filteredSweets = sweets.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Sweet Shop Dashboard</h2>
        <button className="secondary" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Search */}
      <input
        className="search-input"
        placeholder="Search sweets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Admin Form */}
      {isAdmin && (
        <form className="admin-form" onSubmit={addSweet}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button className="primary" type="submit">
            Add Sweet
          </button>
        </form>
      )}

      {/* Sweet Cards */}
      <div className="sweets-grid">
        {filteredSweets.length === 0 ? (
          <p>No sweets found</p>
        ) : (
          filteredSweets.map((sweet) => (
            <div className="sweet-card" key={sweet._id}>
              <div className="sweet-title">{sweet.name}</div>
              <div className="sweet-category">{sweet.category}</div>
              <div className="sweet-price">₹ {sweet.price}</div>
              <div className="sweet-qty">Stock: {sweet.quantity}</div>

              {/* 🔘 Buttons */}
              <div className="card-buttons">
                <button
                  className="success"
                  disabled={sweet.quantity === 0}
                  onClick={() => purchaseSweet(sweet._id)}
                >
                  {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
                </button>

                {isAdmin && (
                  <>
                    <button
                      className="secondary"
                      onClick={() => restockSweet(sweet._id)}
                    >
                      Restock
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteSweet(sweet._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;