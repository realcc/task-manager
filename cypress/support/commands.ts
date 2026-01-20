declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      register(name: string, email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      createTask(title: string, options?: Partial<TaskInput>): Chainable<void>;
    }
  }
}

interface TaskInput {
  description?: string;
  status?: string;
  priority?: string;
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '**/graphql').as('loginRequest');
  cy.visit('/login');
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@loginRequest');
  cy.contains('Dashboard', { timeout: 15000 }).should('be.visible');
});

Cypress.Commands.add('register', (name: string, email: string, password: string) => {
  cy.intercept('POST', '**/graphql').as('registerRequest');

  cy.visit('/register');
  cy.get('input#name').type(name);
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('input#confirmPassword').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for the GraphQL mutation to complete
  cy.wait('@registerRequest');

  cy.contains('Dashboard', { timeout: 15000 }).should('be.visible');
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
    win.localStorage.removeItem('auth-storage');
  });
  cy.visit('/login');
});

Cypress.Commands.add('createTask', (title: string, options?: Partial<TaskInput>) => {
  cy.visit('/tasks');
  cy.contains('button', 'New Task').click();
  cy.get('input[name="title"]').type(title);
  if (options?.description) {
    cy.get('textarea[name="description"]').type(options.description);
  }
  cy.contains('button', 'Create').click();
  cy.contains(title).should('be.visible');
});

export {};
