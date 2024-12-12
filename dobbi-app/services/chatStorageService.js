import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_KEYS = {
  CURRENT_CHAT: 'currentChat',
  CHATS_PREFIX: 'chat_',
};

export const chatStorageService = {
  async saveChat(chatId, messages) {
    try {
      await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify({
        messages,
        lastModified: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving chat:', error);
    }
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
    try {
      await AsyncStorage.setItem('lastActiveChatId', chatId);
    } catch (error) {
      console.error('Error setting current chat:', error);
    }
  },

  async getLastActiveChat() {
    try {
      const chatId = await AsyncStorage.getItem('lastActiveChatId');
      if (!chatId) return null;

      const chatData = await AsyncStorage.getItem(`chat_${chatId}`);
      return chatData ? { id: chatId, ...JSON.parse(chatData) } : null;
    } catch (error) {
      console.error('Error getting last active chat:', error);
      return null;
    }
  }
};
