# Dobbi Financial Statistics

## Overview
Dobbi has a financial statistics feature that provides users with a comprehensive analysis of their finances. 

## Components
The statistics are divided into several components, each focusing on different aspects of the user's financial data. These components include:

1. **Financial Summary**: Displays key financial metrics:
    - Total income
    - Total expenses
    - Net savings
    - Savings rate
    And an encouraging message based on the savings rate. The savings rate is calculated as the percentage of income saved after expenses, and is sorted into 4 categories:
    - Excellent (>= 20%)
    - Good (10% - 20%)
    - Fair (> 0% - 10%)
    - Needs Attention (0%)

2. **Monthly Income vs Expenses Trend**: Shows the trend of monthly income and expenses over time into a line chart. This helps users visualize their financial performance over time.
    The chart displays the total income and expenses for each month in the selected period.
    Chart is only displayed if the period data spans more than one month.
    There's a button to check the detailed metrics of the financial data over the selected period. The detailed metrics include:
    - Total amount
    - Monthly average
    - Median
    - Standard deviation
    - Range
    - Minimum
    - Maximum
    All these metrics are calculated for income, expenses, and savings.

3. **Expense Comparison**: Compares the user's expenses between the current period and the previous period. 
    The comparison is displayed in a bar chart, with each bar representing a category of expenses.
    The chart shows the expenses for the current period and the previous period side by side.
    It also displays at the top a quick summary showing the total amount spent in the current and previous periods. How it went from one period to the other. Also displays if overall the spending increased or decreased, and by how much (amount and percentage).

4. **Category Distribution**: Shows the distribution of financial data across different categories into a pie chart.
    The pie chart displays the percentage of total expenses or income that each category represents.
    The chart helps users understand how their money is distributed across different categories in a visual and easy-to-understand way.

5. **Top Categories**: Displays the top financial categories for either income or expenses.
    The top categories are shown in a bar chart, with each bar representing a category.
    The chart displays the total amount spent or earned for each category and the percentage it represents of the total income or expenses. The bars are color-coded based on the type of category (income or expense). And also ordered from highest to lowest amount to show at a glance the most significant categories.



## Period Selector
The period selector allows users to choose a time period for viewing their financial data. It provides a list of predefined periods such as "This Month," "Last Month," "Last 3 Months," "Last 6 Months," "Year to Date," and "Last Year." Additionally, users can select a custom range to view specific time periods.
Users can select a period by tapping on it, which updates the displayed financial data accordingly. 

## Format of the Financial Data
The financial data is obtained from the database (Supabase) and is structured in JSON format. 

There are 5 types of data that are used to populate the financial statistics components:

- **Summary**: For the financial summary component. The data fetched is an object containing the following fields:

    ```json
    {
        "savings": 345,
        "savingsRate": "23.00",
        "totalExpenses": 1155,
        "totalIncome": 1500
    }
    ```
- **Period Comparison**: For the expense comparison component. The data fetched is an array of objects, each representing a category of expenses. Each object contains the following fields:

    ```json
    [
        {"category_icon": "book-outline", "category_name": "Education", "current_period_expense": 498, "previous_period_expense": 0}
    ]
    ```
- **Expense Categories**: For the top categories component and the expense distribution component. The data fetched is an array of objects, each representing a category of expenses. Each object contains the following fields:

    ```json
    [
        {"category_icon": "book-outline", "category_name": "Education", "category_type": "expense", "percentage": 43.12, "total_amount": 498}
    ]
    ```

- **Income Categories**: For the top categories component and the income distribution component. The data fetched is an array of objects, each representing a category of income. Each object contains the following fields:

    ```json
    [
        {"category_icon": "cash-outline", "category_name": "Salary", "category_type": "income", "percentage": 100, "total_amount": 1500}
    ]
    ```

- **Monthly Trend**: For the monthly income vs expenses trend component. The data fetched is an array of objects, each representing the financial data for a specific month. Each object contains the following fields:

    ```json
    [
        {"month_year": "2024-12", "total_expenses": 1155, "total_income": 1500}
    ]
    ```

### Period Comparison Logic
This chart compares expenses between your current selected period and the previous period.

#### How Previous Period is Determined
- Always matches the length of your current period
- Ends right before your current period starts
- For partial periods (like current month), compares only matching days

#### Examples
- **This Month** (Dec 1-5, 2024)
    - Previous: Nov 1-5, 2024
- **Last 3 Months** (Sep-Nov 2024)
    - Previous: Jun-Aug 2024
- **Year to Date** (Jan 1-Dec 5, 2024)
    - Previous: Jan 1-Dec 5, 2023
- **Custom Range** (Jan 15-Mar 15, 2024)
    - Previous: Nov 15, 2023-Jan 14, 2024


## Report Outline
To create a detailed, professional, multi-page financial statistics report in PDF format for the "Dobbi" app, the following plan can be used based on the data and structure from the files provided:

1. **Cover Page**
    - **Title:** "Financial Statistics Report"
    - **Subtitle:** "Your Financial Journey from [Start Date] to [End Date]"
    - **Dobbi logo and accent color (#EE6567)**
    - **Date of generation**

2. **Table of Contents**

3. **Executive Summary**
    - Highlight key financial insights, at-a-glance, a takeaway/highlight from each section, for faster analysis instead of reading the full report.
    What quick summary can be provided as a snapshot of each section?

    - Financial Summary: quick savings rate review
    - Period Comparison: overall spending increase/decrease
    - Category Analysis: top expense category and top income category
    - Monthly Trends: monthly average income, expenses, and savings
    



4. **Financial Summary**
    - **Overview table:**
      - Total income, expenses, savings, and savings rate
    - **Savings Rate Analysis:**
      - Categorization into Excellent, Good, Fair, Needs Attention
      - Encouraging message based on savings rate
      - Commentary on savings rate performance

5. **Monthly Trends**
    - **Line graph displaying income, expenses trends**
    - **Monthly breakdown table:**
      - Month, income, expenses, net savings, savings rate
    - **Metrics:**
      - Total, monthly average, median, standard deviation, range, min, max

6. **Expense Analysis**
    - **Pie chart for expense category distribution**
    - **Table of categories:**
      - Name, total amount, and percentage of expenses
    - **Top Expense Categories:**
        - Analysis of top expense categories and insights
    
7. **Income Analysis**
    - **Pie chart for income category distribution**
    - **Table of categories:**
      - Name, total amount, and percentage of income
    - **Top Income Categories:**
        - Analysis of top income categories and insights
        
8. **Period Comparison**
    - **Side-by-side bar chart comparing current and previous periods**
    - **Table:**
      - Category, current period, previous period, and percentage change
    - **Highligh/Insight**

9. **Footer**
    - **Contact Information**
    - **Disclaimer**

## Technical Implementation
### HTML Content Updates
- Extend the template to include:
  - Graphs using libraries like Chart.js or D3.js for visualizations
  - A consistent header/footer on all pages with Dobbi branding

### Styling
- Update CSS:
  - Use a clean and modern layout
  - Highlight critical data with #EE6567
  - Include sufficient whitespace for readability

### Export
- Generate the PDF in a page-oriented format optimized for readability (not a simple web-to-PDF print)