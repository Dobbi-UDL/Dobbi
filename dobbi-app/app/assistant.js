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
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; // Optional: For generating unique conversation IDs
import ChatBubble from "../assets/components/ChatbotScreen/ChatBubble";
import Header from "../assets/components/Header/Header";
import { getOpenAIResponse, getSystemPrompt } from "../services/openaiService";
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
        const storedId = await AsyncStorage.getItem("currentConversationId");
        const existingId = storedId || uuidv4();

        if (!storedId) {
          await AsyncStorage.setItem("currentConversationId", existingId);
          // Add welcome message for first-time users
          setMessages([WELCOME_MESSAGE]);
          await AsyncStorage.setItem(
            `chat_${existingId}`,
            JSON.stringify({
              messages: [WELCOME_MESSAGE],
              lastModified: new Date().toISOString(),
            })
          );
        } else {
          const storedChats = await AsyncStorage.getItem(`chat_${existingId}`);
          if (storedChats) {
            setMessages(JSON.parse(storedChats).messages || []);
          }
        }

        setConversationId(existingId);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    loadConversation();
  }, []);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveConversation = async () => {
      if (!conversationId || messages.length === 0) return;
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

  const WELCOME_MESSAGE = {
    text: "Hi! I'm Dobbi, your personal AI assistant. I can help you with questions, coding, research, or just friendly chat. What would you like to talk about?",
    isUser: false,
  };

  // Modify createNewChat function
  const createNewChat = async () => {
    try {
      const newChatId = uuidv4();
      setConversationId(newChatId);
      setMessages([WELCOME_MESSAGE]); // Add welcome message
      toggleMenu();
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
  const loadChatHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter((key) => key.startsWith("chat_"));

      const chats = await Promise.all(
        chatKeys.map(async (key) => {
          const chatData = await AsyncStorage.getItem(key);
          const chatId = key.replace("chat_", "");
          const parsedData = JSON.parse(chatData);
          const messages = parsedData.messages || [];
          const lastModified =
            parsedData.lastModified || new Date().toISOString();

          return {
            id: chatId,
            preview: messages[0]?.text?.slice(0, 30) || "New Chat",
            lastModified,
            messageCount: messages.length,
          };
        })
      );

      // Sort by lastModified, newest first
      setChatList(
        chats.sort(
          (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
        )
      );
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await AsyncStorage.removeItem(`chat_${chatId}`);
      setChatList((prev) => prev.filter((chat) => chat.id !== chatId));

      // If current chat was deleted, load the most recent chat
      if (chatId === conversationId) {
        const remainingChats = chatList.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          await loadChat(remainingChats[0].id);
        } else {
          setMessages([]);
          setConversationId("");
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const storedChat = await AsyncStorage.getItem(`chat_${chatId}`);
      if (storedChat) {
        setMessages(JSON.parse(storedChat).messages || []);
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

    // Ensure we have a valid conversationId
    const chatId = conversationId || uuidv4();
    if (!conversationId) {
      setConversationId(chatId);
    }

    // Update messages with user input immediately
    setMessages((prevMessages) => [userMessage, ...prevMessages]);

    try {
      const response = await getOpenAIResponse(question);
      const aiMessage = { text: response, isUser: false };

      // Update messages with AI response
      setMessages((prevMessages) => {
        const updatedMessages = [aiMessage, ...prevMessages];

        // Save chat after first message
        AsyncStorage.setItem(
          `chat_${chatId}`,
          JSON.stringify({
            messages: updatedMessages,
            lastModified: new Date().toISOString(),
          })
        );

        // Update chat list
        loadChatHistory();

        return updatedMessages;
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      const errorMessage = {
        text: "Sorry, I couldn't process your request.",
        isUser: false,
      };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    }
  }, [inputText, conversationId]);

  const handleBubblePress = (text) => {
    // Here you can implement your copy options
    console.log('Message pressed:', text);
    // Later we'll add copy functionality here
  };

  const renderItem = useCallback(
    ({ item }) => (
      <ChatBubble 
        text={item.text} 
        isUser={item.isUser} 
        onPress={handleBubblePress}
      />
    ),
    []
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  useEffect(() => {
    console.log('Current System Prompt:');
    console.log('===================');
    console.log(getSystemPrompt());
    console.log('===================');
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header title="Chatbot" />

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
                    style={[
                      styles.historyItem,
                      chat.id === conversationId && styles.selectedChat,
                    ]}
                    onPress={() => loadChat(chat.id)}
                  >
                    <View style={styles.historyContent}>
                      <Text style={styles.historyPreview}>{chat.preview}</Text>
                      <Text style={styles.historyDate}>
                        {new Date(chat.lastModified).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteChat(chat.id)}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff4444" />
                    </TouchableOpacity>
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
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
            }}
            placeholder="Type a message..."
          />
          {inputText.trim() !== "" ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuButton} onPress={sendMessage}>
                <MaterialIcons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {isMenuOpen && (
                <TouchableWithoutFeedback onPress={toggleMenu}>
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        position: "absolute",
                        top: -1000,
                        left: -1000,
                        right: -1000,
                        bottom: -1000,
                        zIndex: 1,
                      },
                    ]}
                  />
                </TouchableWithoutFeedback>
              )}
              <View style={[styles.menuContainer, { zIndex: 2 }]}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={toggleMenu}
                >
                  <MaterialIcons
                    name={isMenuOpen ? "close" : "more-vert"}
                    size={24}
                    color="#FFF"
                  />
                </TouchableOpacity>
                <Animated.View
                  style={[
                    styles.menuItem,
                    {
                      transform: [
                        {
                          translateY: menuAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -70],
                          }),
                        },
                      ],
                      opacity: menuAnimation,
                      zIndex: 2,
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
                            outputRange: [0, -140], // Increased spacing
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
            </>
          )}
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
  menuContainer: {
    position: "relative",
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 12,
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    position: "absolute",
    right: 0,
    backgroundColor: "#FF6B6B",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyPreview: {
    fontSize: 16,
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 5,
  },
  selectedChat: {
    backgroundColor: "#E0E0E0",
  },
  historyContent: {
    flex: 1,
  },
});

export default ChatbotScreen;
