import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import OpenAI from 'openai';
import { db } from '../lib/firebase';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
});

export const handleChatRequest = async (userId: string, message: string) => {
  try {
    // Get user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const now = new Date();
    const lastTipDate = userData.lastTipDate?.toDate() || null;
    const isNewDay = lastTipDate ? now.toDateString() !== lastTipDate.toDateString() : true;

    // Reset tips if it's a new day
    if (isNewDay) {
      await updateDoc(userRef, {
        tipsLeft: 5,
        lastTipDate: serverTimestamp()
      });
      userData.tipsLeft = 5;
    }

    // Check remaining tips for non-premium users
    if (userData.tier !== 'premium' && (!userData.tipsLeft || userData.tipsLeft <= 0)) {
      throw new Error('No tips remaining for today');
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable fitness trainer and nutritionist. Provide concise, accurate advice about workouts, nutrition, and general fitness.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response';

    // Log chat in Firestore
    const chatLogsRef = collection(db, 'chatLogs');
    await addDoc(chatLogsRef, {
      userId,
      timestamp: serverTimestamp(),
      userMessage: message,
      aiResponse,
    });

    // Decrement tips for non-premium users
    if (userData.tier !== 'premium') {
      await updateDoc(userRef, {
        tipsLeft: (userData.tipsLeft || 5) - 1
      });
    }

    return {
      response: aiResponse,
      tipsLeft: userData.tier === 'premium' ? 'unlimited' : userData.tipsLeft - 1
    };
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};