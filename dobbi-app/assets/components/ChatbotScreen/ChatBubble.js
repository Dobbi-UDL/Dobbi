import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatBubble = ({ text, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#333333',
  },
});

export default ChatBubble;