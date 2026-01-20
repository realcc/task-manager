describe('Authentication', () => {
  beforeEach(() => {
    cy.logout();
  });

  describe('Login', () => {
    it('should display login page', () => {
      cy.visit('/login');
      cy.contains('Sign in to Task Manager').should('be.visible');
      cy.get('input#email').should('be.visible');
      cy.get('input#password').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Sign In');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      cy.get('input#email').type('invalid@example.com');
      cy.get('input#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid email or password').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/login');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid email').should('be.visible');
    });

    it('should navigate to register page', () => {
      cy.visit('/login');
      cy.contains('create a new account').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Register', () => {
    it('should display register page', () => {
      cy.visit('/register');
      cy.contains('Create your account').should('be.visible');
      cy.get('input#name').should('be.visible');
      cy.get('input#email').should('be.visible');
      cy.get('input#password').should('be.visible');
      cy.get('input#confirmPassword').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/register');
      cy.get('button[type="submit"]').click();
      cy.contains('Name must be at least 2 characters').should('be.visible');
    });

    it('should show error when passwords do not match', () => {
      cy.visit('/register');
      cy.get('input#name').type('Test User');
      cy.get('input#email').type('test@example.com');
      cy.get('input#password').type('password123');
      cy.get('input#confirmPassword').type('differentpassword');
      cy.get('button[type="submit"]').click();
      cy.contains("Passwords don't match").should('be.visible');
    });

    it('should navigate to login page', () => {
      cy.visit('/register');
      cy.contains('Sign in').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing dashboard without auth', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('should redirect to login when accessing tasks without auth', () => {
      cy.visit('/tasks');
      cy.url().should('include', '/login');
    });
  });
});
