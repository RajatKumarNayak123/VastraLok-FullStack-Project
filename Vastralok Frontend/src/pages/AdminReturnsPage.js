import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

const AdminReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await api.get("/api/admin/returns", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setReturns(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ APPROVE
  const approveReturn = async (id) => {
    try {
      await api.put(`/api/admin/returns/${id}/approve`, {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success("Return approved");
      fetchReturns();
    } catch (err) {
      console.error(err);
      toast.error("Approve failed");
    }
  };

  // ❌ REJECT
  const rejectReturn = async (id) => {
    try {
      await api.put(`/api/admin/returns/${id}/reject`, {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success("Return rejected");
      fetchReturns();
    } catch (err) {
      console.error(err);
      toast.error("Reject failed");
    }
  };

  // 💰 REFUND (agar backend me hai)
  const refundReturn = async (id) => {
    try {
      await api.put(`/api/admin/returns/${id}/refund`, {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success("Refund completed");
      fetchReturns();
    } catch (err) {
      console.error(err);
      toast.error("Refund failed");
    }
  };

  if (loading) return <p>Loading return requests...</p>;

  return (

    
    <div style={{ padding: "30px" }}>
      <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      <h2>🔁 Admin Return Requests</h2>

      {returns.length === 0 ? (
        <p>No return requests</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {returns.map((r) => (
              <tr key={r.returnId}>
                <td>{r.returnId}</td>
                <td>{r.orderId}</td>
                <td>{r.productName || r.productId}</td>
                <td>{r.quantity}</td>
                <td>{r.reason}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === "REQUESTED" && (
                    <>
                      <button
                        onClick={() => approveReturn(r.returnId)}
                        style={{ marginRight: "8px", background: "green", color: "white" }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectReturn(r.returnId)}
                        style={{ background: "red", color: "white" }}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {r.status === "APPROVED" && (
                    <button
                      onClick={() => refundReturn(r.returnId)}
                      style={{ background: "orange", color: "white" }}
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReturnsPage;
