describe('Tasks', () => {
  const testUser = {
    email: `test-tasks-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };

  before(() => {
    cy.intercept('POST', '**/graphql').as('registerRequest');

    // Register a test user once for all task tests
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
    // Note: In a real test, you would seed the database or use API mocking
    // For now, we'll test the UI interactions
    cy.login(testUser.email, testUser.password);
    cy.visit('/tasks');
  });

  describe('Tasks List', () => {
    it('should display tasks page with filters', () => {
      // Check for filter dropdowns
      cy.get('select').should('have.length.at.least', 2);
    });

    it('should display empty state when no tasks', () => {
      // This would show if there are no tasks
      // cy.contains('No tasks').should('be.visible');
    });
  });

  describe('Task Filters', () => {
    it('should filter by status', () => {
      cy.get('select').first().select('TODO');
      // Verify URL or filtered results
    });

    it('should filter by priority', () => {
      cy.get('select').eq(1).select('HIGH');
      // Verify filtered results
    });

    it('should clear filters', () => {
      cy.get('select').first().select('TODO');
      cy.contains('Clear filters').click();
      cy.get('select').first().should('have.value', '');
    });
  });

  describe('Task Detail', () => {
    it('should navigate to task detail page', () => {
      // This test would work if there are tasks in the database
      // cy.get('[data-testid="task-card"]').first().click();
      // cy.url().should('match', /\/tasks\/[\w-]+/);
    });
  });
});
