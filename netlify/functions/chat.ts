import { Handler } from '@netlify/functions';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import OpenAI from 'openai';

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, 'base64').toString('utf-8')
  );

  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request body' })
      };
    }

    const { userId, message } = JSON.parse(event.body);

    if (!userId || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    const userData = userDoc.data()!;
    const now = new Date();
    const lastTipDate = userData.lastTipDate?.toDate();
    const isNewDay = lastTipDate ? now.toDateString() !== lastTipDate.toDateString() : true;

    // Reset tips if it's a new day
    if (isNewDay) {
      await userRef.update({
        tipsLeft: 5,
        lastTipDate: now
      });
      userData.tipsLeft = 5;
    }

    // Check remaining tips for non-premium users
    if (userData.tier !== 'premium' && (!userData.tipsLeft || userData.tipsLeft <= 0)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'No tips remaining for today' })
      };
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
    await db.collection('chatLogs').add({
      userId,
      messages: [
        {
          role: 'user',
          text: message,
          timestamp: now
        },
        {
          role: 'assistant',
          text: aiResponse,
          timestamp: now
        }
      ],
      timestamp: now
    });

    // Decrement tips for non-premium users
    if (userData.tier !== 'premium') {
      await userRef.update({
        tipsLeft: (userData.tipsLeft || 5) - 1,
        updatedAt: now
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        tipsLeft: userData.tier === 'premium' ? 'unlimited' : userData.tipsLeft - 1
      })
    };
  } catch (error) {
    console.error('Chat error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};