### Labels
- **Label name**: deprecated  
  **Description**: Feature that was implemented but later removed or replaced  
  **Color**: #6E7079

- **Label name**: bug  
  **Description**: Errors or issues to fix  
  **Color**: #d73a4a

- **Label name**: carried-over  
  **Description**: Indicates tasks moved from a previous sprint  
  **Color**: #6E7079

- **Label name**: completed  
  **Description**: Work that has been successfully implemented  
  **Color**: #0e8a16

- **Label name**: documentation  
  **Description**: Improvements or additions to documentation  
  **Color**: #0075ca

- **Label name**: duplicate  
  **Description**: This issue or pull request already exists  
  **Color**: #cfd3d7

- **Label name**: enhancement  
  **Description**: New feature or request  
  **Color**: #a2eeef

- **Label name**: help wanted  
  **Description**: Extra attention is needed  
  **Color**: #008672

- **Label name**: mobile  
  **Description**: Tasks related to the mobile version of the project  
  **Color**: #6E7079

- **Label name**: not-implemented  
  **Description**: Feature that was planned but cancelled before implementation was completed  
  **Color**: #e99695

- **Label name**: question  
  **Description**: Further information is requested  
  **Color**: #d876e3

- **Label name**: type: epic  
  **Description**: Large pieces of work that encompass multiple tasks  
  **Color**: #bfe5bf

- **Label name**: type: research  
  **Description**: Research tasks or exploratory work  
  **Color**: #d4c5f9

- **Label name**: type: user story  
  **Description**: Work that adds value to the user  
  **Color**: #6E7079

- **Label name**: web  
  **Description**: Tasks related to the web version of the project  
  **Color**: #e7e7e7

- **Label name**: wontfix  
  **Description**: This will not be worked on  
  **Color**: #ffffff


