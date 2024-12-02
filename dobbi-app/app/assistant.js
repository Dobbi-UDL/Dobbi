import React, { useState, useCallback, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { v4 as uuidv4 } from "uuid"; // Optional: For generating unique conversation IDs
import ChatBubble from "../assets/components/ChatbotScreen/ChatBubble";
import Header from "../assets/components/Header/Header";
import { getOpenAIResponse } from "../services/openaiService";
import { BottomNavBar } from "../assets/components/Navigation/BottomNavBar";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState("");

  // Load the chat history for a conversation when the screen loads
  useEffect(() => {
    const loadConversation = async () => {
      try {
        // Get stored conversation ID
        const storedId = await AsyncStorage.getItem("currentConversationId");
        const existingId = storedId || uuidv4();

        // Save conversation ID if it's new
        if (!storedId) {
          await AsyncStorage.setItem("currentConversationId", existingId);
        }

        setConversationId(existingId);

        // Load messages for this conversation
        const storedChats = await AsyncStorage.getItem(`chat_${existingId}`);
        if (storedChats) {
          setMessages(JSON.parse(storedChats));
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    loadConversation();
  }, []); // Run once at mount

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveConversation = async () => {
      if (!conversationId) return;

      try {
        await AsyncStorage.setItem(
          `chat_${conversationId}`,
          JSON.stringify(messages)
        );
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    };

    saveConversation();
  }, [messages, conversationId]); // Run when messages or conversationId changes

  const sendMessage = useCallback(async () => {
    if (inputText.trim() === "") return;

    const userMessage = { text: inputText, isUser: true };
    const question = inputText;
    setInputText("");

    // Update messages with user input immediately
    setMessages((prevMessages) => [userMessage, ...prevMessages]);

    try {
      const response = await getOpenAIResponse(question);
      const aiMessage = { text: response, isUser: false };

      // Update messages with AI response
      setMessages((prevMessages) => [aiMessage, ...prevMessages]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      const errorMessage = {
        text: "Sorry, I couldn't process your request.",
        isUser: false,
      };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    }
  }, [inputText]);

  const renderItem = useCallback(
    ({ item }) => <ChatBubble text={item.text} isUser={item.isUser} />,
    []
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
      </KeyboardAvoidingView>
      <BottomNavBar />
    </>
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
