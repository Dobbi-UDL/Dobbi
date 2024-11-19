import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Card.styles';

const Card = ({ title, children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            {children}
        </View>
    );
};

export default Card;