import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../../src/redux/slices/usersApiSlice';
import { FaTrash, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
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
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Users</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="red">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">NAME</th>
                <th className="px-6 py-4 font-bold">EMAIL</th>
                <th className="px-6 py-4 font-bold">ADMIN</th>
                <th className="px-6 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700">{user._id}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{user.name}</td>
                  <td className="px-6 py-4"><a href={`mailto:${user.email}`} className="text-emerald-600 hover:underline">{user.email}</a></td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <FaCheck className="text-emerald-500" />
                    ) : (
                      <FaTimes className="text-rose-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!user.isAdmin && (
                      <button
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded transition-colors"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
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
  );
};
export default UserList;
