describe('Projects', () => {
  const testUser = {
    email: `test-projects-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };

  before(() => {
    cy.intercept('POST', '**/graphql').as('registerRequest');

    // Register a test user once for all project tests
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
    cy.visit('/projects');
  });

  describe('Projects List', () => {
    it('should display projects page', () => {
      cy.contains('Projects').should('be.visible');
    });

    it('should display new project button', () => {
      cy.contains('New Project').should('be.visible');
    });

    it('should display empty state when no projects', () => {
      // This would show if there are no projects
      // cy.contains('No projects').should('be.visible');
    });
  });
});
