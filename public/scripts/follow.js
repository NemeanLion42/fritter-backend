function followUser(fields) {
    fetch(`/api/follow/${fields.id}`, {method: 'POST'})
      .then(showResponse)
      .catch(showResponse);
  }