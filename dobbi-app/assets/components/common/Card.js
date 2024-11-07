// Card.js
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const Card = ({ children }) => {
    return (
        <View style={styles.card}>
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
    }
});

Card.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Card;