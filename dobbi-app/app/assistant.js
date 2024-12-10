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
import ChatInput from "../assets/components/ChatbotScreen/ChatInput";
import { chatStorageService } from "../services/chatStorageService";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [chatList, setChatList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Modify the loadConversation effect
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const storedId = await AsyncStorage.getItem("currentConversationId");
        const existingId = storedId || uuidv4();

        if (!storedId) {
          await AsyncStorage.setItem("currentConversationId", existingId);
          const welcomeMessage = {
            id: uuidv4(),  // Ensure welcome message has ID
            text: "Hi! I'm Dobbi...",
            isUser: false,
          };
          setMessages([welcomeMessage]);
          await AsyncStorage.setItem(
            `chat_${existingId}`,
            JSON.stringify({
              messages: [welcomeMessage],  // Save with ID
              lastModified: new Date().toISOString(),
            })
          );
        } else {
          const storedChats = await AsyncStorage.getItem(`chat_${existingId}`);
          if (storedChats) {
            const parsedData = JSON.parse(storedChats);
            // Ensure all messages have IDs
            const messagesWithIds = parsedData.messages.map(msg => ({
              ...msg,
              id: msg.id || uuidv4() // Add ID if missing
            }));
            setMessages(messagesWithIds);
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
    id: uuidv4(),  
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

  // Update loadChat function
  const loadChat = async (chatId) => {
    try {
      const storedChat = await AsyncStorage.getItem(`chat_${chatId}`);
      if (storedChat) {
        const parsedData = JSON.parse(storedChat);
        const messagesWithIds = parsedData.messages.map(msg => ({
          ...msg,
          id: msg.id || uuidv4() // Add ID if missing
        }));
        setMessages(messagesWithIds);
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

    const userMessage = { 
      id: uuidv4(),  // Add unique id
      text: inputText, 
      isUser: true 
    };
    setInputText("");

    // Update messages with user input immediately
    setMessages((prevMessages) => [userMessage, ...prevMessages]);

    // Mock AI response for UI testing
    const mockResponse = { 
      id: uuidv4(),  // Add unique id
      text: "This is a test response to: " + inputText, 
      isUser: false 
    };
    
    const updatedMessages = [mockResponse, userMessage, ...messages];
    setMessages(updatedMessages);

    // Save to storage only when there's actual conversation
    const chatId = conversationId || uuidv4();
    if (!conversationId) {
      setConversationId(chatId);
    }

    // Only save if there are messages beyond the welcome message
    if (updatedMessages.length > 1) {
      await chatStorageService.saveChat(chatId, updatedMessages);
      loadChatHistory(); // Refresh history after saving
    }
  }, [inputText, conversationId, messages]);

  const handleBubblePress = (messageId) => {
    setSelectedMessage(currentSelected => 
      currentSelected === messageId ? null : messageId
    );
  };

  const renderItem = useCallback(
    ({ item }) => (
      <ChatBubble 
        text={item.text} 
        isUser={item.isUser} 
        onPress={handleBubblePress}
        isSelected={selectedMessage === item.id}  // Compare by id instead of text
        messageId={item.id}  // Pass the id to ChatBubble
      />
    ),
    [selectedMessage]
  );

  // Update keyExtractor to use message ID
  const keyExtractor = useCallback((item) => item.id, []);

  useEffect(() => {
    console.log('Current System Prompt:');
    console.log('===================');
    console.log(getSystemPrompt());
    console.log('===================');
  }, []);

  const handleHistoryPress = useCallback(async () => {
    await loadChatHistory();
    setShowHistory(true);
    toggleMenu();
  }, []);

  const handleNewChatPress = useCallback(async () => {
    try {
      const newChatId = uuidv4();
      await chatStorageService.setCurrentChat(newChatId);
      setConversationId(newChatId);
      setMessages([WELCOME_MESSAGE]);
      toggleMenu();
      // Don't save the chat until user sends first message
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
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
        <ChatInput 
          inputText={inputText}
          setInputText={setInputText}
          onSend={sendMessage}
          onMenuPress={toggleMenu}
          isMenuOpen={isMenuOpen}
          menuAnimation={menuAnimation}
          onHistoryPress={handleHistoryPress}
          onNewChatPress={handleNewChatPress}
        />
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
