import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_KEYS = {
  CURRENT_CHAT: 'currentChat',
  CHATS_PREFIX: 'chat_',
};

export const chatStorageService = {
  async saveChat(chatId, messages) {
    const chatData = {
      id: chatId,
      messages,
      lastModified: new Date().toISOString(),
      title: messages[0]?.text?.slice(0, 30) || 'New Chat'
    };
    
    await AsyncStorage.setItem(
      `${CHAT_KEYS.CHATS_PREFIX}${chatId}`, 
      JSON.stringify(chatData)
    );
    return chatData;
  },

  async getAllChats() {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter(key => key.startsWith(CHAT_KEYS.CHATS_PREFIX));
    
    const chats = await Promise.all(
      chatKeys.map(async key => {
        const data = await AsyncStorage.getItem(key);
        return JSON.parse(data);
      })
    );

    return chats.sort((a, b) => 
      new Date(b.lastModified) - new Date(a.lastModified)
    );
  },

  async deleteChat(chatId) {
    await AsyncStorage.removeItem(`${CHAT_KEYS.CHATS_PREFIX}${chatId}`);
  },

  async getCurrentChat() {
    return await AsyncStorage.getItem(CHAT_KEYS.CURRENT_CHAT);
  },

  async setCurrentChat(chatId) {
    await AsyncStorage.setItem(CHAT_KEYS.CURRENT_CHAT, chatId);
  }
};
