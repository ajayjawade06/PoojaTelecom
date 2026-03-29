import { useSelector } from 'react-redux';
import { useGetUsersQuery, useDeleteUserMutation } from '../../../src/redux/slices/usersApiSlice';
import { FaTrash, FaCheck, FaTimes, FaEdit, FaUsers } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deleteHandler = async (id) => {
    if (window.confirm('Delete User?')) {
      try { await deleteUser(id); refetch(); } catch (err) {}
    }
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
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
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                      <th className="p-4"></th>
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
                            <a href={`mailto:${user.email}`} className="text-[11px] font-bold text-slate-500 hover:text-emerald-500 transition-colors uppercase tracking-widest">{user.email}</a>
                         </td>
                         <td className="p-4 text-center">
                            {user.isAdmin ? (
                               <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase border border-emerald-500/20">Admin</span>
                            ) : (
                               <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-white/10">Customer</span>
                            )}
                         </td>
                         <td className="p-4 text-right">
                            {user._id !== userInfo._id && (
                               <button onClick={() => deleteHandler(user._id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                                  <FaTrash size={12} />
                               </button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
