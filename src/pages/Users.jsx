// src/pages/Users.jsx

import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; // Redux hooks (commented out since backend is not connected)
// import {
//   fetchUsers,
//   addUser,
//   updateUser,
//   deleteUser,
// } from '../redux/slices/usersSlice'; // Redux actions (commented out since backend is not connected)
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { Transition } from '@headlessui/react'; // For smooth modal transitions

const Users = () => {
  // const dispatch = useDispatch();
  // const { users, loading, error } = useSelector((state) => state.users); // Backend connected

  // Dummy data for users
  const initialUsers = [
    { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { _id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'student' },
    { _id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student' },
    { _id: '4', name: 'David Williams', email: 'david@example.com', role: 'admin' },
    { _id: '5', name: 'Eva Green', email: 'eva@example.com', role: 'student' },
    { _id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'student' },
    { _id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'admin' },
    { _id: '8', name: 'Henry Adams', email: 'henry@example.com', role: 'student' },
    { _id: '9', name: 'Isabella Turner', email: 'isabella@example.com', role: 'student' },
    { _id: '10', name: 'Jack Wilson', email: 'jack@example.com', role: 'admin' },
    { _id: '11', name: 'Karen Davis', email: 'karen@example.com', role: 'student' },
    { _id: '12', name: 'Leo Martinez', email: 'leo@example.com', role: 'student' },
    // ... add more users to simulate large datasets
  ];

  const [users, setUsers] = useState([]); // Local state for users
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false); // Controls form visibility
  const [currentUser, setCurrentUser] = useState(null); // Holds user data for editing

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Adjust as needed

  // Fetch users (dummy fetch)
  useEffect(() => {
    // Commenting out backend dispatches since backend is not connected
    // dispatch(fetchUsers());

    // Simulate fetching data with dummy users
    setLoading(true);
    setTimeout(() => {
      setUsers(initialUsers);
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  // Formik setup for add/edit user
  const formik = useFormik({
    initialValues: {
      name: currentUser ? currentUser.name : '',
      email: currentUser ? currentUser.email : '',
      role: currentUser ? currentUser.role : 'student',
      password: '',
    },
    enableReinitialize: true, // Reinitialize form when currentUser changes
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid Email').required('Email is required'),
      role: Yup.string()
        .oneOf(['admin', 'student'], 'Invalid Role')
        .required('Role is required'),
      password: currentUser
        ? Yup.string().notRequired()
        : Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    }),
    onSubmit: (values) => {
      if (currentUser) {
        // Update user
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password;
        }
        // dispatch(updateUser({ id: currentUser._id, userData: updateData })); // Backend connected

        // For dummy data, update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === currentUser._id ? { ...user, ...updateData } : user
          )
        );
      } else {
        // Add new user
        // dispatch(addUser(values)); // Backend connected

        // For dummy data, add to local state
        const newUser = {
          _id: (users.length + 1).toString(),
          name: values.name,
          email: values.email,
          role: values.role,
        };
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
      setShowForm(false);
      setCurrentUser(null);
      formik.resetForm();
      setCurrentPage(1); // Reset to first page on add/update
    },
  });

  // Handle edit button click
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // dispatch(deleteUser(id)); // Backend connected

      // For dummy data, remove from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

      // Adjust current page if necessary
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Calculate pagination details
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Users Management Title */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Users Management
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add User Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-6 flex items-center"
        aria-label="Add User"
      >
        <FaPlus className="mr-2" />
        Add User
      </button>

      {/* Users Table */}
      {loading ? (
        <div className="text-gray-800 dark:text-gray-200">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200">
                      {user.email}
                    </td>
                    <td className="py-4 px-6 text-sm capitalize text-gray-800 dark:text-gray-200">
                      {user.role}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200 flex items-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700 mr-4 flex items-center"
                        aria-label={`Edit ${user.name}`}
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                        aria-label={`Delete ${user.name}`}
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 px-6 text-center text-gray-600 dark:text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {users.length > usersPerPage && (
            <div className="flex justify-center mt-6">
              <nav aria-label="Page navigation">
                <ul className="inline-flex -space-x-px">
                  {/* Previous Page Button */}
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft />
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-2 leading-tight border border-gray-300 dark:border-gray-700 ${
                          currentPage === index + 1
                            ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  {/* Next Page Button */}
                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 leading-tight text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      aria-label="Next Page"
                    >
                      <FaChevronRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Add/Edit User Modal */}
      <Transition
        show={showForm}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {currentUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={formik.handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    formik.touched.name && formik.errors.name
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
                  }`}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="John Doe"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="admin@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Role Field */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">
                  Role
                </label>
                <select
                  name="role"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    formik.touched.role && formik.errors.role
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
                  }`}
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.role}
                  </div>
                )}
              </div>

              {/* Password Field (Only for Adding New User) */}
              {!currentUser && (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                      formik.touched.password && formik.errors.password
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
                    }`}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCurrentUser(null);
                    formik.resetForm();
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  {currentUser ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>

        </Transition>
      {/* )} */}
    </div>
  );
};

export default Users;










// // src/pages/Users.jsx
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchUsers,
//   addUser,
//   updateUser,
//   deleteUser,
// } from '../redux/slices/usersSlice';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// const Users = () => {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.users);

//   const [showForm, setShowForm] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     // eslint-disable-next-line
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       name: currentUser ? currentUser.name : '',
//       email: currentUser ? currentUser.email : '',
//       role: currentUser ? currentUser.role : 'viewer',
//       password: '',
//     },
//     enableReinitialize: true,
//     validationSchema: Yup.object({
//       name: Yup.string().required('Required'),
//       email: Yup.string().email('Invalid Email').required('Required'),
//       role: Yup.string().oneOf(['admin', 'editor', 'viewer']).required('Required'),
//       password: currentUser
//         ? Yup.string().notRequired()
//         : Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
//     }),
//     onSubmit: (values) => {
//       if (currentUser) {
//         // Update user
//         const updateData = { ...values };
//         if (!updateData.password) {
//           delete updateData.password;
//         }
//         dispatch(updateUser({ id: currentUser._id, userData: updateData }));
//       } else {
//         // Add new user
//         dispatch(addUser(values));
//       }
//       setShowForm(false);
//       setCurrentUser(null);
//     },
//   });

//   const handleEdit = (user) => {
//     setCurrentUser(user);
//     setShowForm(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       dispatch(deleteUser(id));
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Users Management</h2>
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//       <button
//         onClick={() => setShowForm(true)}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
//       >
//         Add User
//       </button>

//       {loading ? (
//         <div className="text-gray-800 dark:text-gray-200">Loading...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
//             <thead>
//               <tr>
//                 <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-200">Name</th>
//                 <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-200">Email</th>
//                 <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-200">Role</th>
//                 <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-200">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                   <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">{user.name}</td>
//                   <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-200">{user.email}</td>
//                   <td className="py-2 px-4 border-b capitalize text-gray-800 dark:text-gray-200">{user.role}</td>
//                   <td className="py-2 px-4 border-b">
//                     <button
//                       onClick={() => handleEdit(user)}
//                       className="text-blue-500 hover:underline mr-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(user._id)}
//                       className="text-red-500 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {users.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center py-4 text-gray-600 dark:text-gray-400">
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Add/Edit User Form */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md overflow-y-auto max-h-screen">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//               {currentUser ? 'Edit User' : 'Add New User'}
//             </h3>
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 dark:text-gray-200">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
//                     formik.touched.name && formik.errors.name
//                       ? 'border-red-500 focus:ring-red-200'
//                       : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
//                   }`}
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   placeholder="John Doe"
//                 />
//                 {formik.touched.name && formik.errors.name && (
//                   <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 dark:text-gray-200">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
//                     formik.touched.email && formik.errors.email
//                       ? 'border-red-500 focus:ring-red-200'
//                       : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
//                   }`}
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   placeholder="admin@example.com"
//                 />
//                 {formik.touched.email && formik.errors.email && (
//                   <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 dark:text-gray-200">Role</label>
//                 <select
//                   name="role"
//                   className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
//                     formik.touched.role && formik.errors.role
//                       ? 'border-red-500 focus:ring-red-200'
//                       : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
//                   }`}
//                   value={formik.values.role}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 >
//                   <option value="admin">Admin</option>
//                   <option value="editor">Editor</option>
//                   <option value="viewer">Viewer</option>
//                 </select>
//                 {formik.touched.role && formik.errors.role && (
//                   <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
//                 )}
//               </div>
//               {!currentUser && (
//                 <div className="mb-4">
//                   <label className="block text-gray-700 dark:text-gray-200">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
//                       formik.touched.password && formik.errors.password
//                         ? 'border-red-500 focus:ring-red-200'
//                         : 'border-gray-300 focus:ring-blue-200 dark:border-gray-700 dark:focus:ring-blue-500'
//                     }`}
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     placeholder="••••••••"
//                   />
//                   {formik.touched.password && formik.errors.password && (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
//                   )}
//                 </div>
//               )}
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     setCurrentUser(null);
//                   }}
//                   className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//                 >
//                   {currentUser ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;
