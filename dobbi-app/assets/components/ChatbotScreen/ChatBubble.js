import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Vibration, Animated } from "react-native";
import Markdown from 'react-native-markdown-display';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

const ActionPanel = ({ isVisible, isUser, onCopy, onShare, onReport, onDelete }) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : 100,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  if (!isVisible) return null;  // Only render when visible

  return (
    <Animated.View style={[styles.actionPanel, { transform: [{ translateY }] }]}>
      <TouchableOpacity key="copy" style={styles.actionButton} onPress={onCopy}>
        <MaterialIcons name="content-copy" size={24} color="#555" />
        <Text style={styles.actionText}>Copy</Text>
      </TouchableOpacity>
      <TouchableOpacity key="share" style={styles.actionButton} onPress={onShare}>
        <MaterialIcons name="share" size={24} color="#555" />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
      {isUser ? (
        <TouchableOpacity key="delete" style={styles.actionButton} onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="#ff4444" />
          <Text style={[styles.actionText, { color: '#ff4444' }]}>Delete</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity key="report" style={styles.actionButton} onPress={onReport}>
          <MaterialIcons name="flag" size={24} color="#555" />
          <Text style={styles.actionText}>Report</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const ChatBubble = ({ text, isUser, onPress, isSelected, messageId }) => {
  const [localSelected, setLocalSelected] = useState(false);

  useEffect(() => {
    setLocalSelected(isSelected);
  }, [isSelected]);

  const handleLongPress = async (event) => {
    if (!isSelected) {
      event.stopPropagation();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.(messageId);  // Pass messageId instead of text
    }
  };

  const handlePress = () => {
    if (isSelected) {
      onPress?.(null);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.bubbleContainer}>
      <TouchableOpacity
        onLongPress={handleLongPress}
        onPress={handlePress}
        delayLongPress={200}
        activeOpacity={0.9}
        style={styles.touchableWrapper}
        delayPressOut={0}
      >
        {isSelected && <View style={styles.fullWidthOverlay} />}
        <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
          {!isUser && (
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../images/dobbi-avatar.png")}
                style={styles.logo}
              />
            </View>
          )}

          <View style={[
            styles.container,
            isUser ? styles.userBubble : styles.botBubble,
          ]}>
            <Markdown 
              style={{
                body: styles.markdownBody,
                text: [styles.text, isUser ? styles.userText : styles.botText],
                strong: styles.boldText,
                link: styles.linkText,
                bullet_list: styles.bulletList,
                paragraph: styles.paragraph,
              }}
              selectable={true}
            >
              {text}
            </Markdown>
          </View>
        </View>
      </TouchableOpacity>
      {localSelected && (
        <ActionPanel 
          isVisible={localSelected}
          isUser={isUser}
          onCopy={handleCopy}
          onShare={() => {/* implement share */}}
          onReport={() => {/* implement report */}}
          onDelete={() => {/* implement delete */}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    position: 'relative',
  },
  fullWidthOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 101, 103, 0.15)',
    zIndex: 10,
    paddingVertical: 6,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    zIndex: 2,
  },
  userWrapper: {
    justifyContent: "flex-end",
  },
  botWrapper: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  container: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#ee6567",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

  },
  userBubble: {
    backgroundColor: "#f66c72",
    marginLeft: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    marginRight: 50,
  },
  markdownBody: {
    margin: 0,
    padding: 0,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
  },
  botText: {
    color: "#333333",
  },
  logo: {
    width: 36,
    height: 31,
  },
  boldText: {
    fontWeight: '600',
  },
  linkText: {
    color: isUser => isUser ? 'rgba(255, 255, 255, 0.9)' : '#EE6567',
    textDecorationLine: 'underline',
  },
  bulletList: {
    marginLeft: 8,
  },
  paragraph: {
    margin: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userInteractiveElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userInteractiveText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionPanel: {
    position: 'absolute',
    bottom: -60, // Adjust this value to position the panel properly
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  bubbleContainer: {
    width: '100%',
    position: 'relative',
  },
});

export default ChatBubble;
