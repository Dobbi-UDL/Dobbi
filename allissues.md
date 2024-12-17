## Sprint Estimation
For the previously mentioned features, we have tracked the time needed to complete each one. The following table shows the estimated time for each feature.

| Epic                    | Estimated Time (hours) |
|-------------------------|------------------------|
| Homepage Screen         | 6                     |
| Finances Screen         | 26                     |
| Statistics Screen       | 54                     |
| Saving Goals            | 18                     |
| Marketplace             | 16                     |
| Chatbot                 | 15 +  9                    |
| Onboarding              | 3                      |
| Language Localization   | 1                     |
| Points System           | 4                     |
| Admin Management        | 6                     |
| Offers and Challenges Redesign | 1              |
| Performance Tracking    | 0                    |

----
## Main Use Cases

This section outlines the primary use cases of the Dobbi application, highlighting how users will interact with the system to achieve their financial goals.

### Mobile App
The mobile application is designed for individual users seeking to manage their personal finances and achieve saving goals. The main use cases for the mobile app are:
- **User Registration and Login:** New users can register on the platform by providing necessary details and subsequently log in using their credentials. This grants them access to the app's features.
- **Expense Tracking:** Users can manually input their income and expenses, categorizing them for detailed analysis. Including the ability to see comprehensive statistics and generate reports.
- **Saving Goals Management:** Users can set personal saving goals, specifying target amounts, deadlines, and optional descriptions. They can also join sponsored challenges offered by companies. The app tracks progress toward these goals and visually represents the user's advancement.
- **Marketplace Interaction:** Users can browse available offers in the Marketplace and redeem them using points earned by completing saving goals and challenges.
- **Chatbot Assistance:** Users can interact with an AI-powered chatbot to ask questions related to their finances and receive personalized advice based on their financial data and goals. The chatbot can also reference relevant marketplace offers during conversations.

### Web Platform
The web platform caters to companies who wish to leverage the Dobbi platform to engage with users and promote their products or services. The primary use cases for the web platform are:
- **Company Registration:** Companies can register on the platform, providing details about their business.
- **Admin User Management:** Designated administrators within a company can create and manage additional admin users.
- **Offer and Challenge Creation:** Companies can create sponsored offers and challenges that will be displayed in the mobile app's Marketplace and Saving Goals sections.
- **Performance Monitoring:** Companies can track the performance of their offers and challenges, gaining insights into user engagement, views, clicks, and redemption rates. This data helps companies tailor their offerings and maximize their reach.
- **Admin Dashboard:** Platform administrators have access to a dedicated dashboard allowing them to oversee registered companies and manage their verification status. They can also edit company details, delete companies, and manage offers and challenges across the entire platform.

---
## Main Screens Design

This section details the design of the main screens for both the mobile application and the web platform, highlighting their relationships, key decisions made during the design process, improvements to existing screens, and indicators of evolution between sprints.

### Mobile Application

#### Homepage Screen
- **Purpose:** Provides an overview of the user's current financial status and highlights important actions.
- **Key Components:**
  - Welcome message with personalized greeting
  - Net Cash Flow component (visually engaging)
  - Quick Actions section
  - Active saving challenges (close to ending)
- **Design Decisions:**
    - The Net Cash Flow component was redesigned to be more visually appealing and provide a clearer representation of the user's financial standing.
    - The team decided to display only active challenges nearing completion, rather than showing all challenges, to enhance focus and encourage user engagement, as well as to show only relevant information on the screen.

#### Finances Screen
- **Purpose:** Allows users to track income and expenses and manage their budget.
- **Key Components:**
  - List of income and expense entries
  - Month Selector
  - Data issues button and banner notification system
  - Statistics button
- **Design Decisions:**
    - The screen was redesigned from a two-tab structure (Overview and Details) to a single tab with a list of entries, streamlining the user experience and making it more intuitive.
    - A banner notification system was implemented to inform users about potential data issues and provide options for resolution.
    - The statistics button was added to provide users with a detailed analysis of their financial data.

#### Saving Goals Screen
- **Purpose:** Enables users to set and track personal saving goals and participate in sponsored challenges.
- **Key Components:**
  - Two tabs (Personal Goals and Sponsored Challenges)
  - Goal cards with progress bar, current amount saved, and total amount needed
- **Design Decisions:**
    - The layout and components were redesigned for visual appeal and user-friendliness.
    - Two tabs were introduced to differentiate between personal goals and sponsored challenges.
    - The progress bar was added to visualize goal achievement.

#### Marketplace Screen
- **Purpose:** Showcases available offers that users can redeem using earned points.
- **Key Components:**
  - Search bar and filters
  - Offer categories
  - Offer list with key details (title, description, points needed, redeem button)
  - Display of user's available points
- **Design Decisions:**
    - Offer details are shown directly on the list with a "show more" button for long descriptions, simplifying the user experience.
    - The screen prominently displays the user's available points for easy reference.
    - The search bar and filters were added to facilitate easy navigation through the offers.

