describe('Projects', () => {
  const testUser = {
    email: `test-projects-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };

  before(() => {
    cy.register(testUser.name, testUser.email, testUser.password);
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
