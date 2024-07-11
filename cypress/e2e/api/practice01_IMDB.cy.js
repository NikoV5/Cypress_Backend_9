/// <reference types='cypress'/>

describe('OMDB API Tests', () => {
  const apiKey = '5ef4e4e4'
  const baseUrl = 'http://www.omdbapi.com/'

  const sendRequest = (queryParam) => {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}?${queryParam}&apikey=${apiKey}`,
    })
  }

  const validateCommonFields = (response) => {
    expect(response.status).to.eq(200)
    expect(response.body.Year).to.not.be.null.and.not.be.empty
    expect(response.body.Director).to.not.be.null.and.not.be.empty
    expect(response.body.Writer).to.not.be.null.and.not.be.empty
    expect(response.body.imdbRating).to.not.be.null.and.not.be.empty
    expect(response.body.imdbID).to.match(/^tt\d{7,8}$/)
  }

  const validateSearchResults = (response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('Search').that.is.an('array')
    expect(Number(response.body.totalResults)).to.be.greaterThan(0)
    expect(response.body).to.have.property('Response').that.equals('True')
    expect(response.body.Search.length).to.be.greaterThan(0)
    response.body.Search.forEach((movie) => {
      expect(movie.Title).to.not.be.null.and.not.be.empty
      expect(movie.Year).to.not.be.null.and.not.be.empty
      expect(movie.imdbID).to.match(/^tt\d{7,8}$/)
      expect(movie.Type).to.not.be.null.and.not.be.empty
      expect(movie.Poster).to.not.be.null.and.not.be.empty
    })
  }

  it('TASK 1 - Get a Movie by its Title and Validate Response', () => {
    const movieTitle = 'The Prestige'
    sendRequest(`t=${movieTitle}`).then((response) => {
      validateCommonFields(response)
      expect(response.body.Title).to.eq(movieTitle)
    })
  })

  
  it('TASK 2 - Get a Movie by its ID and Validate Response', () => {
    const movieID = 'tt0482571'
    sendRequest(`i=${movieID}`).then((response) => {
      validateCommonFields(response)
      expect(response.body.imdbID).to.eq(movieID)
    })
  })

  it('TASK 3 - Search Movies with Valid Search Query and Validate Response', () => {
    const searchQuery = 'The%20Prestige'
    sendRequest(`s=${searchQuery}`).then((response) => {
      validateSearchResults(response)
    })
  })

  it('TASK - 4 Search Movies with Invalid Search Query and Validate Error Response', () => {
    const invalidSearchQuery = "837ddcdacdcac";
    sendRequest(`s=${invalidSearchQuery}`).then((response) => {
    // 1.	Validate that the status code is 200.
      expect(response.status).to.eq(200);
    //   2.	Validate that the response has a property called "Response" and the value is "False".
      expect(response.body).to.have.property("Response").that.equals("False");
    //   3.	Validate that the response has an "Error" property and the value is "Movie not found!".
      expect(response.body).to.have.property("Error").that.equals("Movie not found!");

      })
    })
});
