import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

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

const ChatBubble = ({ text, isUser, username }) => {
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

      {/* Message Bubble */}
      <View
        style={[
          styles.container,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {text}
        </Text>
      </View>

      {isUser && (
        <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>{username}</Text>
        </View>
      )}
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
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  avatarPlaceholder: {
    backgroundColor: "#FF6B6B",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  botAvatar: {
    marginRight: 8,
  },
  container: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
});

export default ChatBubble;
