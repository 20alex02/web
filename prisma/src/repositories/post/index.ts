/* IMPORTANT: Do NOT modify this file */
import create from './post/create';
import comment from './comment';
import deletePost from './post/delete';
import read from './post/read';
import update from './post/update';

const postRepository = {
  create,
  read,
  update,
  delete: deletePost,
  comment,
};

export default postRepository;
