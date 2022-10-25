function indicateInterested(fields) {
  fetch(`/api/interest/${fields.id}/interested`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function indicateNotInterested(fields) {
  fetch(`/api/interest/${fields.id}/not-interested`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function removeInterestIndication(fields) {
  fetch(`/api/interest/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getFreetInterestByUser(fields) {
  fetch(`/api/interest/user/${fields.id}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function getUserInterestByFreet(fields) {
  fetch(`/api/interest/freet/${fields.id}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}
