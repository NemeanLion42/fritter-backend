function viewFollowingFeed(fields) {
  fetch(`/api/follow/feed`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function followUser(fields) {
  fetch(`/api/follow/${fields.id}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch(`/api/follow/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getFollowing(fields) {
  fetch(`/api/follow/following/${fields.id}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function getFollowers(fields) {
  fetch(`/api/follow/followers/${fields.id}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}