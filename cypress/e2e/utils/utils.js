import { createAccountSelectors } from "../PageObjects/createAccountSelectors";
import { loginSelectors } from "../PageObjects/loginSelectors";
import { mainSelectors } from "../PageObjects/mainSelectors";
import { placeOrderSelectors } from "../PageObjects/placeOrderSelectors";
import { cartViewSelectors } from "../PageObjects/cartViewSelectors";
import { contactFormSelectors } from "../PageObjects/contactFormSelectors";

export function createAccount(username, password) {
    // Regiestrierungsfenster öffnen
    cy.get(createAccountSelectors.createAccountButton).click();
    cy.wait(500);

    // Formular ausfühlen
    cy.get(createAccountSelectors.userName).type(username);
    cy.get(createAccountSelectors.userPassword).type(password);
    cy.get(createAccountSelectors.register).click();
}

export function login(username, password) {
    // Anmeldemaske öffnen
    cy.get(loginSelectors.loginButton).click();
    cy.wait(500);

    // Benutzername und Kennwort eingeben
    cy.get(loginSelectors.userName).type(username);
    cy.get(loginSelectors.userPassword).type(password);
    cy.get(loginSelectors.login).click();

    // Prüfen, ob Benutzer angemeldet wurde
    cy.wait(2000);
    cy.get(mainSelectors.currentUser).should('contain', username);
}

export function purchase(creditCard) {
    cy.get(cartViewSelectors.placeOrderButton).contains('Place Order').click();

    // Formular ausfüllen
    cy.get(placeOrderSelectors.name).type(creditCard.name);
    cy.get(placeOrderSelectors.country).type(creditCard.country);
    cy.get(placeOrderSelectors.city).type(creditCard.city);
    cy.get(placeOrderSelectors.cardNummber).type(creditCard.cardNummber);
    cy.get(placeOrderSelectors.cardExpirationMonth).type(creditCard.cardExpirationMonth);
    cy.get(placeOrderSelectors.cardExpirationYear).type(creditCard.ccardExpirationYear);

    // Bestellung bestätigen
    cy.get(placeOrderSelectors.purchaseButton).click();

    // Prüfen, ob die Besstelung abgegeben wurde
    cy.get(mainSelectors.browserAlert).should('be.visible').and('contain', 'Thank you for your purchase!');
    cy.get(mainSelectors.browserAlertOK).click();
}
export function sendMessage(messageDetails) {
    // "Send Message Pop-up öffnen"
    cy.get(mainSelectors.navigationLink).contains('Contact').click();
    cy.get(mainSelectors.modal).should('be.visible');

    // Formular ausfüllen
    cy.get(contactFormSelectors.email).type(messageDetails.email);
    cy.get(contactFormSelectors.name).type(messageDetails.name);
    cy.get(contactFormSelectors.message).type(messageDetails.message);

    // Verschicken
    cy.get(contactFormSelectors.sendButton).click();

    // Alert überprüfen
    cy.on(mainSelectors.windowsAlert, (text) => {
        expect(text).to.contain('Thanks for the message');
    });
}