# Financial Tracker

## (MUST) Features
- [ ] **Transaction Import & Categorization**  
  - The app must import transactions from a mocked bank API.  
  - The app must automatically categorize transactions (e.g., Rent, Food, Entertainment) based on stored vendors.

- [ ] **Personalized Spaces (Sub-Accounts)**  
  - The app must allow users to create virtual spaces (e.g., "Vacation", "Car Savings").  
  - The app must allow users to manually transfer money between spaces.  

- [ ] **Milestones & Statistics for Spaces**  
  - The app must allow users to set saving goals (milestones).  
  - The app must display saving goal progress visually.  

- [ ] **Income & Expense Statistics**  
  - The app must provide an overview of income and expenses.  
  - The app must visualize income and expenses data using graphical representation with charts.

- [ ] **Session**  
  - The app must retain the session (JWT/access token) after an initial login.  

## (SHOULD) Optional Features
- [ ] **Automated Money Distribution Rules**  
  - The app should allow users to define automated money distribution rules (e.g., "Save 10% of my salary automatically").  
  - The app should automatically execute these rules when new income arrives.  

- [ ] **Category-Based Budgeting**  
  - The app should allow users to define budgets for different spending categories. These are visually enforced.

- [ ] **Dark Mode Support**  
  - The app should provide a dark mode option.  

## (COULD) Optional Features
- [ ] **Stock Portfolio (Mock Data)**  
  - The app could include a simulated stock portfolio feature.
  - The app could display historical mock data rather than real-time stock values.  

- [ ] **Custom Transaction Tags**  
  - The app could allow users to create custom tags for transactions and enable filtering based on these tags.  

- [ ] **Badges and Rewards**  
  - The app could include achievement badges or rewards for meeting savings goals or staying within budget.  

- [ ] **Onboarding Flow/Tutorials for new Users**  
  - The app must include an onboarding flow to guide new users and explain core features.  

## (WONT) Future Enhancements
- The app will not integrate with the WealthAPI or any other real financial data provider.
- The app will not provide AI-driven spending analysis.
- The app will not include real-time stock market data integration.

## Non-Functional Requirements
- [ ] **The app must be built using React Native for mobile development.**
- [ ] **The app must use Node.js backend with Express.**  
- [ ] **The app must use PostgreSQL for Main Database**  
- [ ] **The app must use SQLite for Mock service.**  
- [ ] **The app must implement JWT Authentication for secure access.**  
- [ ] **The app must provide a REST API for transactions, spaces & rules**  
- [ ] **The app must offer Graphical Data Visualization (e.g., Recharts).**  
- [ ] **The app should support Localization for English.**
