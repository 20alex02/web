/* IMPORTANT: Do NOT modify this file */
import deleteUser from './delete';
import login from './login';
import read from './read';
import register from './register';
import update from './update';

const userRepository = {
  delete: deleteUser,
  login,
  read,
  register,
  update,
};

export default userRepository;
