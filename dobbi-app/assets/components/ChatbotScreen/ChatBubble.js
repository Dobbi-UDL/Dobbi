import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Vibration } from "react-native";
import Markdown from 'react-native-markdown-display';


const ChatBubble = ({ text, isUser, onPress, isSelected }) => {
  const handleLongPress = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    Vibration.vibrate(40);
    onPress?.(text);
  };

  const handlePress = () => {
    if (isSelected) {
      // unselect
      onPress?.(null);
    }
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      onPress={handlePress}
      delayLongPress={200}
      activeOpacity={isSelected ? 1 : 0.9} // Adjusted for better feedback
      style={styles.touchableWrapper}
    >
      {isSelected && <View style={[
        styles.fullWidthOverlay,
        isUser && styles.userFullWidthOverlay
      ]} />}
      <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../images/dobbi-avatar.png")}
              style={styles.logo}
            />
          </View>
        )}

        <View style={[
          styles.container,
          isUser ? styles.userBubble : styles.botBubble,
        ]}>
          <Markdown 
            style={{
              body: styles.markdownBody,
              text: [styles.text, isUser ? styles.userText : styles.botText],
              strong: styles.boldText,
              link: styles.linkText,
              bullet_list: styles.bulletList,
              paragraph: styles.paragraph,
            }}
            selectable={true}
          >
            {text}
          </Markdown>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    position: 'relative',
  },
  fullWidthOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 101, 103, 0.15)',
    zIndex: 10,
    paddingVertical: 6,
  },
  userFullWidthOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter overlay for user messages
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6, // This controls the inner gap between bubble content
    zIndex: 2,
  },
  userWrapper: {
    justifyContent: "flex-end",
  },
  botWrapper: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  container: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#ee6567",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

  },
  userBubble: {
    backgroundColor: "#f66c72",
    marginLeft: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border for depth
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    marginRight: 50,
  },
  markdownBody: {
    margin: 0,
    padding: 0,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
  },
  botText: {
    color: "#333333",
  },
  logo: {
    // 808 x 700
    width: 36,
    height: 31,
  },
  boldText: {
    fontWeight: '600',
  },
  linkText: {
    color: isUser => isUser ? 'rgba(255, 255, 255, 0.9)' : '#EE6567',
    textDecorationLine: 'underline',
  },
  bulletList: {
    marginLeft: 8,
  },
  paragraph: {
    margin: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userInteractiveElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userInteractiveText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ChatBubble;
