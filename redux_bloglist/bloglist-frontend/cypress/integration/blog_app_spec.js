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

  describe('when logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'secret'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.visit('http://localhost:3000/blogs')
    })
    beforeEach(function() {
      cy.contains('Log in')
        .click()
      cy.get('[data-cy=username]')
        .type('mluukkai')
      cy.get('[data-cy=password]')
        .type('secret')
      cy.get('[data-cy=kirjaudu]')
        .click()
    })

    it('user is logged in', function() {
      cy.contains('Matti Luukkainen logged in')
    })

    it('create blog form can be opened', function(){
      cy.get('[data-cy=createBlog]')
        .click()
      cy.contains('Lisää uusi blogi')
    })

    describe('and a blog is created', function () {
      beforeEach(function () {
        cy.get('[data-cy=createBlog]')
          .click()
        cy.get('[data-cy=blogTitle]')
          .type('Cypress Title')
        cy.get('[data-cy=blogAuthor]')
          .type('Cypress Author')
        cy.get('[data-cy=blogUrl]')
          .type('Cypress Url')
        cy.get('[data-cy=addNewBlog]')
          .click()
      })

      it('title of created blog can be found', function() {
        cy.visit('http://localhost:3000/blogs')
        cy.contains('Cypress Title')
      })
    })
  })
})