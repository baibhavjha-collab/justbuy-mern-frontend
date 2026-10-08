import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (e) {
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus });
      toast.success('Order updated');
      load();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">ADMIN</span>
          <h1>Orders</h1>
        </div>

        <div className="admin-table">
          {orders.map((o) => (
            <div
              className="table-row order-admin"
              key={o._id}
            >
              <span>
                <strong>
                  #{o._id.slice(-8).toUpperCase()}
                </strong>

                <small>
                  {o.user?.name} · {o.user?.email}
                </small>
              </span>

              <span>
                ₹{o.totalPrice.toLocaleString('en-IN')}
              </span>

              <select
                value={o.orderStatus}
                onChange={(e) =>
                  update(o._id, e.target.value)
                }
              >
                {['processing', 'shipped', 'delivered', 'cancelled'].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>

              <span>
                {new Date(o.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}