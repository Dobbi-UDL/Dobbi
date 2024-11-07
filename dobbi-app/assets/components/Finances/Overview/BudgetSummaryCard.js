import React from 'react';
import { Text } from 'react-native';
import Card from '../../common/Card';

const mockData = {
    totalIncome: 2000,
    totalExpenses: 1000,
    remainingBalance: 1000,
};
const BudgetSummaryCard = () => {
    return (
        <Card title="Summary">
            <Text>Remaining balance: ${mockData.remainingBalance}</Text>
            <Text>Total Income: ${mockData.totalIncome}</Text>	
            <Text>Total Expenses: ${mockData.totalExpenses}</Text>
        </Card>
    );
};


export default BudgetSummaryCard;