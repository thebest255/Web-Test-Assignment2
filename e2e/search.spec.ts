/// <reference types="cypress" />

describe('Search.tsx', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/test')
    })

    it("test-1", () => {
        cy.contains('Search')
    });

    describe('Filters', () => {
        it("test-1", () => {
            cy.contains('Filter')
        });

        describe('Pop-up', () => {
            beforeEach(() => {
                cy.contains('Filter').click()
            })

            it("test-2", () => {
                cy.contains('Followers')
            });

            it("test-3", () => {
                cy.contains('Joined')
            });

            it("test-4", () => {
                cy.contains('Repositories')
            });

            it("test-5", () => {
                cy.contains('Best Match')
            });
        })
    });

    describe('Table', () => {
        it('test-1', () => {
            cy.contains('Name')
        })

        it('test-2', () => {
            cy.contains('Role')
        })
    });

    describe('Pagination', () => {
        it('test-1', () => {
            cy.contains('Previous')
        })

        it('test-2', () => {
            cy.contains('Next')
        })

        it('test-3', () => {
            cy.contains('Showing')
        })

        it('test-4', () => {
            cy.contains('results')
        })
    })
})