/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() { //Antes de cada teste vai executar o seguinte comando
        cy.visit('./src/index.html')
    })


    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        //.only vai executar apenas o encadeamento de teste atrelado
        const longText = 'Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. Teste texto maior. '
        //criado variável para inserir o texto maior
        cy.get('#firstName').type('Sara')
        cy.get('#lastName').type('Sena')
        cy.get('#email').type('sara@exemplo.com', {delay:0})
        cy.get('#open-text-area').type(longText, {delay:0})//delay 0 tira a digitação longa no teste (tornando mais rápido)
        //cy.get('.button') ->> seletor gerado pelo cypress, não muito detalhado
        //recomendado pegar detalhes direto pela aplicação
        //cy.get('button[type="submit"]').click() ->>abaixo criado uma forma mais específica de achar o botão desejado
        cy.contains('button','Enviar').click()
        //primeiro argumento um seletor css (button) e o segundo o texto no elemento
        cy.get('.success').should('be.visible')//confirma se mensagem visível
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Sara')
        cy.get('#lastName').type('Sena')
        cy.get('#email').type('sara.exemplo.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button','Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico',function(){
        cy.get('#phone')
            .type('teste').should('have.value', '')//não numerico deve ficar vazio
            .type('123415').should('have.value', '123415')//numerico deve retorno o numero
    })
    
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário',function(){
        cy.get('#firstName').type('Sara')
        cy.get('#lastName').type('Sena')
        cy.get('#email').type('sara@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button','Enviar').click()
        cy.get('.error').should('be.visible')
    })
    
    it('preenche e limpa os campos nome, sobrenome, email e telefone',function(){
        cy.get('#firstName').type('Sara').should('have.value','Sara')//confirma que o campo realmente tem esse valor
            .clear().should('have.value','')//confirma que o campo teve seu valor limpado
        cy.get('#lastName').type('Sena').should('have.value','Sena')
            .clear().should('have.value','')
        cy.get('#email').type('sara@exemplo.com').should('have.value','sara@exemplo.com')
            .clear().should('have.value','')
        cy.get('#phone').type('123456').should('have.value','123456')
            .clear().should('have.value','')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios',function(){
        cy.contains('button','Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado',function(){
        cy.fillMandatoryFieldsAndSubmit()
        //criado comando customizado na pasta cypress/support/commands.js
        //se não definido os valores fixos isere eles na função
        //fillMandatoryFieldsAndSubmit('Sara', 'Sena', etc)
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        //cy.get('select').select('youtube')
        cy.get('#product').select("YouTube")
        //usando # indica um id
        //.select para selecionar campos de dropdown - seletores
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
        //cy.get(':nth-child(4) > input').check() --> seletor do cypress
        cy.get('input[type="radio"][value="feedback"]').check() //--> seletor inspecionar
            //.check seleciona uma opção de radio button
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]').should('have.length', 3) //valida se possui 3 elementos
            .each(function($radio){
            //adiciona na função cada radio que existe    
                cy.wrap($radio).check()
                //clica cada um da lista
                cy.wrap($radio).should('be.checked')
            })
            //.each -- interar sob uma estrtutura de array
            //.wrap -- empacotar para usar posteriormente
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        //cy.get('#email-checkbox').check().should('be.checked')
        //cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('input[type="checkbox"]').check().should('be.checked') //seleciona todos que possuem esse type
            .last().uncheck().should('not.be.checked')
            //.last -- seleciona o ultimo type
        //cy.get('#phone-checkbox').uncheck().should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                //$input recebe o valor de cy.get('input[type="file"]#file-upload')
                console.log($input)
                //exibe o jquery do input
                expect($input[0].files[0].name).to.equal('example.json')
                //navega dentro dos arrays, entra em input, depois files e depois localiza o name
                //nome, do primeiro arquivo (.files[0]) do primeiro input $input[0]
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action:'drag-drop'})
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })     
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        //acessa direto a pasta fixture e oq tiver o nome informado vamos chamá-lo de 'sampleFile'
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            //ao criar um alias, insere o @ para chamar o criado
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })  
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
        //localizou âncora (a) dentro do elemento de id privacy
        //verificou se no atributo chamado target possui o valor '_blank'
        //_blank em um código indica que será aberto uma nova aba
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')//localiza onde possui o link para direcionar
            .invoke('removeAttr', 'target') //irá remover o atributo de abrir uma nova aba
            .click() // quando clicar será aberto na mesma aba inicial
        cy.contains('Talking About Testing').should('be.visible')
    })

    
})
