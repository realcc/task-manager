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
  cy.get('input#email').should('be.visible');
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for GraphQL and validate response
  cy.wait('@loginRequest').then((interception) => {
    const res = interception.response?.body;
    if (res?.errors?.length > 0) {
      throw new Error(`Login failed: ${res.errors.map((e: any) => e.message).join(', ')}`);
    }
  });

  // Wait for navigation and content
  cy.url().should('include', '/dashboard', { timeout: 15000 });
  cy.get('.animate-pulse', { timeout: 15000 }).should('not.exist');
  cy.contains('Dashboard', { timeout: 15000 }).should('be.visible');
});

Cypress.Commands.add('register', (name: string, email: string, password: string) => {
  cy.intercept('POST', '**/graphql').as('registerRequest');

  cy.visit('/register');
  cy.get('input#name').should('be.visible');
  cy.get('input#name').type(name);
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('input#confirmPassword').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for GraphQL and validate response
  cy.wait('@registerRequest').then((interception) => {
    const res = interception.response?.body;
    if (res?.errors?.length > 0) {
      throw new Error(`Registration failed: ${res.errors.map((e: any) => e.message).join(', ')}`);
    }
    expect(res?.data?.register?.accessToken).to.exist;
  });

  // Wait for navigation to complete
  cy.url().should('include', '/dashboard', { timeout: 15000 });

  // Wait for loading states to clear and content to render
  cy.get('.animate-pulse', { timeout: 15000 }).should('not.exist');
  cy.contains('Dashboard', { timeout: 15000 }).should('be.visible');
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
