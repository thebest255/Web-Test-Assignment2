/// <reference types="cypress" />

describe('App.tsx', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it("test-1", () => {
        cy.contains('Search')
    });
})