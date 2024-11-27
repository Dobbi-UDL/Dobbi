import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BottomNavBar } from "../assets/components/Navigation/BottomNavBar";
import { ChatBubble } from "../assets/components/ChatbotScreen/ChatBubble";
import Header from "../assets/components/Header/Header";
import { useLanguage } from "@languagecontext";

const ChatbotScreen = () => {
  const { locale } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const sendMessage = useCallback(() => {
    if (inputText.trim() !== "") {
      setMessages((prevMessages) => [
        { text: inputText, isUser: true },
        ...prevMessages,
      ]);
      setInputText("");
      // Here you would call the chatbot logic to get the response
      setTimeout(() => {
        const response = "This is a sample response from the chatbot.";
        setMessages((prevMessages) => [
          { text: response, isUser: false },
          ...prevMessages,
        ]);
      }, 1000); // Simulating a delay in the chatbot response
    }
  }, [inputText]);

  const renderItem = useCallback(
    ({ item }) => <ChatBubble text={item.text} isUser={item.isUser} />,
    []
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Header />
      <FlatList
        style={styles.chatContainer}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  chatContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFF5F5",
  },
  input: {
    flex: 1,
    backgroundColor: "#F2D4D4",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333333",
  },
  sendButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatbotScreen;
