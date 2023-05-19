/*
 * IMPORTANT: Modify this file as you wish! To run this file,
 * run the `npm start` script.
 *
 * To run the provided example, uncomment the `showcaseRepositories` function,
 * along with repository imports and the function call at the end of this file.
 */

/* eslint-disable max-len */
/* eslint-disable no-console */
// import postRepository from './repositories/post';
// import userRepository from './repositories/user';

console.log(
  'Remove this log and write your own implementation here.'
    + 'You can use this to test your functions before running the seed or to test task 2. '
    + 'Alternatively, run the showcaseRepositories function (uncomment everything related to it).',
);

// const showcaseRepositories = async () => {
//   // create a user
//   const user = await userRepository.register({
//     userName: 'the.mf.billy.butcher',
//     avatar: 'https://static.wikia.nocookie.net/amazons-the-boys/images/6/6b/Billy-Butcher-S3.png/revision/latest?cb=20220604005831',
//     email: 'butcher.b@fbi.gov',
//     hashedPassword: 'f5e24c095c5f09e125ac80c54e06b1116d038836de9e48887813cf93f84df4ed',
//     salt: 'd59367KfG1wkK5HrFc5cmE37MMeu8YEMGf12W0nMV7R7c3aAw61eg8Lk3AGNk82bXl9o6m999bIc14iP0zCKb2LFcqbKEC4SythOUyggkieailM5USAL684b1v9L8ee9',
//   });

//   if (user.isErr) return false;

//   console.log(user.value);

//   // create a post
//   const newPost = await postRepository.create({
//     creatorId: user.value.id,
//     content: 'Homelander is a mad psychotic c*nt.',
//   });

//   if (newPost.isErr) return false;

//   console.log(newPost.value);

//   // write whatever own tests you want here:

//   return true;
// };

// // uncomment in case you want to run this sample code against
// // your `database.db`. To re-seed the db, run the `npm run seed` script
// // defined in the `package.json` file
// showcaseRepositories();
