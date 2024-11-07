// Card.js
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const Card = ({ title, children, cardStyle, titleStyle }) => {
    return (
        <View style={StyleSheet.flatten([styles.card, cardStyle])}>
            {title && <Text style={StyleSheet.flatten([styles.title, titleStyle])}>{title}</Text>}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // for Android shadow
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

Card.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Card;