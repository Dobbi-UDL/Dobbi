The Stats component in Stats.js is designed to display various financial statistics for the authenticated user. It fetches and displays data such as financial summaries, period comparisons, category distributions, top categories, and monthly income and expenses trends. The component uses several child components (SummaryCard, PeriodComparisonCard, CategoryDistributionCard, TopCategoriesCard, and MonthlyTrendCard) to present this data. It also manages loading states and supports pull-to-refresh functionality to update the displayed data.

The SummaryCard component in SummaryCard.js is designed to display a financial summary. It shows key financial metrics such as total income, total expenses, savings, and savings rate. Each metric is represented with a label, amount, and an icon. The component also includes a modal (SavingsRateModal) to provide additional explanations about the financial summary. The state variables manage the visibility of the explanation modal and the financial health message, which updates whenever the data prop changes.

The PeriodComparisonCard component in PeriodComparisonCard.js is designed to compare financial data across different periods. It uses the VictoryChart library to render bar charts that visually represent the data. The component includes a modal (ComparisonExplanationModal) to provide additional explanations about the comparisons. It also manages the visibility of this modal using state variables. The data is sorted in reverse order to align with the chart's display.

The TopCategoriesCard component in TopCategoriesCard.js is designed to display the top financial categories, either for income or expenses. It uses animations to create a staggered effect when displaying the data. The component determines the bar color based on the type of category (income or expense). It also handles user interactions by allowing users to select a category, which then triggers a modal to provide more details about the selected category.

The CategoryDistributionCard component in CategoryDistributionCard.js is designed to display the distribution of financial data across different categories. It uses a pie chart to visually represent the data. 

The MonthlyTrendCard component in MonthlyTrendCard.js is designed to display the monthly trends of financial data using a line chart. It uses the VictoryChart library to render the trend lines. The component checks if there is sufficient data to create the trend chart and manages the visibility of a modal for additional details. It also includes basic layout and styling using React Native components.

In total 7 cards are displayed:
1. Financial Summary (SummaryCard)
2. Expense Comparison (PeriodComparisonCard)
3. Top Expense Categories (TopCategoriesCard)
4. Top Income Categories (TopCategoriesCard)
5. Expense Categories (CategoryDistributionCard)
6. Income Categories (CategoryDistributionCard)
7. Monthly Income vs Expenses Trend (MonthlyTrendCard)

The PeriodSelector component in PeriodSelector.js allows users to select a time period for viewing financial data. It provides a horizontal scrollable list of period options such as "This Month", "Last Month", "Last 6 Months", and "Last Year". Users can tap on a period to select it, which triggers the onSelectPeriod callback with the selected period's ID. The component also includes an "Export" button for downloading data. The selected period is visually highlighted to indicate the current selection. The component uses React Native's TouchableOpacity for interactive elements and ScrollView for horizontal scrolling.

Typically useful periods for a period selector filtering chips in a financial application include:

This Month Last Month Last 3 Months Last 6 Months Year to Date Last Year Custom Range

If date is 2024-12-05, the following periods would be displayed:
- This Month: Shows data for the current month up to the current date. (Dec 1 - Dec 5)
- Last Month: Shows data for the previous month. (Nov 1 - Nov 30)
- Last 3 Months: Shows data for the last 3 months. Not including the current month. (Sep 1 - Nov 30)
- Last 6 Months: Shows data for the last 6 months. Not including the current month. (Jun 1 - Nov 30)
- Year to Date: Shows data from the beginning of the year to the current date. (Jan 1 - Dec 5)
- Last Year: Shows data for the previous year. (Jan 1, 2023 - Dec 31, 2023)

#### Stats Data:
- **Summary**:
    ```json
    {
        "savings": 345,
        "savingsRate": "23.00",
        "totalExpenses": 1155,
        "totalIncome": 1500
    }
    ```
- **Period Comparison**:
    ```json
    [
        {"category_icon": "book-outline", "category_name": "Education", "current_period_expense": 498, "previous_period_expense": 0},
        {"category_icon": "fitness-outline", "category_name": "Fitness", "current_period_expense": 50, "previous_period_expense": 0},
        {"category_icon": "cart-outline", "category_name": "Groceries", "current_period_expense": 105, "previous_period_expense": 0},
        {"category_icon": "laptop-outline", "category_name": "Technology", "current_period_expense": 400, "previous_period_expense": 0},
        {"category_icon": "car-outline", "category_name": "Transportation", "current_period_expense": 102, "previous_period_expense": 50}
    ]
    ```
