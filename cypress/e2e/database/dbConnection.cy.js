describe('DBConnection', () => {

    it('Runs a query', () => {
        cy.task('runQuery', 'SELECT * FROM students').then((rows) => {
            console.log(JSON.stringify(rows));
        })
    })
})