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
          .type('www.cypressurl.com/test')
        cy.get('[data-cy=addNewBlog]')
          .click()
        cy.visit('http://localhost:3000/blogs')
      })

      it('title of created blog can be found', function() {
        cy.contains('Cypress Title')
      })

      describe('individual blog can be viewed', function() {
        beforeEach(function () {
          cy.visit('http://localhost:3000/blogs')
          cy.get('[data-cy=linkToBlog]')
            .click()
        })

        it('blog can be commented', function() {
          cy.get('[data-cy=commentField]')
            .type('Cypress Comment')
          cy.get('[data-cy=commentButton]')
            .click()
          cy.contains('Cypress Comment')
        })

        it('user can like a blog', function(){
          cy.get('[data-cy=likeButton]')
            .click()
          cy.get('[data-cy=blogLikes]')
          cy.contains('1 likes')
        })

        it('user can remove blog created by user', function() {
          cy.get('[data-cy=removeButton]')
            .click()
            .should('not.exist')
        })

        describe('user can log out', function() {
          beforeEach(function() {
            cy.get('[data-cy=logoutButton]')
              .click()
          })
          it('log out button disappears when user logs out', function() {
            cy.get('[data-cy=logoutButton]')
              .should('not.exist')
          })

        })

        
      })

    })
  })
})