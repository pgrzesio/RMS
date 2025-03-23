/// <reference types="cypress" />

describe('Tests von API', () => {
    const url = 'https://simple-books-api.glitch.me/'
    const bearerToken  = 'Bearer 50463245e71c998eb0688176f6ed7eb759e6c1159811ba5e3535238300f451c9';
    let orderIds = [];
    it('Liste von Bücher anfragen', () => {
        cy.request({
          method: 'GET',
          url: `${url}books`,
        }).should((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.greaterThan(0);
        });
      });

      it('Eine Bestellung abgeben', () => {
        const newOrder = {
                "bookId": 1,
                "customerName": "Gregor"
        };
    
        cy.request({
          method: 'POST',
          url: `${url}orders`,
          body: newOrder,
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : bearerToken 
          }
        }).should((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('created');
          expect(response.body).to.have.property('orderId');
        });
      });

      it('Alle Bestellungen abfragen', () => {
        cy.request({
          method: 'GET',
          url: `${url}orders`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : bearerToken 
          }
        }).then((response) => {
            expect(response.status).to.eq(200);
    
            orderIds = response.body.map(order => order.id);
            
            expect(orderIds.length).to.be.greaterThan(0);
        });
      });

      it('Alle Bestellungen löschen', () => {
        orderIds.forEach((orderId) => {
          cy.request({
            method: 'DELETE',
            url: `${url}orders/${orderId}`,
            headers: {
              'Authorization': bearerToken
            }
          }).then((response) => {
            expect(response.status).to.eq(204);
          });
        });
      });

      it('Eine nicht vorhandene Bestellung löschen', () => {
        orderIds.forEach((orderId) => {
          cy.request({
            method: 'DELETE',
            url: `${url}orders/XYZ`,
            headers: {
              'Authorization': bearerToken
            }
          }).then((response) => {
            expect(response.status).to.eq(204);
          });
        });
      });
  });