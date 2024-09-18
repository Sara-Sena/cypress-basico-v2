Cypress.Commands.add('fillMandatoryFieldsAndSubmit',function(){
    //caso não coloque valores fixos: dentro de function define os campos em insere os campos nos types:
    //function(nome, etc) ->> cy.get('#firstName').type(nome)
    cy.get('#firstName').type('Sara')
    cy.get('#lastName').type('Sena')
    cy.get('#email').type('sara@exemplo.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button','Enviar').click()
    //primeiro argumento um seletor css (button) e o segundo o texto no elemento
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })