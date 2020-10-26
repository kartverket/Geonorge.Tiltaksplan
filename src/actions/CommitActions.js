import {FETCH_COMMITS} from 'constants/types';

export const fetchCommits = (owner, repo) => (dispatch, getState) => {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
  let commits = getState().commits;
  if (!commits[owner]) {
    commits[owner] = {};
  }
  return fetch(apiUrl).then(res => res.json()).then(newCommits => {
    commits[owner][repo] = newCommits;
    dispatch({type: FETCH_COMMITS, payload: commits})
  });
}
