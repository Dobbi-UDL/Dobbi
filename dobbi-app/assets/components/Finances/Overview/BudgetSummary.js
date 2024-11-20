import React from 'react';
import { View } from 'react-native';
import Card from '../../common/Card';
import BudgetValue from './BudgetValue';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './BudgetSummary.styles';
import i18n from '@i18n';

const BudgetSummary = () => {
    const balance = 2500;
    const income = 5000;
    const expenses = 2500;

    return (
        <Card cardStyle={styles.card}>
            <BudgetValue
                amount={balance}
                label={i18n.t('remainingBalance')}
                valueStyle={styles.balance}
            />
            <View style={styles.row}>
                <BudgetValue
                    amount={income}
                    label={i18n.t('totalIncome')}
                    valueStyle={styles.income}
                    icon={
                        <MaterialCommunityIcons
                            name="arrow-up-box"
                            size={styles.icon.size}
                            color={styles.income.color}
                        />
                    }
                />
                <BudgetValue
                    amount={expenses}
                    label={i18n.t('totalExpenses')}
                    valueStyle={styles.expenses}
                    icon={
                        <MaterialCommunityIcons
                            name="arrow-down-box"
                            size={styles.icon.size}
                            color={styles.expenses.color}
                        />
                    }
                />
            </View>
        </Card>
    );
};

export default BudgetSummary;