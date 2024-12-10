import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ChatInput = ({ inputText, setInputText, onSend, onMenuPress, isMenuOpen }) => {
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
        />
      </View>
      {inputText.trim() !== "" ? (
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={onSend}
          activeOpacity={0.7}
        >
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={isMenuOpen ? "close" : "more-vert"}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#FFF5F5",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    elevation: 1.,
    shadowColor: "#ee6567",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333333",
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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