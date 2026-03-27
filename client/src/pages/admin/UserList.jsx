import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../../src/redux/slices/usersApiSlice';
import { FaTrash, FaCheck, FaTimes, FaEdit, FaUsers } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full relative z-10">
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
             <FaUsers size={24} />
          </div>
          <div>
             <h1 className="text-4xl font-black text-white tracking-tighter">Users</h1>
             <p className="text-slate-400 font-medium mt-1">Manage all registered users.</p>
          </div>
        </div>

        {loadingDelete && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-2 overflow-hidden relative group">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="overflow-x-auto rounded-[2rem] bg-slate-950 border border-white/5 relative z-10">
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-black text-slate-400">
                  <tr>
                    <th className="px-6 py-6 border-r border-white/5">User ID</th>
                    <th className="px-6 py-6">Name</th>
                    <th className="px-6 py-6">Email</th>
                    <th className="px-6 py-6 text-center">Admin Status</th>
                    <th className="px-6 py-6 border-l border-white/5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-5 text-slate-500 font-mono text-[10px] tracking-widest border-r border-white/5">{user._id}</td>
                      <td className="px-6 py-5 text-white font-black">{user.name}</td>
                      <td className="px-6 py-5">
                        <a href={`mailto:${user.email}`} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium border-b border-emerald-400/30 hover:border-emerald-300 pb-0.5 tracking-wider">
                          {user.email}
                        </a>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {user.isAdmin ? (
                          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                             <FaCheck className="text-emerald-500" />
                             <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Admin</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-white/5">
                             <FaTimes className="text-rose-500" />
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">User</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 border-l border-white/5 text-center">
                        {!user.isAdmin ? (
                          <button
                            className="p-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-rose-400 text-rose-500 rounded-xl transition-all shadow-inner active:scale-95 group/btn"
                            onClick={() => deleteHandler(user._id)}
                            title="Delete User"
                          >
                            <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserList;
