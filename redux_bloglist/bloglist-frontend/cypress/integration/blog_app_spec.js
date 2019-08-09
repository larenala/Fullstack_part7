describe('Blog App', function () {
  beforeEach(function() {
    cy.visit('http://localhost:3000/blogs')
  })

  it('front page can be opened', function() {
    cy.contains('Blog App')
  })

  it('login form can be opened', function() {
    cy.contains('Log in')
      .click()
  })

  it('user can log in', function() {
    cy.contains('Log in')
      .click()
    cy.get('[data-cy=username]')
      .type('mluukkai')
    cy.get('[data-cy=password]')
      .type('secret')
    cy.get('[data-cy=kirjaudu]')
      .click()

  })
})