- **Expense Categories**:
    ```json
    [
        {"category_icon": "book-outline", "category_name": "Education", "category_type": "expense", "percentage": 43.12, "total_amount": 498},
        {"category_icon": "laptop-outline", "category_name": "Technology", "category_type": "expense", "percentage": 34.63, "total_amount": 400},
        {"category_icon": "cart-outline", "category_name": "Groceries", "category_type": "expense", "percentage": 9.09, "total_amount": 105},
        {"category_icon": "car-outline", "category_name": "Transportation", "category_type": "expense", "percentage": 8.83, "total_amount": 102},
        {"category_icon": "fitness-outline", "category_name": "Fitness", "category_type": "expense", "percentage": 4.33, "total_amount": 50}
    ]
    ```
- **Income Categories**:
    ```json
    [
        {"category_icon": "cash-outline", "category_name": "Salary", "category_type": "income", "percentage": 100, "total_amount": 1500}
    ]
    ```
- **Monthly Trend**:
    ```json
    [
        {"month_year": "2024-12", "total_expenses": 1155, "total_income": 1500},
        {"month_year": "2024-11", "total_expenses": 1050, "total_income": 2000}
    ]
    ```
### Metrics
The MetricsModal component in MetricsModal.js displays detailed financial metrics for the user. The metrics shown include:

Total: The sum of all values.
Monthly Avg: The average value per month.
Median: The middle value in the sorted list of values.
Std Dev: The standard deviation, which measures the amount of variation or dispersion of the values.
Range: The difference between the maximum and minimum values.
Minimum: The smallest value.
Maximum: The largest value.
These metrics are displayed for three categories:

Income
Expenses
Savings
The purpose of displaying these metrics is to provide the user with a comprehensive overview of their financial data, helping them understand their financial patterns and make informed decisions.

### Period Comparison Explanation
This chart compares your expenses over two different time periods: your current period and the previous period.

Your current period is the one you selected, while the previous period is the one immediately before it.

#### Rules for Choosing the Previous Period
- **Same Length as the Current Period**: Ensure the previous period has the same duration as the current period.
- **Alignment**: Align the end of the previous period to directly precede the start of the current period.
- **Partial-to-Partial for Current Month**: For "This Month," compare only the same span of the previous month (e.g., December 1–5 vs. November 1–5).

#### Examples for Common Selections
- **Current Period**: This Month (December 1–5, 2024)
    - **Previous Period**: Same days last month (November 1–5, 2024).
- **Current Period**: Last 3 Months (September 2024 to November 2024)
    - **Previous Period**: 3 Months Before That (June 2024 to August 2024).
- **Current Period**: Year to Date (January 1, 2024, to December 5, 2024)
    - **Previous Period**: Same span in the previous year (January 1, 2023, to December 5, 2023).
- **Current Period**: Custom Range (e.g., January 15, 2024, to March 15, 2024)
    - **Previous Period**: Matching range directly before (November 15, 2023, to January 14, 2024).

#### Partial-to-Partial for Incomplete Periods
- **"This Month" Example**:
    - **Current Period**: December 1–5, 2024 (incomplete)
    - **Previous Period**: November 1–5, 2024

#### Edge Cases
- **Custom Periods with Partial Months**: Calculate the exact start and end dates for the previous period based on the current period's length and alignment.
    - **Example**: January 15–March 15, 2024 → Previous Period: November 15, 2023–January 14, 2024.
- **"Year to Date"**: Compare to the equivalent range in the previous year for like-for-like analysis. Full-year comparisons should only be used for annual summaries, not for year-to-date.
- **Leap Years**: If the previous period includes February 29 in a leap year, ensure consistent day alignment by extending or truncating appropriately.

#### Summary
- For predefined periods (e.g., "Last 3 Months"), use complete calendar ranges.
- For custom ranges and "This Month," focus on matching the exact duration for meaningful comparisons.
- Align periods for accurate insights while avoiding skewed comparisons (e.g., partial-to-full month mismatches).
