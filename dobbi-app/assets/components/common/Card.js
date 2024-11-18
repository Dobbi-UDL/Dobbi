import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { styles } from './Card.styles';

const Card = ({ title, children, cardStyle, titleStyle }) => {
    return (
        <View style={StyleSheet.flatten([styles.card, cardStyle])}>
            {title && <Text style={StyleSheet.flatten([styles.title, titleStyle])}>{title}</Text>}
            {children}
        </View>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    cardStyle: PropTypes.object,
    titleStyle: PropTypes.object,
};

export default Card;