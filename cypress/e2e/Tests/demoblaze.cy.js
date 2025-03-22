/// <reference types="cypress" />
import { cartViewSelectors } from "../PageObjects/cartViewSelectors";
import { contactFormSelectors } from "../PageObjects/contactFormSelectors";
import { mainSelectors } from "../PageObjects/mainSelectors";
import { productViewSelectors } from "../PageObjects/productViewSelectors";
import { createAccount, login, purchase } from "../utils/utils";

beforeEach(() => {
    cy.visit('https://www.demoblaze.com/index.html');
});

describe('Demoblaze Tests', () => {
    cy.log('Loging Test');
    const userName = 'testuser_' + Date.now();
    const password = 'TestPassword123';
    const products = [
        { category: 'Laptops', name: 'Sony vaio i7', price: 790 },
        { category: 'Laptops', name: 'MacBook air', price: 700 },
        { category: 'Phones', name: 'Iphone 6 32gb', price: 790 }
    ];
    const creditCard = {
        name: 'Test User',
        country: 'Testland',
        city: 'Teststadt',
        cardNummber: '9876 5432 1098 7654 3210',
        cardExpirationMonth: '03',
        ccardExpirationYear: '2029'
    }

    let totalAmount = 0;

    it('Konto anlegen, anmelden und zwei Produkte kaufen', () => {

        // Benutzer anlegen
        createAccount(userName, password);

        // Benutzer anmelden
        login(userName, password)

        // Produkte zu Einkaufskorb hinzufügen
        products.forEach((product) => {
            cy.get(mainSelectors.categoriesList).contains(product.category).click();
            cy.contains(product.name).click();
            cy.get(productViewSelectors.addToCartButton).contains('Add to cart').click();
            totalAmount += product.price;
            cy.wait(1000);

            cy.get(mainSelectors.navigationLink).contains('Home').click();
        });

        // Zum Einkaufskorb navigieren
        cy.get(mainSelectors.navigationLink).contains('Cart').click();
        cy.wait(2000);

        // Einkaufkorb überprüfen
        cy.get(cartViewSelectors.totalPriceInfo).should('have.text', totalAmount.toString());
        cy.get(cartViewSelectors.productsList).get('.success').should('have.length', products.length);
        products.forEach((product) => {
            cy.get(cartViewSelectors.productsList).contains(product.name);
            cy.get(cartViewSelectors.productsList).contains(product.price);
        });

        // Ein Produkt löschen
        cy.contains('MacBook air').parent().contains('Delete').click();
        cy.wait(2000);

        // Gesamte Summe nochmal überprüfen
        cy.get(cartViewSelectors.totalPriceInfo).should('have.text', '1580');
        cy.get(cartViewSelectors.productsList).get('.success').should('have.length', products.length - 1);

        // Bestellung abgeben
        purchase(creditCard);
    });

    it('Nachricht an Store senden', () => {

        // "Send Message Pop-up öffnen"
        cy.get(mainSelectors.navigationLink).contains('Contact').click();
        cy.get(mainSelectors.modal).should('be.visible');

        // Formular ausfüllen
        cy.get(contactFormSelectors.email).type('test@example.com');
        cy.get(contactFormSelectors.name).type('Test User');
        cy.get(contactFormSelectors.message).type('To jest testowa wiadomość.');

        // Verschicken
        cy.get(contactFormSelectors.sendButton).click();

        // Alert überprüfen
        cy.on(mainSelectors.windowsAlert, (text) => {
            expect(text).to.contain('Thanks for the message');
        });
    });
});