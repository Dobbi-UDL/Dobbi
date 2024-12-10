import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FloatingMenu from './FloatingMenu';

const ChatInput = ({ 
  inputText, 
  setInputText, 
  onSend, 
  onMenuPress, 
  isMenuOpen, 
  menuAnimation,
  onHistoryPress,
  onNewChatPress 
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#B4B4B4"
          multiline
          maxHeight={100}
          textAlignVertical="center"
          paddingTop={12}
          paddingBottom={12}
        />
      </View>
      {inputText.trim() !== "" ? (
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={onSend}
          activeOpacity={0.7}
        >
          <MaterialIcons name="send" size={24} color="#fff" /> {/* Increased from 20 */}
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isMenuOpen ? "close" : "more-vert"}
              size={28} // Increased from 24
              color="#FFF"
            />
          </TouchableOpacity>
          <FloatingMenu 
            isOpen={isMenuOpen} 
            animation={menuAnimation} 
            onHistoryPress={onHistoryPress}
            onNewChatPress={onNewChatPress}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12, // Increased from 8 to accommodate larger buttons
    backgroundColor: "#FFF5F5",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    elevation: 1,
    shadowColor: "#ee6567",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: 'center', // Added for better alignment
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333333",
    maxHeight: 100,
    minHeight: 44,
    textAlignVertical: 'center', // Ensures text is centered
  },
  sendButton: {
    width: 48, // Increased from 40
    height: 48, // Increased from 40
    borderRadius: 24, // Half of width/height
    backgroundColor: "#EE6567",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ee6567",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  menuButton: {
    width: 48, // Increased from 40
    height: 48, // Increased from 40
    borderRadius: 24, // Half of width/height
    backgroundColor: "#EE6567",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ee6567",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default ChatInput;