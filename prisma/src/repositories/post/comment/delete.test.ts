/* IMPORTANT: Do NOT modify this file */
import prisma from '../../client';
import type { CommentReturnType } from '../types/return';
import deleteComment from './delete';

describe('post.comment.delete test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const existingCommentId = 'c7752cca-1d46-4670-a7cd-7fb38c4d3dc7';
  const deletedCommentId = '6683614f-11ac-453a-9b5d-038de0eb31ce';
  const existingCommentAuthorId = '35e0e8da-9b01-4ae0-8c81-ac3243033f92';
  const deletedCommentAuthorId = '94ba79b3-ede8-4d91-9e72-a9f09b328b92';
  const otherUserId = 'f27d5290-3b84-4998-834a-f9369fe2b7bd';

  test('[Success]: Delete existing comment by its author', async () => {
    const expected: Partial<CommentReturnType> = {
      id: 'c7752cca-1d46-4670-a7cd-7fb38c4d3dc7',
      commenterId: '35e0e8da-9b01-4ae0-8c81-ac3243033f92',
      createdAt: new Date('2023-03-17T13:30:11.000Z'),
      postId: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
      content: 'I agree with you.',
      commenter: {
        id: '35e0e8da-9b01-4ae0-8c81-ac3243033f92',
        userName: 'johnsnowofficial',
        email: 'snow@got.com',
        createdAt: new Date('2023-03-17T12:48:06.000Z'),
        deletedAt: null,
        hashedPassword: '2a6a462fabaf273bc3e03487845abb6b2798df336d1ec410af3e2db0947e168f',
        salt: 'qeymL7Gf69UFbCvWeFWaa3560rwT4doMsf3o6VD4347edoKEfb86kL8fPJ25AT7U1gJ092Ftn0jjBMKZ9T4NMBNSR57IqkPZ76g5W5ph0ivA6yx9FLam2iSS5AVyn9Nj',
        avatar: 'https://pyxis.nymag.com/v1/imgs/bae/9eb/664ad57e704e648661d28a4590b0b176a4-12-jon-snow.2x.rsquare.w536.jpg',
      },
      post: {
        id: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
        createdAt: new Date('2023-03-17T13:18:26.000Z'),
        editedAt: new Date('2023-03-17T13:29:11.000Z'),
        deletedAt: null,
        content: 'NEW Star Wars is mid. Here! I said it!!!',
      },
    };

    const actual = await deleteComment(
      {
        id: existingCommentId,
        commenterId: existingCommentAuthorId,
      },
    );
    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(expect.objectContaining({ ...expected }));
  });

  test('[Failure]: Delete existing comment by a non-author', async () => {
    const actual = await deleteComment({ id: existingCommentId, commenterId: otherUserId });

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The specified user is not the author of the comment!');
  });

  test('[Failure]: Delete deleted comment', async () => {
    const actual = await deleteComment(
      { id: deletedCommentId, commenterId: deletedCommentAuthorId },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The comment has already been deleted!');
  });

  test('[Failure]: Delete non-existing comment', async () => {
    const actual = await deleteComment(
      { id: 'comment-that-never-was', commenterId: otherUserId },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No Comment found');
  });
});