### GitHub Issue Summary
#### Issue #65
- **Title:** Epic: Finances Screen Implementation (Deprecated - Consolidated with #91) #65
- **Status:** Closed
- **Type:** Epic
- **Labels:** carried-over, mobile, deprecated
- **Description:** This epic was initially created to implement a multi-screen finances feature with overview and details tabs. Due to requirement changes in Sprint 3, this approach was deprecated in favor of a simplified design with a single finances screen and separate statistics view. All related work has been consolidated under Issue #91 (Finances) and #102 (Statistics).
- **Closing Comment:** Consolidated with #91 due to requirement changes. The original multi-screen approach was simplified to a single finances screen with statistics view.
#### Issue #82
- **Title:** Epic: Finances Overview Screen (Closed - Not Implemented) #82
- **Status:** Closed
- **Type:** Epic
- **Assignee:** mbuturuga
- **Labels:** carried-over, mobile, not-implemented
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Description:** This epic includes tasks related to implementing the budget overview section of the finances screen.
- **Closing Comment:** Closed due to requirement changes in Sprint 3. The overview screen has been removed from the design, and the finances screen now consists of a single details view with access to statistics.
- **Sub-issues:**
  1. **User Story:** Budget Summary Card #84 (Closed - No longer needed due to design changes)
  2. **User Story:** Expenses Chart Card #85 (Closed - Functionality moved to statistics screen)
#### Issue #84
- **Title:** User Story: Budget Summary Card (Deprecated) #84
- **Status:** Closed
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** deprecated, completed
- **Project:** Dobbi
- **Milestone:** Sprint 2 (closed)
- **Description:** As a user, I want to see a summary of my budget so that I can quickly see my remaining balance, total income, and total expenses.
- **Acceptance Criteria:**
  - Card displays remaining balance, total income, and total expenses.
  - Card includes up and down arrows to indicate changes in values relative to the previous month.
  - Card follows the Figma design.
- **Dependencies:** 
  - User Story: Reusable Card Component #83
- **Closing Comment:** Successfully completed in Sprint 2, but later deprecated in Sprint 3 due to requirement changes.
#### Issue #85
- **Title:** User Story: Expenses Chart Card (Closed - Not Implemented) #85
- **Status:** Closed
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** not-implemented
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Description:** As a user, I want to see a breakdown of my expenses by categories so that I can quickly see how I'm spending my money.
- **Acceptance Criteria:**
  - [x] Use a pie chart
  - [x] Chart displays expense breakdown by categories
  - [x] Chart includes legend with category names
  - [ ] Chart includes interactive elements (e.g., tooltips or labels) to show category names and percentages
  - [ ] Chart has entry animation when loaded
- **Closing Comment:** Closed without completion. Feature was cancelled due to requirement changes - functionality moved to statistics screen in Sprint 3.


#### Issue #91
- **Title:** Epic: Finances Screen Implementation #91
- **Status:** In Progress
- **Type:** Epic
- **Labels:** mobile, carried-over
- **Milestone:** Sprint 3
- **Description:** This epic includes tasks related to implementing the "Details" tab of the finances screen. 

    It includes:
    - List of incomes and expenses 
    - Way to switch between months
    - Access to statistics screen
- **Comment:** Refactored from being a "Details Screen" sub-issue to becoming the main Finances Screen epic, as the multi-screen approach was simplified. Statistics functionality was moved to a separate epic (#102) to maintain clear separation of concerns.
- **Sub-issues:**
  1. **User Story:** Implement List of Incomes and Expenses #92
  2. **User Story:** Connect Financial Details to Database #93
  3. **User Story:** CRUD Operations on Finance Details #94
  4. **User Story:** Month Selection Implementation #96
  5. **User Story:** Data Validation and Error Handling #95

#### Issue #93
- **Title:** User Story: Connect Financial Details to Database #93
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 6.5
- **Start date:** 2024-11-25
- **End date:** 2024-11-25
- **Description:** As a user, I want my financial details to be connected to the database so that I can see my real income and expenses data.
- **Requirements:**
  - User is logged in
  - User is on the finances screen
  - User is on the Details tab
  - User has financial data in the database
- **Acceptance Criteria:**
  - [x] Database is updated to store financial data, including defined categories
  - [x] Categories are fetched from the database
  - [x] Entries are fetched from the database
  - [x] Entries are displayed in the correct categories
  - [x] Appropriate amounts are displayed for each entry
  - [x] Only the categories with entries are displayed, not all categories
- **Dependencies:**
  - User Story: Implement List of Incomes and Expenses #92


#### Issue #94
- **Title:** Epic: CRUD Operations on Finance Entries #94
- **Status:** Closed (Done)
- **Type:** Epic
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 7
- **Start date:** 2024-11-25
- **End date:** 2024-12-02
- **Description:**

### Description
This epic encompasses all functionality related to managing financial entries, including creating new entries, updating entry details, and removing entries.

#### Issue #102
- **Title:** Epic: Statistics Screen Implementation #102
- **Status:** Open
- **Type:** Epic
- **Labels:** mobile
- **Milestone:** Sprint 3
- **Description:** Implementation of the statistics screen with financial analytics including:
  - Period-based financial analysis
  - Various chart visualizations
  - Data export functionality
- **Sub-issues:**

#### Issue #96
- **Title:** User Story: Create New Financial Entry
- **Status:** Closed
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 5
- **Start date:** 2024-11-25
- **End date:** 2024-11-27
- **Description:** 
### Description
As a user, 
I want to be able to create a new financial entry 
so that I can record my income and expenses.

### Requirements
- User is logged in
- User is on the finances screen

### Acceptance Criteria
- [x] Button to add new entry is visible
- [x] Clicking the button opens a modal with input fields for type, category, name, amount, and date
- [x] Modal includes a cancel button to close without saving
- [x] Modal includes a save button to add the new entry to the database
- [x] Form fields are validated before saving
- [x] Success message is displayed after saving
- [x] New entry is displayed in the list of financial details after adding it

### Dependencies
- #93


#### Issue #97
- **Title:** User Story: Edit Financial Entry
- **Status:** Closed
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 7
- **Start date:** 2024-11-27
- **End date:** 2024-12-02
- **Description:**
### Description
As a user,
I want to edit an existing financial entry
so that I can correct mistakes or update information.

### Requirements
- User is logged in
- User is on the finances screen
- User has at least one financial entry

### Acceptance Criteria
- [x] Desing edit form -> ended up using the same form as the create new financial entry
- [x] Way to access edit form from the list of financial entries -> intuitive to click on an entry and open the edit form with prefilled data
- [ ] Form fields are validated before saving
- [x] Success message is displayed after saving
- [x] Updated entry is displayed in the list of financial details after saving

### Dependencies
- #93
- #96

- **Closing Comment:** Took longer than expected due to multiple design changes until the final version. The edit form was simplified to match the create new financial entry form for consistency.

#### Issue #98
- **Title:** User Story: Delete Financial Entry
- **Status:** Closed
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 0.5
- **Start date:** 2024-12-02
- **End date:** 2024-12-02
- **Description:**
### Description
As a user,
I want to delete an existing financial entry
so that I can remove outdated or incorrect information.

### Requirements
- User is logged in
- User is on the finances screen
- User has at least one financial entry

### Acceptance Criteria
- [x] Way to delete an entry from the list of financial entries -> delete button inside edit form
- [x] Confirmation dialog before deleting
- [x] Success message is displayed after deleting
- [x] Deleted entry is removed from the list of financial details

### Dependencies
- #93
- #96
- #97


#### Issue #99
- **Title:** User Story: Financial Summary Card
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 4.5 (11-15:30)
- **Start date:** 2024-12-03
- **End date:** 2024-12-03
- **Description:**
### Description
As a user,
I want to see a summary of my financial status
so that I can quickly understand my income, expenses, and savings at a glance.

### Requirements
- User is logged in
- User is on the statistics 
- User has financial data in the database

### Acceptance Criteria
- [x] Display total income
- [x] Display total expenses
- [x] Display savings amount
- [x] Display savings rate
- [x] Include icons and color coding
- [x] Add financial health messages
- [x] Implement help modal with explanations

### Dependencies
- #93

#### Issue #100
- **Title:** User Story: Period Comparison Card
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 5.5 (15:30 - 19:00 + 00:00 - 2:00)
- **Start date:** 2024-12-03
- **End date:** 2024-12-04
- **Description:**
### Description
As a user,
I want to compare my spending between two periods
so that I can track changes in my financial behavior.

### Requirements
- User is logged in
- User is on the statistics screen
- Data exists for at least two periods

### Acceptance Criteria
- [x] Create bar chart for period comparison -> ended up being horizontal to fit more categories
- [x] Show category type on y-axis -> used icons to save space and make it more visually appealing
- [x] Display actual amounts next to bars
- [x] Add color coding for different periods
- [x] Include legend
- [x] Add explanation modal
- [] Implement animations
- [] Handle empty data states

### Dependencies
- #93

#### Issue #101
- **Title:** User Story: Category Distribution Charts
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** (11-16) 5 hours
- **Start date:** 2024-12-04
- **End date:** 2024-12-04
- **Description:**
### Description
As a user,
I want to see pie charts of my income and expense distributions
so that I can easily understand how my money is distributed across categories.

### Requirements
- User is logged in
- User is on the statistics screen
- Data exists for income and expenses

### Acceptance Criteria
- [x] Create generic pie chart component and use it for both income and expenses
- [x] Personalize chart pie styles with proper spacing, layout and dimensions
- [x] Show percentage labels
- [x] Include category icons in legend (to match the icons in #100)
- [x] Add animations for loading data
- [ ] Handle animations for transitions
- [ ] Handle empty categories

### Dependencies
- #93

#### Issue #102
- **Title:** User Story: Top Categories Card
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 3
- **Start date:** 2024-12-04
- **End date:** 2024-12-04
- **Description:**
### Description
As a user,
I want to see my top spending and income categories
so that I can quickly identify my main sources of income and expenses.

### Requirements
- User is logged in
- User is on the statistics screen
- User has income and expense data

### Acceptance Criteria
- [x] Create one generic card and use it for both income and expenses
- [x] Show category icons to match the rest of the cards
- [x] Display amount and percentage for each category
- [x] Sort categories by amount
- [x] Add loading animations
- [ ] Handle empty states
- [x] Each category should be clickable to show more details
- [ ] Show details -> not implemented yet, to think what to show

### Dependencies
- #93
- #101 (shares same fetched data)

#### Issue #103
- **Title:** User Story: Monthly Trend Chart Implementation
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 18:20 - 22:20 (4 hours)
- **Start date:** 2024-12-04
- **End date:** 2024-12-04
- **Description:**
### Description
As a user,
I want to see a line chart of my monthly income and expenses
so that I can track my financial trends over time.

### Requirements
- User is logged in
- User is on the statistics screen
- User has data for at least two months
- Period selected is more than one month

### Acceptance Criteria
- [x] Create base line chart component
- [x] Create dual-line chart for income and expenses
- [x] Use different colors for income and expenses lines
- [x] Add proper axis labels and formatting
- [x] Include legend
- [x] Add animation for loading data
- [ ] Handle just 1 month data
- [ ] Handle empty data

### Dependencies
- #93

- **Closing Comment:** Implemented with Victory Native charts for smooth performance. Added extra metrics calculation utility for deeper financial analysis.

#### Issue #104
- **Title:** User Story: Monthly Trend Analysis Modal
- **Status:** Open
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 4
- **Start date:** 2024-12-04
- **End date:** 2024-12-05
- **Description:**
### Description
As a user,
I want to see statistical metrics for my monthly trend chart
so that I can better understand my financial patterns and trends.

### Requirements
- User is logged in
- User is on the statistics screen
- User has accessed the monthly trend chart
- Selected period is more than one month

### Acceptance Criteria
- [ ] Create explanation modal
- [ ] Calculate and display key metrics:
  - Average monthly income/expenses
  - Standard deviation
  - Highest/lowest months
- [ ] Design modal layout for metrics display

### Dependencies
- #103

#### Issue #105
- **Title:** User Story: Stats Screen Base Layout
- **Status:** Open
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 3 (11:00 pm to 02:00 am)
- **Start date:** 2024-12-04
- **End date:** 2024-12-05

### Description
As a user,
I want to have a well-organized statistics screen
so that I can easily navigate between different financial analytics views.

### Requirements
- User is logged in
- User is on the statistics screen

### Acceptance Criteria
- [x] Tab navigation for different stats
- [x] Period selector at the top -> used filter chips (no functionality yet)
- [x] Export button for downloading stats data (no functionality yet)


#### Issue #106
- **Title:** Epic: Stats Charts
- **Status:** Closed
- **Type:** Epic
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Description:** This epic includes tasks related to implementing various chart visualizations for the statistics screen.

    It includes:
    - Monthly trend chart
    - Category distribution charts
    - Period comparison chart
    - Top categories chart
    - Financial summary card

- **Sub-issues:**
    1. **User Story:** Monthly Trend Chart Implementation #103
    2. **User Story:** Category Distribution Charts #101
    3. **User Story:** Period Comparison Chart #100
    4. **User Story:** Top Categories Card #102
    5. **User Story:** Financial Summary Card #99
    6. **User Story:** Monthly Trend Analysis Modal #104

-**Total Estimate:** 44.5 hours 

#### Issue #107
- **Title:** User Story: Stats Screen Period Selector
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 2
- **Start date:** 2024-12-05
- **End date:** 2024-12-05
- **Description:**
### Description
As a user,
I want to be able to filter my financial statistics by different time periods
so that I can analyze my data over specific timeframes.

### Requirements
- User is logged in
- User is on the statistics screen
- User has data for multiple periods

### Acceptance Criteria
- [x] Implement period selector with predefined options (e.g., month, quarter, year)
- [x] Highlight the selected period
- [x] Update statistics based on the selected period
- [ ] Include a custom period option for more flexibility
- [ ] Handle empty data states for custom periods
- [ ] Show somewhere the selected period in date format (e.g., "Jan 2024 - Mar 2024")

### Dependencies
- #106

#### Issue #108
-**Title:** Epic: Stats Export Functionality
-**Status:** Open
-**Type:** Epic
-**Labels:** mobile
-**Project:** Dobbi
-**Milestone:** Sprint 3
-**Description:** This epic includes tasks related to implementing data export functionality for the statistics screen.

    It includes:
    - Export button
    - Report generation in different formats
    - Download status notifications

-**Sub-issues:**
    1. **User Story:** Export Button #109
    2. **User Story:** Download Notification Message #110
    3. **User Story:** PDF Report Generation #111
    4. **User Story:** CSV Report Generation #112

#### Issue #109
- **Title:** User Story: Export Button
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 7
- **Start date:** 2024-12-05
- **End date:** 2024-12-05
- **Description:**
### Description
As a user,
I want to be able to export my financial statistics data
so that I can have it in a format that is easy to store or share.

### Requirements
- User is logged in
- User is on the statistics screen
- User has data to export

### Acceptance Criteria
- [x] Implement export button
- [x] Provide options for export format (e.g., CSV, PDF) with a dropdown menu
- [x] Functionality to download files to device 
    - [x] Android
    - [ ] iOS
    - [ ] Web

### Dependencies
- #106

Commentary: Currently finished and working on Android. iOS and Web versions are pending to check.


#### Issue #110
- **Title:** User Story: Download Notification Message
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 1.5
- **Start date:** 2024-12-05
- **End date:** 2024-12-05
- **Description:**
### Description
As a user,
I want to see a notification message when downloading my stats report
so that I know the status of the download.

### Requirements
- User is logged in
- User is on the statistics screen
- User has initiated a file download

### Acceptance Criteria
- [x] Show downloading status message
- [x] Show download complete message
- [x] Include file name in completion message
- [x] Add option to open file after download
- [x] Handle download errors gracefully

### Dependencies
- #109

#### Issue #111
- **Title:** User Story: PDF Report Generation
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 18-19 + 23:30 - 00:00 + 12:00 - 23:30 + 12:00 - 17:00 -> 18h
- **Start date:** 2024-12-06
- **End date:** 2024-12-08
- **Description:**
### Description
As a user,
I want to generate a PDF report of my financial statistics
so that I can have a well-formatted document for storing or sharing.

### Requirements
- User is logged in
- User is on the statistics screen
- User has data to export

### Acceptance Criteria
- [x] Create professional report layout
- [x] Include a visual header with logo and branding
- [x] Include all statistics data in sections:
  - Financial summary
  - Period comparison
  - Category analysis
  - Monthly trends
- [x] Add data in tables
- [x] Include explanatory text and insights
- [x] Handle page breaks and pdf formatting
- [x] Add footer

### Dependencies
- #109
- #106

#### Issue #112
- **Title:** User Story: CSV Report Generation
- **Status:** Open
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 
- **Start date:** 2024-12-05
- **End date:** 2024-12-05
- **Description:**
### Description
As a user,
I want to export my financial data in CSV format
so that I can access the data itself for further analysis or processing.

### Requirements
- User is logged in
- User is on the statistics screen
- User has data to export

### Acceptance Criteria
To be determined. 
- [ ] Design CSV format/layout

### Dependencies
- #109
- #106

#### Issue #113
- **Title:** User Story: Handle Data Issues and Empty States
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 4 (17:30 - 21:30)
- **Start date:** 2024-12-08
- **End date:** 2024-12-08
- **Description:**
### Description
As a user,
I want to be informed about any issues with my financial data
so that I can correct errors and be aware of missing or incomplete information.

### Requirements
- User is logged in
- User is on the statistics screen
- User has issues with some data (e.g., missing values, empty fields)

### Acceptance Criteria
- [x] Add validation for null and empty values to prevent crashes
- [x] Show error message for any issues with data
- [x] Allow user to dismiss error messages (snooze for a while)
- [x] Allow report button to report data issues to system administrators
- [x] Show entries causing the issues in a modal
- [x] Allow to solve the issues directly from the modal: deleting or editing the entry

### Dependencies
- #94

#### Issue #114
- **Title:** User Story: Enhanced Header Component
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 1 (22:50 - 23:50)
- **Start date:** 2024-12-08
- **End date:** 2024-12-08
- **Description:**
### Description
As a user,
I want to see clear screen titles and navigation options
so that I always know where I am in the app and can navigate easily.

Header will be leveraged for:
- Brand name
- Screen titles
- Back button for nested screens

This enhancement will improve the overall navigation experience. Mantaing branding and consistent styling, while gaining space for screen titles and back button instead of using the content screen.

### Requirements
- User is logged in to see the header

### Acceptance Criteria
- [x] Show Dobbi brand on initial load
- [x] Transition to screen name after timeout
- [x] Add back button for statistics screen
- [x] Hide bottom navbar on statistics screen
- [x] Maintain consistent header styling


#### Issue #115
- **Title:** User Story: Month Selection on Finances Screen
- **Status:** Closed (Done)
- **Type:** User Story
- **Assignee:** mbuturuga
- **Labels:** mobile, completed
- **Project:** Dobbi
- **Milestone:** Sprint 3
- **Estimate:** 3 (00:00 - 03:00)
- **Start date:** 2024-12-09
- **End date:** 2024-12-09
- **Description:**
### Description
As a user,
I want to easily select different months
so I can view my financial data for specific months.

### Requirements
- User is logged in
- User is on the finances screen
- User has data for multiple months

### Acceptance Criteria
- [x] Initial layout with month and year displayed and arrow buttons
- [x] Arrow buttons change to the next/previous month
- [x] Clicking on month opens a wheel picker
    - [x] Implement custom picker for months and years -> third-party options didn't work
    - [x] Add smooth animations for wheel picker
- [x] Handle date selection to show appropriate data
- [x] Update fiances list when no data is available for the selected month

### Dependencies
- #93

--------------------------------------------
#### Issue #71
- **Title:** Epic: AI Chatbot
- **Status:** Open
- **Type:** Epic
- **Labels:** mobile
- **Milestone:** Sprint 4
- **Description:** This epic includes features related to implementing a chatbot in the mobile app for user assistance and support. The chatbot will provide financial advice, answer user queries, and guide users through the app functionalities using AI-powered responses.

- **Sub-issues:**
    - **User Story:** Chat Interface Design #116
    - **User Story:** AI API Integration #117
    - **User Story:** Chat History #118
    


Remaining work:
- Enhanced prompt engineering with user context
- Response formatting improvements
- Error handling enhancements
- Advanced history features

#### Issue #116
- **Title:** User Story: Chat Interface Design
- **Status:** Closed
- **Type:** User Story
- **Labels:** mobile
- **Milestone:** Sprint 3
- **Description:**
### Description
As a user,
I want an intuitive chat interface
so that I can easily communicate with the AI financial advisor.

### Requirements
- User is logged in
- User is on the chat screen

### Acceptance Criteria
- [x] Text input field to send messages with a send button
- [x] Chat bubbles for messages
- [x] Sender and receiver images for chat bubbles

comment
need to input the start and end date and the time spent on the task

#### Issue #117
- **Title:** User Story: AI API Integration
- **Status:** Closed
- **Type:** User Story
- **Labels:** mobile, completed
- **Milestone:** Sprint 3
- **Description:**
### Description
As a developer,
I want to integrate the OpenAI API
so that the chatbot can provide intelligent responses to user queries.

### Requirements
- OpenAI API key
- Chatbot system in place

### Acceptance Criteria
- [x] Configure OpenAI client with API key
- [x] Implement system prompt for financial advisor personality
- [x] Set up message structure with system and user roles
- [x] Configure API parameters (temperature, max_tokens, etc.)
- [x] Handle API response parsing
- [x] Implement error handling for API calls
- [x] Restrict responses to financial topics only

### Dependencies
- #116


#### Issue #118
- **Title:** User Story: Chat History
- **Status:** Closed
- **Type:** User Story
- **Labels:** mobile
- **Milestone:** Sprint 3
- **Description:**
### Description
As a user, I want to start new chats and see older chats so that I can manage my conversations.

### Requirements
- User is logged in
- User is on the chat screen

### Acceptance Criteria
- [x] Button to access options for new chat or chat history
- [x] User can start a new chat
- [x] User can access previous chat history
- [x] A list of previous chats is displayed
- [x] Clicking on a chat opens that chat session

### Dependencies
- #117


#### Issue #120
- **Title:** User Story: User Context Integration
- **Status:** Open
- **Type:** User Story
- **Labels:** mobile
- **Milestone:** Sprint 4
- **Description:**
### Description
As a user,
I want the AI to understand my financial situation
so that it can provide personalized advice.

### Acceptance Criteria
- [ ] Integrate user's financial data:
  - Income and expense patterns
  - Savings rate
  - Category distribution
  - Historical trends
- [ ] Include user preferences and goals
- [ ] Create context refresh mechanism
- [ ] Handle privacy concerns and data security
- [ ] Implement context validation

#### Issue #121
- **Title:** User Story: Response Formatting
- **Status:** Open
- **Type:** User Story
- **Labels:** mobile
- **Milestone:** Sprint 4
- **Description:**
### Description
As a user,
I want well-formatted and clear AI responses
so that I can easily understand the financial advice.

### Acceptance Criteria
- [ ] Define response structure templates
- [ ] Implement formatting for:
  - Suggestions
  - Warnings
  - Lists
  - Numerical data
  - Links
- [ ] Add support for custom styling
- [ ] Include visual elements (icons, separators)
- [ ] Ensure consistent formatting across different types of advice

#### Issue #123
- **Title:** Epic: Enhanced Chatbot Intelligence
- **Status:** Open
- **Type:** Epic
- **Labels:** mobile
- **Milestone:** Sprint 4
- **Description:** Enhance the chatbot's ability to provide personalized financial advice by integrating user context, financial data, and system features.

Sub-epics:
1. **Context Integration** (#124)
   - Financial Data Integration
   - Goals Integration
   - Marketplace Integration
   - Onboarding Integration
2. **Response Enhancement** (#125)
   - Prompt Engineering
   - Response Formatting
   - Reference System

#### Issue #119
- **Title:** Epic: Chatbot Context Integration
- **Status:** Open
- **Type:** Epic
- **Labels:** mobile
- **Description:** Implement various context sources to enable personalized advice. 

#### Issue #120
- **Title:** Epic: Chatbot Response Enhancement
- **Status:** Open
- **Type:** Epic
- **Labels:** mobile
- **Description:** Improve the quality and format of chatbot responses.

This includes:
- Prompt engineering (tone, personality, limitations, etc.)
- Response formatting (structured data, readability)

--------------------------------------------
# Working on chatbot
tasks will later be organized into issues

1. Improve Base System Prompt 
   - Define AI personality more clearly done
   - Set response structure guidelines done 
   - Add formatting requirements -
   - Establish conversation flow rules

2. Financial Data Integration 
   - Connect to existing finances data
   - Create data transformation for context
   - Add financial context to prompts

3. Response Formatting 
   - Implement structured message types
   - Add support for lists, warnings, suggestions
   - Create reusable formatting templates

4. Reference System
   - Create linking system to app features
   - Add ability to reference user's data
   - Implement contextual suggestions