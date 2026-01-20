describe('Dashboard', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };

  before(() => {
    cy.intercept('POST', '**/graphql').as('registerRequest');

    // Register a test user once for all dashboard tests
    cy.visit('/register');
    cy.get('input#name').type(testUser.name);
    cy.get('input#email').type(testUser.email);
    cy.get('input#password').type(testUser.password);
    cy.get('input#confirmPassword').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/dashboard');
  });

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
  });

  describe('Dashboard Display', () => {
    it('should display dashboard elements', () => {
      // Check for main dashboard elements
      cy.contains('Dashboard').should('be.visible');
    });

    it('should display stats cards', () => {
      cy.contains('Total Tasks').should('be.visible');
      cy.contains('To Do').should('be.visible');
      cy.contains('In Progress').should('be.visible');
      cy.contains('Done').should('be.visible');
    });

    it('should display recent tasks section', () => {
      cy.contains('Recent Activity').should('be.visible');
    });

    it('should display due soon section', () => {
      cy.contains('Due Soon').should('be.visible');
    });

    it('should have quick action button', () => {
      cy.contains('New Task').should('be.visible');
    });
  });

  describe('Dashboard Navigation', () => {
    it('should navigate to tasks when clicking stats card', () => {
      cy.contains('Total Tasks').click();
      cy.url().should('include', '/tasks');
    });

    it('should navigate to tasks from view all link', () => {
      cy.contains('View all tasks').click();
      cy.url().should('include', '/tasks');
    });
  });
});
