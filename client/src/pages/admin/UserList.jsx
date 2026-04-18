import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserStatusMutation } from '../../../src/redux/slices/usersApiSlice';
import { FaTrash, FaCheck, FaTimes, FaEdit, FaUsers, FaArrowLeft, FaBan, FaCheckCircle, FaCommentAlt, FaHistory } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetUserOrdersAdminQuery } from '../../../src/redux/slices/ordersApiSlice';
import { useState } from 'react';

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const [updateUserStatus, { isLoading: loadingStatus }] = useUpdateUserStatusMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const { data: userOrders, isLoading: loadingOrders } = useGetUserOrdersAdminQuery(selectedUserId, { skip: !selectedUserId });

  const toggleStatusHandler = async (id) => {
    try {
      await updateUserStatus(id).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Delete User?')) {
      try { await deleteUser(id); refetch(); } catch (err) {}
    }
  };

  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container">

        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
          >
            <FaArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Users</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage User Accounts</p>
          </div>
        </div>

        {loadingDelete && <Loader />}

        {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <p className="text-[12px] font-black text-slate-900 dark:text-white leading-tight">{user.name}</p>
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none mt-1">ID: {user._id.slice(-6)}</p>
                    </td>
                    <td className="p-4">
                      <a href={`mailto:${user.email}`} className="text-[11px] font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest">{user.email}</a>
                    </td>
                    <td className="p-4 text-center">
                      {user.isActive ? (
                        <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase border border-blue-500/20">Active</span>
                      ) : (
                        <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded uppercase border border-rose-500/20">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {user.isAdmin ? (
                        <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase border border-indigo-500/20">Admin</span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-white/10">Customer</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUserId(user._id)}
                          className="p-2 text-slate-400 hover:text-emerald-500 transition-all font-black text-sm"
                          title="View Orders History"
                        >
                          <FaHistory size={12} />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/user/${user._id}/reviews`)}
                          className="p-2 text-slate-400 hover:text-blue-500 transition-all"
                          title="View Reviews"
                        >
                          <FaCommentAlt size={12} />
                        </button>

                        {!user.isAdmin && (
                          <button
                            onClick={() => toggleStatusHandler(user._id)}
                            className={`p-2 transition-all ${user.isActive ? 'text-slate-400 hover:text-rose-500' : 'text-slate-400 hover:text-blue-500'}`}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <FaBan size={12} /> : <FaCheckCircle size={12} />}
                          </button>
                        )}

                        {user._id !== userInfo._id && (
                          <button onClick={() => deleteHandler(user._id)} className="p-2 text-slate-300 hover:text-rose-500 transition-all" title="Delete Account">
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedUserId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Order History</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {selectedUserId}</p>
                </div>
                <button onClick={() => setSelectedUserId(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {loadingOrders ? <Loader /> : userOrders && userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map(order => (
                      <div key={order._id} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                        <div>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white">#{order._id.substring(0, 8)}</p>
                          <p className="text-[9px] font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-black text-blue-500">{'\u20B9'}{order.totalPrice.toLocaleString('en-IN')}</p>
                          <p className="text-[9px] font-black uppercase text-slate-400">{order.isDelivered ? 'Delivered' : order.isShipped ? 'Shipped' : order.isPaid ? 'Paid' : 'Pending'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8 text-xs font-bold uppercase tracking-widest">No order records found.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserList;
