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
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { v4 as uuidv4 } from "uuid"; // Optional: For generating unique conversation IDs
import ChatBubble from "../assets/components/ChatbotScreen/ChatBubble";
import Header from "../assets/components/Header/Header";
import { getOpenAIResponse } from "../services/openaiService";
import { BottomNavBar } from "../assets/components/Navigation/BottomNavBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [chatList, setChatList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;

    Animated.spring(menuAnimation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setIsMenuOpen(!isMenuOpen);
  };

  const createNewChat = async () => {
    const newChatId = uuidv4();
    setConversationId(newChatId);
    setMessages([]);
    toggleMenu();
    // Save new chat to AsyncStorage
    await AsyncStorage.setItem(`chat_${newChatId}`, JSON.stringify([]));
  };

  const loadChatHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter((key) => key.startsWith("chat_"));

      const chats = await Promise.all(
        chatKeys.map(async (key) => {
          const messages = await AsyncStorage.getItem(key);
          const chatId = key.replace("chat_", "");
          const firstMessage =
            JSON.parse(messages)[0]?.text?.slice(0, 30) || "New Chat";
          return {
            id: chatId,
            preview: firstMessage,
            timestamp: new Date().toISOString(), // You might want to store this with the chat
          };
        })
      );

      // Sort by timestamp, newest first
      setChatList(chats.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const storedChat = await AsyncStorage.getItem(`chat_${chatId}`);
      if (storedChat) {
        setMessages(JSON.parse(storedChat));
        setConversationId(chatId);
      }
      setShowHistory(false);
      toggleMenu();
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const viewChatHistory = async () => {
    await loadChatHistory();
    setShowHistory(true);
  };

  useEffect(() => {
    const loadLastChat = async () => {
      await loadChatHistory();
      if (chatList.length > 0) {
        await loadChat(chatList[0].id);
      }
    };

    loadLastChat();
  }, []);

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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header />

        {/* Chat History Modal */}
        {showHistory && (
          <View style={styles.historyOverlay}>
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Chat History</Text>
                <TouchableOpacity
                  onPress={() => setShowHistory(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.historyList}>
                {chatList.map((chat) => (
                  <TouchableOpacity
                    key={chat.id}
                    style={styles.historyItem}
                    onPress={() => loadChat(chat.id)}
                  >
                    <Text style={styles.historyPreview}>{chat.preview}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        <FlatList
          style={styles.chatContainer}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          inverted
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.inputContainer}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <MaterialIcons
                name={isMenuOpen ? "close" : "more-vert"}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>

            {/* Animated Menu Items */}
            <Animated.View
              style={[
                styles.menuItem,
                {
                  transform: [
                    {
                      translateY: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -60],
                      }),
                    },
                  ],
                  opacity: menuAnimation,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuOption}
                onPress={createNewChat}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.menuItem,
                {
                  transform: [
                    {
                      translateY: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -120],
                      }),
                    },
                  ],
                  opacity: menuAnimation,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuOption}
                onPress={viewChatHistory}
              >
                <MaterialIcons name="history" size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
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
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    marginRight: 10,
  },
  menuItem: {
    position: "absolute",
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999, // Increased z-index
    elevation: 5, // For Android
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    zIndex: 10000, // Higher than overlay
    elevation: 6, // For Android
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  historyList: {
    maxHeight: 300,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  historyPreview: {
    fontSize: 16,
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
  },
});

export default ChatbotScreen;
