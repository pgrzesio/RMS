describe('Simple Books API', () => {
    it('Should submit a new order', () => {
        const newOrder = {
          customerId: 1,
          items: [
            { productId: 101, quantity: 2 },
            { productId: 102, quantity: 1 }
          ],
          totalAmount: 299.99,
          shippingAddress: "123 Street, City, Country",
          paymentMethod: "Credit Card"
        };
    
        cy.request({
          method: 'POST',
          url: 'https://your-api-url.com/orders', // Podaj prawidłowy URL API
          body: newOrder,
          headers: {
            'Content-Type': 'application/json'
          }
        }).should((response) => {
          expect(response.status).to.eq(200); // Oczekujemy statusu 201 (Created)
          expect(response.body).to.have.property('orderId'); // Oczekujemy, że odpowiedź zawiera orderId
          expect(response.body).to.have.property('totalAmount', newOrder.totalAmount); // Sprawdzamy, czy kwota zamówienia się zgadza
        });
      });
  });
  