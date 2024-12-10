import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Markdown from 'react-native-markdown-display';

// Helper function to get initials from the username
const getInitials = (name) => {
  if (!name) return "?";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials;
};

const ChatBubble = ({ text, isUser, onPress }) => {
  return (
    <View
      style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}
    >
      {/* Avatar */}
      {!isUser && (
        <Image
          source={require("../../images/dobbi-logo.png")}
          style={styles.logo}
        />
      )}

      <TouchableOpacity
        onPress={() => onPress?.(text)}
        activeOpacity={0.7}
        style={[
          styles.container,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
          <Markdown 
            style={{
              body: { margin: 0, padding: 0 },
              text: [styles.text, isUser ? styles.userText : styles.botText],
              strong: styles.boldText,
              link: styles.linkText,
              bullet_list: styles.bulletList,
              paragraph: styles.paragraph,
            }}
            selectable={true}  
            longPressEnabled={true}
          >
            {text}
          </Markdown>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 8,
  },
  userWrapper: {
    justifyContent: "flex-end",
    marginRight: 15,
  },
  botWrapper: {
    justifyContent: "flex-start",
    marginLeft: 15,
  },
  container: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 4, // Reduced from 12
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#FFFFFF",
  },
  botBubble: {
    backgroundColor: "#F0F0F0",
  },
  text: {
    fontSize: 16,
  },
  userText: {
    color: "black",
  },
  botText: {
    color: "#333333",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 8,
    borderColor: "#FF6B6B",
  },
  boldText: {
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  bulletList: {
    marginLeft: 10,
  },
  markdownText: {
    color: 'inherit',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  paragraph: {
    margin: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ChatBubble;
