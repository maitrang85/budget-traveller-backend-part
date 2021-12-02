'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllComments = async (postId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM camping_comment WHERE post_id = ?',
      [postId]
    );
    return rows;
  } catch (e) {
    const err = httpError('SQL getAllComments error', 500);
    next(err);
  }
};

const getComment = async (commentId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM camping_comment WHERE comment_id = ?',
      [commentId]
    );
    return rows[0];
  } catch (e) {
    const err = httpError('SQL getComment error', 500);
    next(err);
  }
};

const insertComment = async (postId, comment, next) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO camping_comment(content, user_id, post_id) VALUES (?, ?, ?)',
      [comment.content, comment.userId, postId]
    );
    return rows.insertId;
  } catch (e) {
    const err = httpError('Cannot insert comment', 500);
    next(err);
  }
};

const deleteComment = async (commentId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM camping_comment WHERE comment_id = ?',
      [commentId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    const err = httpError('Cannot delete comment', 500);
    next(err);
  }
};

const updateComment = async (comment, next) => {
  try {
    const [rows] = await promisePool.execute(
      'UPDATE camping_comment SET content = ?, edited_date = ?, user_id = ? WHERE comment_id = ?',
      [comment.content, comment.editedDate, comment.userId, comment.commentId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    const err = httpError('Cannot insert comment', 500);
    next(err);
  }
};

module.exports = {
  getAllComments,
  getComment,
  insertComment,
  deleteComment,
  updateComment,
};
