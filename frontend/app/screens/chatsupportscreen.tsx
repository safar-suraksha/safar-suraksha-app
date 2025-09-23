import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Props type for ChatSupportScreen with route params
type ChatSupportScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatSupport'>;

const { width } = Dimensions.get("window");

export default function ChatSupportScreen({ route, navigation }: ChatSupportScreenProps) {
  const { userData } = route.params;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `Hello ${userData?.fullName}! I'm your AI Safety Assistant. I'm here to help you stay safe during your travels in India. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      typingAnim.stopAnimation();
    }
  });

  const quickReplies = [
    { text: "Safety tips for my location", action: "safety-tips" },
    { text: "Report suspicious activity", action: "report" },
    { text: "Find nearest hospital", action: "hospital" },
    { text: "Emergency contacts", action: "emergency" },
  ];

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("safety") || lowerMessage.includes("safe")) {
      return `Here are safety tips for ${userData.currentLocation}:\n\n• Stay in well-lit, populated areas\n• Keep important documents secured\n• Share your location with emergency contacts\n• Trust your instincts and avoid risky situations\n• Use registered taxis/ride services\n\nWould you like specific information about any area?`;
    }

    if (lowerMessage.includes("emergency") || lowerMessage.includes("help")) {
      return `In case of emergency:\n\n🚨 Tourist Helpline: 1363\n🚓 Police: 100\n🏥 Medical: 108\n🔥 Fire: 101\n\nYour current location (${userData.currentLocation}) has been noted. Should I connect you with emergency services?`;
    }

    if (lowerMessage.includes("hospital") || lowerMessage.includes("medical")) {
      return `Based on your location (${userData.currentLocation}), here are nearby medical facilities:\n\n🏥 AIIMS New Delhi - 2.3 km\n🏥 Max Super Speciality Hospital - 1.8 km\n🏥 Apollo Hospital - 3.1 km\n\nFor medical emergencies, call 108. Would you like directions to any of these?`;
    }

    return `I understand you're asking about "${message}". I'm here to help with:\n\n• Safety tips & local information\n• Emergency assistance\n• Reporting issues\n• Transportation guidance\n• Medical facility locations\n\nCould you be more specific about what you need help with?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: { text: string; action: string }) => {
    setInputMessage(reply.text);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.botAvatar}>
              <Text style={styles.botIcon}>🤖</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>AI Safety Assistant</Text>
              <View style={styles.onlineStatus}>
                <Animated.View style={[styles.onlineIndicator, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.type === "user" ? styles.userMessageWrapper : styles.botMessageWrapper,
              ]}
            >
              <View style={[styles.messageBubble, message.type === "user" ? styles.userMessage : styles.botMessage]}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageIcon}>{message.type === "bot" ? "🤖" : "👤"}</Text>
                  <Text
                    style={[
                      styles.messageText,
                      message.type === "user" ? styles.userMessageText : styles.botMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
                <View style={styles.messageFooter}>
                  <Text
                    style={[
                      styles.messageTime,
                      message.type === "user" ? styles.userMessageTime : styles.botMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.botMessageWrapper}>
              <View style={styles.typingBubble}>
                <View style={styles.typingContent}>
                  <Text style={styles.messageIcon}>🤖</Text>
                  <View style={styles.typingDots}>
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Replies */}
        {messages.length <= 2 && (
          <View style={styles.quickRepliesContainer}>
            <Text style={styles.quickRepliesTitle}>Quick replies:</Text>
            <View style={styles.quickRepliesGrid}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity key={index} onPress={() => handleQuickReply(reply)} style={styles.quickReplyButton}>
                  <Text style={styles.quickReplyText}>{reply.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={handleSendMessage}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
              multiline
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={[styles.sendButton, inputMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyIcon}>⚠️</Text>
          <Text style={styles.emergencyText}>For immediate emergencies, call 1363</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  backIcon: {
    fontSize: 20,
    color: "#374151",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  botAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  botIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#10B981",
    borderRadius: 4,
    marginRight: 8,
  },
  onlineText: {
    fontSize: 14,
    color: "#10B981",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
    paddingBottom: 32,
  },
  messageWrapper: {
    marginBottom: 8,
    paddingHorizontal: 8,
    alignItems: "flex-start", // This allows dynamic width
  },
  userMessageWrapper: {
    alignItems: "flex-end", // Align user messages to right
  },
  botMessageWrapper: {
    alignItems: "flex-start", // Align bot messages to left
  },
  messageBubble: {
    // Remove fixed width constraints - let content determine size
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: width * 0.75, // Maximum width constraint
    // No minWidth - let content determine minimum size
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // This is key - let the bubble size itself based on content
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#3B82F6",
    borderBottomRightRadius: 4,
    alignSelf: "flex-end", // User messages align to right
  },
  botMessage: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
    alignSelf: "flex-start", // Bot messages align to left
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  messageIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    // Remove flex: 1 to allow natural text wrapping
    flexShrink: 1, // Allow text to shrink and wrap naturally
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  botMessageText: {
    color: "#374151",
  },
  messageFooter: {
    marginTop: 4,
    alignItems: "flex-end",
    // Remove fixed padding - let it align naturally
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "400",
    marginTop: 2,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  botMessageTime: {
    color: "#9CA3AF",
  },
  typingBubble: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    // Dynamic sizing for typing indicator too
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDots: {
    flexDirection: "row",
    marginLeft: 6,
  },
  typingDot: {
    width: 6,
    height: 6,
    backgroundColor: "#9CA3AF",
    borderRadius: 3,
    marginHorizontal: 1,
  },
  quickRepliesContainer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  quickRepliesTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    fontWeight: "500",
  },
  quickRepliesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Let quick replies also size themselves naturally
  },
  quickReplyText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#374151",
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonActive: {
    backgroundColor: "#3B82F6",
  },
  sendButtonInactive: {
    backgroundColor: "#E5E7EB",
  },
  sendIcon: {
    fontSize: 18,
    color: "#FFFFFF",
    marginLeft: 2,
  },
  emergencyBanner: {
    backgroundColor: "#EF4444",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
