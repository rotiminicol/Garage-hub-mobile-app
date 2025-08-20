import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withRepeat, useSharedValue } from 'react-native-reanimated';
import { ArrowRight, Phone, Video, MoreHorizontal, Paperclip, Smile, Mic, Check, ArrowLeft, Plus } from 'lucide-react-native';

// Black starfield on white background
function StarDot({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const v = useSharedValue(0.2 + Math.random() * 0.5);
  useEffect(() => { v.value = withRepeat(withTiming(1, { duration: 1600 + Math.random() * 1400 }), -1, true); }, []);
  const s = useAnimatedStyle(() => ({ opacity: v.value }));
  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size/2, backgroundColor: '#000' }, s]} />
  );
}
function StarsLayer() {
  const stars = useMemo(() => new Array(40).fill(0).map(() => ({
    x: Math.random() * 1000,
    y: Math.random() * 1800,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 1500,
  })), []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s, i) => <StarDot key={i} {...s} />)}
    </View>
  );
}

import { useNavigation } from 'expo-router';

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const navigation: any = useNavigation();
  const [newMessage, setNewMessage] = useState('');
  const [query, setQuery] = useState('');

  const sendScale = useSharedValue(1);

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Is the space still available?',
      time: '2 min ago',
      unread: 2,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      online: true,
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Thanks for the quick response!',
      time: '1 hour ago',
      unread: 0,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      online: false,
    },
    {
      id: 3,
      name: 'Emma Wilson',
      lastMessage: 'Can we schedule a viewing?',
      time: '3 hours ago',
      unread: 1,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      online: true,
    },
  ];

  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm interested in your downtown storage space.", sender: 'them', time: '10:30 AM' },
    { id: 2, text: "Hello! Yes, it's still available. Would you like to know more details?", sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'That would be great! What are the dimensions and security features?', sender: 'them', time: '10:35 AM' },
    { id: 4, text: "It's 300 sq ft with 24/7 monitoring, keypad access, and climate control.", sender: 'me', time: '10:36 AM' },
    { id: 5, text: 'Perfect! Is the space still available for next month?', sender: 'them', time: '10:38 AM' },
  ] as Array<{ id: number; text: string; sender: 'me' | 'them'; time: string }>);
  const scrollRef = useRef<ScrollView | null>(null);

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
  }, [query]);

  const openChat = (chatId: number) => {
    setSelectedChat(chatId);
  };

  const closeChat = () => {
    setSelectedChat(null);
  };

  useEffect(() => {
    // Hide tab bar when a chat is open
    navigation?.setParams?.({ hideTabBar: !!selectedChat });
  }, [selectedChat]);

  const TypingIndicator = () => {
    const d1 = useSharedValue(0.3);
    const d2 = useSharedValue(0.3);
    const d3 = useSharedValue(0.3);

    useEffect(() => {
      d1.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
      d2.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
      d3.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    }, []);

    const s1 = useAnimatedStyle(() => ({ opacity: d1.value }));
    const s2 = useAnimatedStyle(() => ({ opacity: d2.value }));
    const s3 = useAnimatedStyle(() => ({ opacity: d3.value }));

    return (
      <View style={styles.typingRow}>
        <Animated.View style={[styles.typingDot, s1]} />
        <Animated.View style={[styles.typingDot, s2]} />
        <Animated.View style={[styles.typingDot, s3]} />
      </View>
    );
  };

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  const onSendPressIn = () => { sendScale.value = withTiming(0.95, { duration: 80 }); };
  const onSendPressOut = () => { sendScale.value = withTiming(1, { duration: 120 }); };

  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const hour12 = ((hh + 11) % 12) + 1;
    const timeLabel = `${hour12}:${mm} ${ampm}`;
    setMessages(prev => [...prev, { id: prev.length + 1, text, sender: 'me', time: timeLabel }]);
    setNewMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const ChatList = () => (
    <View style={styles.chatList}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.composeBtn} activeOpacity={0.9}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() => openChat(conversation.id)}
              activeOpacity={0.85}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
                {conversation.online && <View style={styles.onlineIndicator} />}
              </View>

              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{conversation.name}</Text>
                  <Text style={styles.conversationTime}>{conversation.time}</Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                  {conversation.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conversation.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  const ChatView = () => {
    const activeChat = conversations.find(c => c.id === selectedChat);
    if (!activeChat) return null;

    return (
      <KeyboardAvoidingView 
        style={styles.chatView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={closeChat} style={styles.backButton}>
              <ArrowLeft size={24} color="#111111" />
            </TouchableOpacity>

            <View style={styles.chatHeaderInfo}>
              <Image source={{ uri: activeChat.avatar }} style={styles.chatAvatar} />
              <View>
                <Text style={styles.chatName}>{activeChat.name}</Text>
                <Text style={styles.chatStatus}>
                  {activeChat.online ? 'Online' : 'Last seen 2h ago'}
                </Text>
              </View>
            </View>

            <View style={styles.chatActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color="#111111" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Video size={20} color="#111111" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MoreHorizontal size={20} color="#111111" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={styles.messagesContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            ref={scrollRef as any}
          >
            {/* Date separator */}
            <View style={styles.dateChip}><Text style={styles.dateChipText}>Today</Text></View>

            {messages.map((message) => (
              <View
                key={message.id}
                style={[styles.messageWrapper, message.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper]}
              >
                {message.sender === 'me' ? (
                  <View style={[styles.messageBubble, styles.myMessage]}>
                    <Text style={[styles.messageText, styles.myMessageText]}>{message.text}</Text>
                    <View style={styles.metaRow}>
                      <Text style={[styles.messageTime, styles.myMessageTime]}>{message.time}</Text>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.messageBubble, styles.theirMessage]}>
                    <Text style={[styles.messageText, styles.theirMessageText]}>{message.text}</Text>
                    <Text style={styles.messageTime}>{message.time}</Text>
                  </View>
                )}
              </View>
            ))}

            {/* Typing indicator (example) */}
            <View style={[styles.messageWrapper, styles.theirMessageWrapper]}>
              <View style={[styles.messageBubble, styles.theirMessage]}>
                <TypingIndicator />
              </View>
            </View>
          </ScrollView>

          <View style={styles.messageInputContainer}>
            <View style={styles.messageInput}>
              <TouchableOpacity style={styles.iconBtnSoft}>
                <Smile size={20} color="#111111" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtnSoft}>
                <Paperclip size={20} color="#111111" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />

              {newMessage.trim().length === 0 ? (
                <TouchableOpacity style={styles.micBtn}>
                  <Mic size={20} color="#111111" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPressIn={onSendPressIn}
                  onPressOut={onSendPressOut}
                  onPress={sendMessage}
                  activeOpacity={0.9}
                >
                  <Animated.View style={[styles.sendBtn, sendButtonStyle]}>
                    <View style={styles.sendArrowBtn}>
                      <ArrowRight size={20} color="#FFFFFF" />
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <StarsLayer />
        <View style={styles.content}>
          {selectedChat ? <ChatView /> : <ChatList />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  gradient: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  content: { 
    flex: 1 
  },
  safeArea: {
    flex: 1,
  },

  // Header & list
  header: { 
    padding: 20, 
    paddingTop: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#111111' 
  },
  composeBtn: { 
    backgroundColor: '#111111', 
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)' 
  },
  chatList: { 
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  searchWrap: { 
    padding: 16, 
    paddingTop: 12, 
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  searchInput: { 
    backgroundColor: '#F3F4F6', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    color: '#111827', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 12,
    fontSize: 16
  },

  conversationItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20,
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  avatarContainer: { 
    position: 'relative', 
    marginRight: 16 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
  onlineIndicator: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    width: 12, 
    height: 12, 
    backgroundColor: '#10b981', 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: '#ffffff' 
  },
  conversationInfo: { 
    flex: 1 
  },
  conversationHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  conversationName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#111111' 
  },
  conversationTime: { 
    fontSize: 12, 
    color: '#9ca3af' 
  },
  conversationFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  lastMessage: { 
    fontSize: 14, 
    color: '#6B7280', 
    flex: 1 
  },
  unreadBadge: { 
    backgroundColor: '#fbbf24', 
    borderRadius: 10, 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  unreadText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#1a1f3a' 
  },

  // Chat view
  chatView: { 
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  chatHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  backButton: { 
    marginRight: 16 
  },
  chatHeaderInfo: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  chatAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 12 
  },
  chatName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111111' 
  },
  chatStatus: { 
    fontSize: 12, 
    color: '#9ca3af' 
  },
  chatActions: { 
    flexDirection: 'row', 
    gap: 12 
  },
  actionButton: { 
    padding: 8 
  },

  messagesContainer: { 
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  messagesContent: {
    paddingHorizontal: 16, 
    paddingVertical: 16,
  },
  dateChip: { 
    alignSelf: 'center', 
    backgroundColor: '#F3F4F6', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    marginBottom: 16 
  },
  dateChipText: { 
    color: '#6B7280', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  messageWrapper: { 
    marginBottom: 16 
  },
  myMessageWrapper: { 
    alignItems: 'flex-end' 
  },
  theirMessageWrapper: { 
    alignItems: 'flex-start' 
  },

  messageBubble: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 16 
  },
  myMessage: { 
    backgroundColor: '#111111', 
    borderBottomRightRadius: 4 
  },
  theirMessage: { 
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 4, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },

  messageText: { 
    fontSize: 16, 
    lineHeight: 22 
  },
  myMessageText: { 
    color: '#FFFFFF' 
  },
  theirMessageText: { 
    color: '#111111' 
  },
  metaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    gap: 6, 
    marginTop: 6 
  },
  messageTime: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 6 
  },
  myMessageTime: { 
    color: '#E5E7EB' 
  },

  // Message input container (fixed at bottom)
  messageInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  messageInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    gap: 10,
  },
  iconBtnSoft: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F3F4F6', 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#F9FAFB', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    color: '#111827', 
    fontSize: 16, 
    maxHeight: 120, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  micBtn: { 
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  sendBtn: { 
    borderRadius: 20, 
    overflow: 'hidden' 
  },
  sendArrowBtn: { 
    backgroundColor: '#111111', 
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center', 
    justifyContent: 'center'
  },

  typingRow: { 
    flexDirection: 'row', 
    gap: 6 
  },
  typingDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#6B7280' 
  },
});