import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Users...</div>;

  return (
    <div className="page-container">
      <h2>WordPress Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>WP ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.wp_user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>${Number(user.current_balance).toFixed(2)}</td>
              <td>
                {/* Dynamic Navigation to the user detail page */}
                <button onClick={() => navigate(`/users/${user.wp_user_id}`)}>
                  View Details & History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;