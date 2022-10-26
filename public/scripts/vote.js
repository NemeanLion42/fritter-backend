function upvote(fields) {
  fetch(`/api/vote/${fields.id}/upvote`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function downvote(fields) {
  fetch(`/api/vote/${fields.id}/downvote`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function removeVote(fields) {
  fetch(`/api/vote/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getFreetVotesByUser(fields) {
  fetch(`/api/vote/user/${fields.id}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function getUserVotesByFreet(fields) {
  fetch(`/api/vote/freet/${fields.id}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}
