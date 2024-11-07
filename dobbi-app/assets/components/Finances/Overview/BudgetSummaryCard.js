import React from 'react';
import { Text } from 'react-native';
import Card from '../../common/Card';

const BudgetSummaryCard = () => {
    return (
        <Card title="Budget Summary"
            cardStyle={{ width: 300 }}
            titleStyle={{ fontSize: 18 }}>
            <Text>Card content</Text>
        </Card>
    );
};


export default BudgetSummaryCard;