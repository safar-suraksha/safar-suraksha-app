"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
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
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatSupportScreenProps {
  userData: any
  onBack: () => void
}

const { width } = Dimensions.get("window")

export function ChatSupportScreen({ userData, onBack }: ChatSupportScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `Hello ${userData.fullName}! I'm your AI Safety Assistant. I'm here to help you stay safe during your travels in India. How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const typingAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Pulse animation for online indicator
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
    ).start()
  }, [])

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
      ).start()
    } else {
      typingAnim.stopAnimation()
    }
  }, [isTyping])

  const quickReplies = [
    { text: "Safety tips for my location", action: "safety-tips" },
    { text: "Report suspicious activity", action: "report" },
    { text: "Find nearest hospital", action: "hospital" },
    { text: "Emergency contacts", action: "emergency" },
  ]

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("safety") || lowerMessage.includes("safe")) {
      return `Here are safety tips for ${userData.currentLocation}:\n\n• Stay in well-lit, populated areas\n• Keep important documents secured\n• Share your location with emergency contacts\n• Trust your instincts and avoid risky situations\n• Use registered taxis/ride services\n\nWould you like specific information about any area?`
    }

    if (lowerMessage.includes("emergency") || lowerMessage.includes("help")) {
      return `In case of emergency:\n\n🚨 Tourist Helpline: 1363\n🚓 Police: 100\n🏥 Medical: 108\n🔥 Fire: 101\n\nYour current location (${userData.currentLocation}) has been noted. Should I connect you with emergency services?`
    }

    if (lowerMessage.includes("hospital") || lowerMessage.includes("medical")) {
      return `Based on your location (${userData.currentLocation}), here are nearby medical facilities:\n\n🏥 AIIMS New Delhi - 2.3 km\n🏥 Max Super Speciality Hospital - 1.8 km\n🏥 Apollo Hospital - 3.1 km\n\nFor medical emergencies, call 108. Would you like directions to any of these?`
    }

    return `I understand you're asking about "${message}". I'm here to help with:\n\n• Safety tips & local information\n• Emergency assistance\n• Reporting issues\n• Transportation guidance\n• Medical facility locations\n\nCould you be more specific about what you need help with?`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply: { text: string; action: string }) => {
    setInputMessage(reply.text)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
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
  )
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
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  userMessageWrapper: {
    alignItems: "flex-end",
  },
  botMessageWrapper: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: "#3B82F6",
  },
  botMessage: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  messageIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  botMessageText: {
    color: "#374151",
  },
  messageFooter: {
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: 12,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  botMessageTime: {
    color: "#9CA3AF",
  },
  typingBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDots: {
    flexDirection: "row",
    marginLeft: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    backgroundColor: "#9CA3AF",
    borderRadius: 4,
    marginHorizontal: 2,
  },
  quickRepliesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  quickRepliesTitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  quickRepliesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickReplyText: {
    fontSize: 14,
    color: "#374151",
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
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: "#374151",
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: "#3B82F6",
  },
  sendButtonInactive: {
    backgroundColor: "#F3F4F6",
  },
  sendIcon: {
    fontSize: 16,
    color: "#FFFFFF",
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
})
