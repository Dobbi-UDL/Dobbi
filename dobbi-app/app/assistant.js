// NEW VERSION
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
import { getFinancialContextData } from "../assets/components/Finances/Stats/Stats";
import { useAuth } from '../contexts/AuthContext';
import { getAllUnredeemedOffers } from "../services/marketplaceService";
import i18n from "../i18n";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ChatbotScreen = () => {
  const { user } = useAuth();

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
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const copyNotificationAnim = useRef(new Animated.Value(0)).current;

  const showCopySuccess = () => {
    setShowCopyNotification(true);
    Animated.sequence([
      Animated.spring(copyNotificationAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true
      }),
      Animated.delay(1500),
      Animated.timing(copyNotificationAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => setShowCopyNotification(false));
  };

  // Add this helper function
  const showAssistantResponse = async (isWelcome = false) => {
    // Create new abort controller for this typing session
    const typingSession = new AbortController();
    setActiveTyping(typingSession);

    try {
      // Natural delay before showing avatar typing
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, isWelcome ? 150 : 300 + Math.random() * 150);
        typingSession.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Typing cancelled'));
        });
      });

      setShowAvatar(true);
      setIsTyping(true);

      // Typing delay with indicator
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, isWelcome ? 1500 : 0);
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
    const initializeChat = async () => {
      try {
        await loadChatHistory();
        
        // Get last active chat from storage
        const lastChatId = await AsyncStorage.getItem('lastActiveChatId');
        
        if (lastChatId) {
          // Load last active chat
          await loadChat(lastChatId);
        } else {
          // Only create new chat if no previous chat exists
          const newChatId = uuidv4();
          setConversationId(newChatId);
          await showAssistantResponse(true);
          setShowAvatar(false);
          setIsTyping(false);
          setMessages([WELCOME_MESSAGE]);
          await AsyncStorage.setItem('lastActiveChatId', newChatId);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };
  
    initializeChat();
  }, []);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveConversation = async () => {
      if (!conversationId || messages.length === 0) return;
    };

    saveConversation();
  }, [messages, conversationId]); // Run when messages or conversationId changes

  // Add this effect to save last active chat ID
  useEffect(() => {
    if (conversationId) {
      AsyncStorage.setItem('lastActiveChatId', conversationId);
    }
  }, [conversationId]);

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
        // Sort messages by timestamp in reverse order (newest first)
        const messagesWithIds = parsedData.messages
          .map(msg => ({
            ...msg,
            id: msg.id || uuidv4(),
            timestamp: msg.timestamp || Date.now() // Ensure all messages have timestamps
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first
        
        setMessages(messagesWithIds);
        setConversationId(chatId);
        setSelectedMessage(null);
      }
      await AsyncStorage.setItem('lastActiveChatId', chatId);
      setShowHistory(false);
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
      } else {
        // Create new chat if no previous chats exist
        const newChatId = uuidv4();
        setConversationId(newChatId);
        await showAssistantResponse(true);
        setShowAvatar(false);
        setIsTyping(false);
        setMessages([WELCOME_MESSAGE]);
        await AsyncStorage.setItem('lastActiveChatId', newChatId);
      }
    };

    loadLastChat();
  }, []);

  const splitResponse = (response) => {
    // Split by -- markers and filter out empty chunks
    const chunks = response
      .split('--')
      .map(chunk => chunk.trim())
      .filter(Boolean);
    
    chunks.forEach((chunk, index) => {
      console.log(`📝 Split Message (${index + 1}/${chunks.length}):`, chunk);
    });
    
    console.log('📚 Total Chunks:', chunks.length);
    return chunks;
  };

  const sendMessage = useCallback(async () => {
    if (inputText.trim() === "") return;
  
    const userMessage = { 
      id: uuidv4(),
      text: inputText, 
      isUser: true,
      timestamp: Date.now()
    };
    
    console.log('\n🧑 User:', inputText);
    
    setInputText("");
    setMessages(prevMessages => [userMessage, ...prevMessages]);
  
    try {
      // Start typing immediately after user message
      let typingCompleted = await showAssistantResponse(false);
      
      const financialData = await getFinancialContextData(user.id);
      const offersData = await getAllUnredeemedOffers(user.id);

      // Get AI response while showing typing indicator
      console.log('User:', user);
      const aiResponse = await getOpenAIResponse(
        inputText, 
        user.username, 
        financialData, 
        offersData,
        user.user_type
      );
      console.log('🤖 Dobbi:', aiResponse);
      
      const responseChunks = splitResponse(aiResponse);
      const botMessages = [];
      
      for (const [index, chunk] of responseChunks.entries()) {
        // Make sure we're still typing
        if (!typingCompleted) {
          typingCompleted = await showAssistantResponse(false);
        }
  
        const botMessage = { 
          id: uuidv4(),
          text: chunk,
          isUser: false,
          timestamp: Date.now() + index
        };
        
        botMessages.push(botMessage);
        setMessages(prevMessages => [botMessage, ...prevMessages]);
        
        if (index < responseChunks.length - 1) {
          // Brief pause in typing (150-300ms)
          setShowAvatar(false);
          setIsTyping(false);
          
          // Start typing again for next message
          typingCompleted = await showAssistantResponse(false);
          
          // Reading delay while typing next message
          const wordCount = chunk.split(' ').length;
          const readingDelay = Math.min(Math.max(wordCount * 150, 300), 4500);
          await new Promise(resolve => setTimeout(resolve, readingDelay));
        }
      }
      
      // Finally stop typing after last message
      setShowAvatar(false);
      setIsTyping(false);
      
      // Save all messages
      const updatedMessages = [...botMessages, userMessage, ...messages];
      await chatStorageService.saveChat(conversationId || uuidv4(), updatedMessages);
      loadChatHistory();
      
    } catch (error) {
      console.error("❌ Error getting AI response:", error);
      setShowAvatar(false);
      setIsTyping(false);
    }
  }, [inputText, conversationId, messages, user?.id]);

  const handleBubblePress = useCallback((messageId) => {
    console.log('Message selected:', messageId); // Add debug logging
    setSelectedMessage(prevSelected => {
      const newSelected = prevSelected === messageId ? null : messageId;
      console.log('New selected state:', newSelected); // Add debug logging
      return newSelected;
    });
  }, []);

  // Add this useEffect to debug selection changes
  useEffect(() => {
    console.log('Selected message changed:', selectedMessage);
  }, [selectedMessage]);

  // Add this function to find selected message data
  const getSelectedMessageData = useCallback(() => {
    if (!selectedMessage) return null;
    return messages.find(msg => msg.id === selectedMessage);
  }, [selectedMessage, messages]);

  // Update renderItem to disable bubble interaction during transitions
  const renderItem = useCallback(
    ({ item, index }) => {
      // Check if previous message was from bot
      const previousMessageIsBot = index < messages.length - 1 && 
        !messages[index + 1].isUser;  // Remember FlatList is inverted
  
      return (
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
          disabled={isTransitioning}
          previousMessageIsBot={previousMessageIsBot}
        />
      );
    },
    [selectedMessage, messages, isTransitioning, handleBubblePress]
  );

  // Update keyExtractor to use message ID
  const keyExtractor = useCallback((item) => item.id, []);

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
      await AsyncStorage.setItem('lastActiveChatId', newChatId);
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

   // wait
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
            showCopySuccess(); // Add this line
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

        {showCopyNotification && (
          <Animated.View style={[
            styles.copyNotification,
            {
              opacity: copyNotificationAnim,
              transform: [{
                translateY: copyNotificationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                })
              }]
            }
          ]}>
            <MaterialIcons name="check-circle" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.copyNotificationText}>Copied to clipboard</Text>
          </Animated.View>
        )}

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
    position: 'relative', // Add this to handle absolute positioned Banner
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
  copyNotification: {
    position: 'absolute',
    top: 120, // Below header
    transform: [{ translateX: -75 }], // Half of the width
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
  },
  copyNotificationText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ChatbotScreen;
