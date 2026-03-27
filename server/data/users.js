import bcrypt from 'bcrypt';

const users = [
  {
    name: 'Admin User',
    email: 'admin@poojatelecom.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isVerified: true,
  },
];

export default users;
