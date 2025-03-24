/// <reference types="cypress" />
import { cartViewSelectors } from "../PageObjects/cartViewSelectors";
import { mainSelectors } from "../PageObjects/mainSelectors";
import { productViewSelectors } from "../PageObjects/productViewSelectors";
import { createAccount, login, purchase, sendMessage } from "../utils/utils";

beforeEach(() => {
    cy.visit('https://www.demoblaze.com/index.html');
});

describe('Demoblaze Tests', () => {
    const userName = 'testuser_' + Date.now();
    const password = 'TestPassword123';
    const products = [
        { category: 'Laptops', name: 'Sony vaio i7', price: 790 },
        { category: 'Laptops', name: 'MacBook air', price: 700 },
        { category: 'Phones', name: 'Iphone 6 32gb', price: 790 }
    ];
    const categories = [
        { name: 'Phones', amount: 7 },
        { name: 'Laptops', amount: 6 },
        { name: 'Monitors', amount: 2 }
    ]
    const creditCard = {
        name: 'Test User',
        country: 'Testland',
        city: 'Teststadt',
        cardNummber: '9876 5432 1098 7654 3210',
        cardExpirationMonth: '03',
        ccardExpirationYear: '2029'
    }
    const messageDetails = {
        email: 'test@example.com',
        name: 'Test User',
        message: 'Das ist eine Testnachricht'
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
        // Eine Nachricht verschicken
        sendMessage(messageDetails);
    });

    it('FAILURE- Die Buttons "Previous" und -"Next" sind nur gezeigt, wenn es nötig ist', () => {
        //Prüfen, ob der "Prevoious" Button auf der erste Seite nicht sichtbar ist.
        cy.get(mainSelectors.prevoiusButton).should('not.be.visible');

        //Prüfen, ob der "Next" Button auf der erste Seite sichtbar ist.
        cy.get(mainSelectors.nextButton).should('be.visible');

        //Prüfen, ob der "Prevoious" Button auf der zweite Seite sichtbar ist.
        cy.get(mainSelectors.nextButton).click();
        cy.wait(1000);
        cy.get(mainSelectors.prevoiusButton).should('be.visible');
    });

    it('FAILURE- Der Button "Next" in ausgewählte Produktkategorie, nur da mehr als 9 Produkte gibt', () => {
        categories.forEach((category) => {
            // Produktkategorie auswählen
            cy.contains(mainSelectors.category, category.name).click();
            cy.wait(1000);
            if (category.amount > 9) {
                cy.get(mainSelectors.nextButton).should('be.visible'); // Der Button "Next" soll sichtbar sein
            } else {
                cy.get(mainSelectors.nextButton).should('not.be.visible'); // Der Button "Next" soll nicht sichtbar sein
            }
        });
    });
});