#### Chatbot Screen
- **Purpose:** Provides users with an interactive interface to ask financial-related questions and receive AI-powered responses.
- **Key Components:**
  - Generic welcome message
  - Chat bubbles with avatar for chatbot
  - Typing indicator
  - Floating menu to create or delete chat sessions, and see chat history
- **Design Decisions:**
    - The chatbot interface includes typing indicators, markdown formatting for messages for enhanced user experience.
    - Styling and color consistency with the project design.
    - AI responses are split into natural chunks with typing delays for a more engaging and human-like interaction.
    - The floating menu was added to provide users with additional options and enhance the chatbot experience.


**Relations Between Screens**
The screens in the mobile application are interconnected to provide a cohesive user experience:
- The Homepage Screen acts as the central hub, offering quick access to other key screens such as Finances, Saving Goals, and Marketplace.
- The Finances Screen links to the Statistics Screen, allowing users to view detailed financial data and generate reports.
- The Marketplace is accessible from the Homepage and also linked to the Chatbot, enabling users to view offers referenced during conversations.

### Web Platform

#### Admin Dashboard
- **Purpose:** Provides platform administrators with tools to manage companies.
- **Key Components:**
  - List of registered companies with their verification status

#### Offer and Challenge Pages
- **Purpose:** Allows companies to create, edit, and manage their offers and challenges.
- **Key Components:**
  - Offer/Challenge creation forms
  - Offer/Challenge listing with details and management options

#### Relations Between Screens
- The Admin Dashboard provides access to Company Management features and allows for the creation and management of Offers and Challenges.


---
## Github Issues and Sprint Progress
This section of the Sprint 3 report delves into the team's use of Github issues for project management, offering a detailed overview of issue creation, closure rates, and the overall sprint progression compared to Sprint 2.

### Issue Management & Sprint 3 Progress
The team actively utilized Github issues to track individual tasks, bugs, research items, and overarching objectives throughout Sprint 3. A well-defined issue structure, leveraging different templates, facilitated streamlined task management.

- A total of 61 issues were tracked during Sprint 3, including Epics, User Stories, Bugs, and Integration tasks.

- By the sprint's end, 43 issues were successfully closed, representing a 70.5% overall completion rate. Excluding Epic issues, the real progress stands at 82.5%, with 33 out of 40 issues closed.

- The team focused primarily on User Stories and Epics during this sprint, with 38 User Stories and 21 Epics in total.

This organized approach via Github issues significantly contributed to maintaining a transparent workflow and ensuring accountability among team members.

### Comparison with Sprint 2
Comparing Sprint 3 with Sprint 2 reveals a notable increase in both the number of issues handled and the completion rate:

Sprint 2 involved only 10 issues, while Sprint 3 saw a substantial increase to 61, highlighting the expanding scope and complexity of the project. This is because last sprint was not very well organized, and ended up not tracking all the issues accurately. That makes it hard to compare the two sprints.

Nonetheless, it's obvious there has been a significant improvement in this area, leveraging the lessons learned from the previous sprint and implementing better practices.


Github Issues and Sprint Progress
This section of the Sprint 3 report delves into the team's use of Github issues for project management, offering a detailed overview of issue creation, closure rates, and the overall sprint progression compared to Sprint 2.
Issue Management & Sprint 3 Progress
The team actively utilized Github issues to track individual tasks, bugs, research items, and overarching objectives throughout Sprint 3. A well-defined issue structure, leveraging different templates for clarity (as explained in), facilitated streamlined task management.
●
A total of 61 issues were tracked during Sprint 3. This includes a range of issue types, encompassing Epics, User Stories, Bugs, and Integration tasks.
●
By the sprint's end, 43 issues were successfully closed, representing a 70.5% overall completion rate.
○
However, excluding Epic issues, which typically represent larger, ongoing objectives, the real progress stands at 82.5%, with 33 out of 40 issues closed.
●
The team focused primarily on User Stories and Epics during this sprint, with 38 User Stories and 21 Epics in total.
This organized approach via Github issues significantly contributed to maintaining a transparent workflow and ensuring accountability among team members.
Comparison with Sprint 2
Comparing Sprint 3 with Sprint 2 reveals a notable increase in both the number of issues handled and the completion rate:
●
Sprint 2 involved only 10 issues, while Sprint 3 saw a substantial increase to 61. This difference highlights the expanding scope and complexity of the project as it progressed.
●
Sprint 2 concluded with 9 issues marked as "Done," whereas Sprint 3 saw a considerable jump to 38 completed issues. This underscores the team's enhanced productivity and efficiency in task execution during Sprint 3.
Key Takeaways
●
The systematic use of Github issues, coupled with clearly defined templates, proved instrumental in managing a larger and more complex workload during Sprint 3.
●
The substantial increase in both the number of issues addressed and the completion rate compared to Sprint 2 demonstrates the team's growing proficiency in agile project management and task execution.
●
The high completion rate of 82.5% (excluding Epics) for Sprint 3 points to a successful sprint focused on delivering core features.
The effective utilization of Github issues played a pivotal role in achieving a successful Sprint 3, allowing the team to effectively track progress, maintain transparency, and ultimately deliver a functional product by the sprint's end.