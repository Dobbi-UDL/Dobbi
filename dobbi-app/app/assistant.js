import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Alert,  // Add Alert to imports
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; // Optional: For generating unique conversation IDs
import ChatBubble, { TypingIndicator, Banner } from "../assets/components/ChatbotScreen/ChatBubble";
import Header from "../assets/components/Header/Header";
import { getOpenAIResponse, getSystemPrompt } from "../services/openaiService";
import { BottomNavBar } from "../assets/components/Navigation/BottomNavBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ChatInput from "../assets/components/ChatbotScreen/ChatInput";
import { chatStorageService } from "../services/chatStorageService";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [chatList, setChatList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1)); // Add this state for fade animation
  const [isTransitioning, setIsTransitioning] = useState(false);  // Add this state
  const [isTyping, setIsTyping] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);  // Add this state
  const [activeTyping, setActiveTyping] = useState(null); // Add this state
  const flatListRef = useRef(null);
  const messageRefs = useRef(new Map()).current;  // Add this to store message refs

  // Add this helper function
  const showAssistantResponse = async (isWelcome = false) => {
    // Create new abort controller for this typing session
    const typingSession = new AbortController();
    setActiveTyping(typingSession);

    try {
      // Natural delay before showing avatar typing
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, isWelcome ? 200 : 1000);
        typingSession.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Typing cancelled'));
        });
      });

      setShowAvatar(true);
      setIsTyping(true);

      // Typing delay with indicator
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, 1500 + Math.random() * 1000);
        typingSession.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Typing cancelled'));
        });
      });

      return true; // Typing completed successfully
    } catch (error) {
      if (error.message === 'Typing cancelled') {
        return false; // Typing was interrupted
      }
      throw error;
    } finally {
      setActiveTyping(null);
    }
  };

  useEffect(() => {
    const initializeNewChat = async () => {
      const newChatId = uuidv4();
      setConversationId(newChatId);
      await showAssistantResponse(true); // Pass true for welcome message
      setShowAvatar(false);
      setIsTyping(false);
      setMessages([WELCOME_MESSAGE]);
    };

    initializeNewChat();
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

  const performDeleteChat = async (chatId) => {
    try {
      // Cancel any ongoing typing
      if (activeTyping) {
        activeTyping.abort();
        setShowAvatar(false);
        setIsTyping(false);
      }

      await AsyncStorage.removeItem(`chat_${chatId}`);
      setChatList((prev) => prev.filter((chat) => chat.id !== chatId));

      // Close menu if deleting current chat
      if (chatId === conversationId) {
        setIsMenuOpen(false);
        fadeToNewChat();
      } else {
        // If there are no chats left after deletion, create a new one
        const remainingChats = chatList.filter((chat) => chat.id !== chatId);
        if (remainingChats.length === 0) {
          fadeToNewChat();
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const deleteChat = async (chatId) => {
    const isCurrentChat = chatId === conversationId;
    Alert.alert(
      "Delete Chat",
      isCurrentChat 
        ? "Are you sure you want to delete this chat?" 
        : "Are you sure you want to delete this chat from history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await performDeleteChat(chatId);
          }
        }
      ]
    );
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
        setSelectedMessage(null); // Reset selected message
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

    // Add messages to the start of the array to work with inverted FlatList
    const userMessage = { 
      id: uuidv4(),
      text: inputText, 
      isUser: true,
      timestamp: Date.now() // Add timestamp for proper animation ordering
    };
    setInputText("");
    setMessages(prevMessages => [userMessage, ...prevMessages]);

    const typingCompleted = await showAssistantResponse(false);
    
    if (typingCompleted) {
      const botMessage = { 
        id: uuidv4(),
        text: "This is a test response to: " + inputText, 
        isUser: false,
        timestamp: Date.now() // Add timestamp for proper animation ordering
      };
      
      setShowAvatar(false);
      setIsTyping(false);
      setMessages(prevMessages => [botMessage, ...prevMessages]);

      const updatedMessages = [botMessage, userMessage, ...messages];
      await chatStorageService.saveChat(conversationId || uuidv4(), updatedMessages);
      loadChatHistory();
    }
  }, [inputText, conversationId, messages]);

  const handleBubblePress = useCallback((messageId) => {
    if (isTransitioning) return;
    setSelectedMessage(currentSelected => {
      if (currentSelected === messageId) {
        return null;
      }
      return messageId;
    });
  }, [isTransitioning]);

  // Add this function to find selected message data
  const getSelectedMessageData = useCallback(() => {
    if (!selectedMessage) return null;
    return messages.find(msg => msg.id === selectedMessage);
  }, [selectedMessage, messages]);

  const renderItem = useCallback(
    ({ item }) => (
      <ChatBubble 
        ref={ref => {
          if (ref) {
            messageRefs.set(item.id, ref);
          } else {
            messageRefs.delete(item.id);
          }
        }}
        text={item.text} 
        isUser={item.isUser} 
        onPress={handleBubblePress}
        isSelected={selectedMessage === item.id}
        messageId={item.id}
        onClose={() => setSelectedMessage(null)}
      />
    ),
    [selectedMessage]
  );

  // Update keyExtractor to use message ID
  const keyExtractor = useCallback((item) => item.id, []);

  useEffect(() => {
    console.log('Current System Prompt:');
    console.log('===================');
    console.log('===================');
  }, []);

  const handleHistoryPress = useCallback(async () => {
    await loadChatHistory();
    setShowHistory(true);
    toggleMenu();
  }, []);

  const handleNewChatPress = useCallback(async () => {
    try {
      console.log('Creating new chat...');
      
      // Cancel any ongoing typing
      if (activeTyping) {
        activeTyping.abort();
        setShowAvatar(false);
        setIsTyping(false);
      }

      const newChatId = uuidv4();
      await chatStorageService.setCurrentChat(newChatId);
      setConversationId(newChatId);
      setMessages([]); // Clear messages first
      
      // Animate menu closing first
      Animated.spring(menuAnimation, {
        toValue: 0,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }).start(() => {
        setIsMenuOpen(false);
      });

      // Show typing animation for welcome message
      await showAssistantResponse(true);
      setShowAvatar(false);
      setIsTyping(false);
      setMessages([WELCOME_MESSAGE]);
      
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  }, [menuAnimation, activeTyping]); // Add activeTyping to dependencies

  const fadeToNewChat = async () => {
    // Start transition state immediately
    setIsTransitioning(true);
    setSelectedMessage(null);
    
    // Clear current messages
    setMessages([]);

   // wait 1s for nothing
    await new Promise(resolve => setTimeout(resolve, 300));

    // Set new messages while invisible
    const newChatId = uuidv4();
    await chatStorageService.setCurrentChat(newChatId);
    setConversationId(newChatId);
    
    // Add typing animation here too
    await showAssistantResponse(true);
    setShowAvatar(false);
    setIsTyping(false);
    setMessages([WELCOME_MESSAGE]);

    // Keep transition state active until animation is completely done
    await new Promise(resolve => setTimeout(resolve, fadeInDuration));
    setIsTransitioning(false);
  };

  const handleDeleteCurrentChat = useCallback(async () => {
    deleteChat(conversationId); // Now using the shared deleteChat function
  }, [conversationId]);

  // Calculate if chat is deletable (has user messages)
  const canDeleteChat = messages.some(message => message.isUser);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header title="Chatbot" />

        {/* Move the Banner component here */}
        <Banner 
          isVisible={!!selectedMessage}
          message={getSelectedMessageData()}
          onClose={() => setSelectedMessage(null)}
          onCopy={async (text) => {
            await Clipboard.setStringAsync(text);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSelectedMessage(null);
          }}
          onShare={() => {
            // Implement share
            setSelectedMessage(null);
          }}
          onReport={() => {
            // Implement report
            setSelectedMessage(null);
          }}
          onDelete={() => {
            // Implement delete
            setSelectedMessage(null);
          }}
          // Remove the style prop or adjust it if necessary
        />

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

        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <AnimatedFlatList
            ref={flatListRef}
            style={styles.chatContainer}
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            inverted
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
          />
        </Animated.View>
        <ChatInput 
          inputText={inputText}
          setInputText={setInputText}
          onSend={sendMessage}
          onMenuPress={toggleMenu}
          isMenuOpen={isMenuOpen}
          menuAnimation={menuAnimation}
          onHistoryPress={handleHistoryPress}
          onNewChatPress={handleNewChatPress}
          onDeleteChat={handleDeleteCurrentChat}
          canDelete={canDeleteChat}
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
