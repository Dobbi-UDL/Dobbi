
## 📅 Meeting Information

- **Date:** 11/12/2024
- **Time:** 19:00
- **Location:** In-person, in classroom during class time
- **Scrum Master:** Mihaela Buturuga
- **Attendees:**
    - Hao Yang
    - Eric López
    - Ahmet Patkovic left early and couldn't attend the meeting.

## 📝 Completed Work

### Hao Yang
- **Chatbot:**
    - Implemented create new chat session functionality
    - Worked on chat history: 
        - Floating menu with add and history buttons.
        - Display chat history and access old chats.
        - Make chats persistent using async storage -> saved in local storage.

- **Level System:**
    - Designed basic level system -> 100 points x number of level to reach next level (to be revised).
    - Updated schema database to include user points and level.
        - Add 'current_level' and 'current_xp' columns to the users table.
        - Created 'xp_transactions' table to store user points transactions (earnings and deductions). No functionality yet.
        - Planned for a table for achievents/badges/milestones that will give points.

    - Display user's level and points on setting modal.

    4 dec around 4h for level system

- **Onboarding:**
    - Decided on onboarding questions and flow between team members.
    - Created first interface for onboarding questions.

### Eric López
- **Saving Goals:**
    - Redesign of the goals page to match project styles
    - Updated database schema and created table to track goal progress. Currently working.
    - User can create new personal goals.
    - User can join sponsored goals.
    - Redesign goal card to show new requirements:
        - Tracking bar for progress
        - Current amount saved
        - Total amount needed
     
    11h 4-11 dec for all the above


### Mihaela Buturuga

- **Statistics Screen:**
    - Created statistics screen layout:
        - Filter chips to select period for statistics with predefined options. Custom option to select custom period needs to be implemented.
        - Tab view to switch between different statistics
    - Statistics cards:
        - Summary card with total income, total expenses, and savings
        - Same period comparison card to compare expenses of current period with previous period
        - Category distribution card to show expenses and income by category in a pie chart
        - Top categories card to show top categories for expenses and income in a list
        - Monthly trend card to show income and expenses trend over time with a line chart
        - Modals with exaplanations for some of the charts
    - Export statistics report funcionality:
        - Export button with format options (pdf, csv, etc.)
        - Export to pdf functionality implemented
        - Export to csv functionality needs to be redesigned to structure the data in a meaningful way
        - Notifications to show download progress and success/failure

- **Finances Screen:**
    - Reformatted layout from 2 tabs (details and overview) to a single tab with list of entries (old details tab)
    - Added funcionality to handle data issues (null, empty, etc. in the database -> could be important issues, user needs to know)
        - Notify user if there are data issues with banner
        - Show list of issues
        - Allow edit/delete of entries with issues to solve them
        - Dismiss notification banner for a period of time (snooze functionality)
            - Show successful message and time until next notification in banner after snooze
        - Option to report issues. Not implemented yet. Will be connected with admin pannel on web.
    - Month selection for entries list

- **Chatbot:**
    - Improved chatbot interface
        - Only chatbot avatar, no user avatar
        - Typing indicator
        - Markdown formatting for chat messages
        - Color and style changes to match project design
    - Natural typing delays for chatbot messages
    - Split AI response into natural chunks for better user experience
    - Added delete current chat functionality
    - Added select message functionality with banner to:
        - Copy message -> implemented copy to clipboard
        - Share -> not implemented yet
        - Delete/Report -> not implemented yet
    - Prompt engineering for AI API:
        - 4 types of personality depending on user type (student, family-oriented, starting professional, experienced professional)
    - Integrate financial data into chatbot prompt.

### Ahmet Patkovic
- **Onboarding**
    - Created document with onboarding questions organized into sections.


## ⚠️ Challenges 
### Hao Yang
- **Chat History:**
    - **Problem:** Working with async storage in React Native to achieve persistent chats. Not familiar with the library. Couldn't get it to work. Same chats are displayed on all users.
    - **Proposed Solution:** Maybe testing on the same device is causing the issue. Try on different devices to see if chats are persistent. Still need to restrict chats to the user who created them, even if stored locally.

### Eric López
- **Saving Goals:**
    - **Problem:** Query to fetch non assigned goals not working.
    - **Solution:** Solved. Again a format issue, was expecting a different format (ex: varchar instead of text, etc.) from Supabase. Fixed the way working with data.

## 🗓️ Work for This Week

### Hao Yang
- Finish basic onboarding questions and flow.
- Not planned to work on the level system this week. There's no more time to implement it.

### Eric López
- Finish saving goals screen
- Finish homepage

### Mihaela Buturuga
- Work on integrating marketplace offers to chatbot for referencing during conversations.
- Documentation.

### Ahmet Patkovic
- Work on cost management
- Start presentation for the sprint presentation


## 🐞 Current Issues
- iOS pdf not generating margins correctly.
- picker for financial entries to choose category not working on iOS. on Android it works fine.
- chat history saved in local storage shows the same chats for all users.
- can't generate pdf for empty data month -> need to add some exception handling.
- logout button not working -> app crashes
- login token expires and user is null -> app doesn't crash but doesn't work properly. should instead redirect to login screen if token is expired. it doesn't redirect, and allows null user to access user-only screens.
