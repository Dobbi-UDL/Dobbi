import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Vibration, Animated } from "react-native";
import Markdown from 'react-native-markdown-display';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

const TypingIndicator = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Fade in the entire indicator
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true
    }).start();

    // Animate dots in sequence
    const animateDots = () => {
      Animated.sequence([
        // Reset all dots
        Animated.parallel(dotAnims.map(anim => 
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        )),
        // Animate each dot in sequence
        ...dotAnims.map((anim, i) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            delay: i * 200,
            useNativeDriver: true
          })
        )
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  return (
    <View style={[styles.bubbleContainer, { paddingHorizontal: 16 }]}>
      <View style={[styles.wrapper, styles.botWrapper]}>
        <View style={styles.avatarContainer}>
          {/* Avatar without animation for stable positioning */}
          <Image
            source={require("../../images/dobbi-avatar.png")}
            style={styles.logo}
          />
        </View>
        <Animated.View 
          style={[
            styles.container, 
            styles.botBubble,
            {
              paddingVertical: 12,
              paddingHorizontal: 16,
              minWidth: 52,
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
              marginRight: 50
            }
          ]}
        >
          <View style={styles.typingIndicator}>
            {dotAnims.map((anim, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.typingDot,
                  {
                    transform: [{
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4]
                      })
                    }]
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const MessageAnimation = ({ index, children, isUser }) => {
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bubbleAnim, {
      toValue: 1,
      tension: 50,
      friction: 12,
      useNativeDriver: true,
      restSpeedThreshold: 0.1,
      restDisplacementThreshold: 0.1,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        {
          opacity: bubbleAnim,
          transform: [{
            translateX: bubbleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [isUser ? 20 : -20, 0]
            })
          }]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const Banner = ({ isVisible, message, onClose, onCopy, onShare, onReport, onDelete, style }) => {
  const bannerAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(bannerAnim, {
      toValue: isVisible ? 0 : -100,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          transform: [{ translateY: bannerAnim }],
        },
        style,
      ]}
    >
      <View style={styles.bannerContent}>
        <TouchableOpacity 
          style={styles.bannerButton} 
          onPress={() => onCopy(message.text)}
        >
          <View style={styles.buttonInner}>
            <MaterialIcons name="content-copy" size={20} color="#EE6567" />
            <Text style={[styles.bannerText, styles.primaryAction]}>Copy</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.bannerButton} onPress={onShare}>
          <View style={styles.buttonInner}>
            <MaterialIcons name="share" size={20} color="#666" />
            <Text style={styles.bannerText}>Share</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        {message.isUser ? (
          <TouchableOpacity style={styles.bannerButton} onPress={onDelete}>
            <View style={styles.buttonInner}>
              <MaterialIcons name="delete" size={20} color="#FF3B30" />
              <Text style={[styles.bannerText, styles.destructiveAction]}>Delete</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.bannerButton} onPress={onReport}>
            <View style={styles.buttonInner}>
              <MaterialIcons name="flag" size={20} color="#666" />
              <Text style={styles.bannerText}>Report</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="close" size={20} color="#999" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChatBubble = React.forwardRef(({ text, isUser, onPress, isSelected, messageId, disabled }, ref) => {
  const [localSelected, setLocalSelected] = useState(false);
  const [bubbleHeight, setBubbleHeight] = useState(0);
  const bubbleRef = useRef(null);

  useEffect(() => {
    setLocalSelected(isSelected);
  }, [isSelected]);

  // Measure bubble height when selected changes
  useEffect(() => {
    if (isSelected && bubbleRef.current) {
      bubbleRef.current.measure((x, y, width, height) => {
        setBubbleHeight(height);
      });
    }
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
    <View 
      ref={ref}
      style={styles.bubbleContainer}
    >
      <TouchableOpacity
        ref={bubbleRef}
        onLayout={(event) => {
          setBubbleHeight(event.nativeEvent.layout.height);
        }}
        onLongPress={handleLongPress}
        onPress={handlePress}
        delayLongPress={200}
        activeOpacity={disabled ? 1 : 0.9}  
        style={[
          styles.touchableWrapper,
          disabled && styles.disabledWrapper,
          { pointerEvents: disabled ? 'none' : 'auto' }  // Completely disable touch events
        ]}
        delayPressOut={0}
        disabled={disabled}  // Disable touch during transitions
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
    </View>
  );
});

const styles = StyleSheet.create({
  touchableWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden', // Important for ripple effect
  },
  fullWidthOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 101, 103, 0.2)',
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
    flex: 1, // Added to ensure proper text wrapping
  },
  text: {
    fontSize: 15,
    lineHeight: 22, // Increased line height
    flexWrap: 'wrap', // Ensure text wraps properly
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
    margin: 4, // Added margin between paragraphs
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
  banner: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 4,
    paddingVertical: 4, // Reduced from 8
    shadowColor: '#AA6667',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
    height: 40, // Fixed height for compactness
    zIndex: 10,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  bannerButton: {
    flex: 1,
    paddingVertical: 4, // Reduced from 8
    paddingHorizontal: 8, // Reduced from 12
    borderRadius: 6,
    height: '100%',
    justifyContent: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // Reduced from 6
  },
  bannerText: {
    fontSize: 13, // Reduced from 15
    fontWeight: '500',
    color: '#666',
  },
  primaryAction: {
    color: '#EE6567',
  },
  destructiveAction: {
    color: '#FF3B30',
  },
  closeButton: {
    padding: 6, // Reduced from 8
    borderRadius: 16,
    marginLeft: 2, // Reduced from 4
    height: '100%',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 20, // Reduced from 24
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 2, // Reduced from 4
  },
  typingContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 52,
    marginLeft: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginVertical: 2,
  }
});

export default ChatBubble;
export { TypingIndicator, Banner };
