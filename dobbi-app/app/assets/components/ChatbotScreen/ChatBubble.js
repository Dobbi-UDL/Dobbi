import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const Avatar = ({ show = true }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [show]);

  return (
    <Animated.View style={[styles.avatar, { opacity: fadeAnim }]}>
      <View style={styles.avatarInner} />
    </Animated.View>
  );
};

export const TypingIndicator = ({ showAvatar = false }) => (
  <View style={styles.messageRow}>
    <Avatar show={showAvatar} />
    <View style={[styles.bubble, styles.botBubble]}>
      <Text>...</Text>
    </View>
  </View>
);

const ChatBubble = ({ text, isUser, onPress, isSelected, messageId, bubbleAnimation }) => {
  if (isUser) {
    return (
      <View style={styles.messageRow}>
        <TouchableOpacity 
          onPress={() => onPress(messageId)}
          style={[styles.bubble, styles.userBubble, isSelected && styles.selectedBubble]}
        >
          <Text style={styles.userText}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.messageRow}>
      <Avatar />
      <Animated.View style={[
        styles.bubbleContainer,
        {
          transform: [{
            translateX: bubbleAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            })
          }],
          opacity: bubbleAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          })
        }
      ]}>
        <TouchableOpacity 
          onPress={() => onPress(messageId)}
          style={[styles.bubble, styles.botBubble, isSelected && styles.selectedBubble]}
        >
          <Text style={styles.botText}>{text}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 8,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFB6B6',
  },
  bubbleContainer: {
    flex: 1,
    maxWidth: '80%',
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#FF9999',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#333',
  },
  selectedBubble: {
    backgroundColor: '#FFE5E5',
  },
});

export default ChatBubble;