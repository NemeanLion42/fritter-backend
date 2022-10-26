function viewRecommendationsFeed(fields) {
    fetch(`/api/recommendations/feed`, {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
  }