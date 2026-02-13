# So Fire Fitness

AI-powered fitness platform with personalized training plans, community support, and rewards.

## Serverless Functions

The following serverless functions are implemented in the `/netlify/functions` directory:

### Chat Function

**Endpoint:** `/.netlify/functions/chat`

Handles AI chatbot interactions by communicating with the OpenAI API and managing user tip limits.

#### Request
- **Method:** POST
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {firebase-id-token}
  ```
- **Body:**
  ```json
  {
    "userId": "firebase-generated-uid",
    "message": "User's message to the AI"
  }
  ```

#### Responses

**200 OK**
```json
{
  "response": "AI's response message",
  "tipsLeft": 4
}
```

**400 Bad Request**
```json
{
  "error": "Missing required fields"
}
```

**403 Forbidden**
```json
{
  "error": "No tips remaining for today"
}
```

**404 Not Found**
```json
{
  "error": "User not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

#### Features
- CORS support with preflight request handling
- Firebase authentication integration
- Daily tip limit tracking (5 tips per day for free users)
- Automatic tip reset at midnight
- Chat history logging in Firestore
- Premium user detection for unlimited tips

#### Environment Variables Required
- `FIREBASE_SERVICE_ACCOUNT`: Base64-encoded Firebase service account JSON
- `VITE_OPENAI_API_KEY`: OpenAI API key for AI responses

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Test serverless functions locally:
```bash
netlify dev
```

## Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch.

### Environment Setup

1. Configure environment variables in Netlify:
   - Firebase configuration
   - OpenAI API key
   - Payment processing keys (Stripe/PayPal)

2. Ensure Firebase service account is properly encoded and set in Netlify environment variables.

### Testing Deployed Functions

Use cURL or Postman to test the deployed functions:

```bash
curl -X POST https://sofirefitness.com/.netlify/functions/chat \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {firebase-id-token}" \
-d '{"userId":"user123","message":"What are some good workout tips?"}'
```

## Security

- All serverless functions require Firebase authentication
- Rate limiting is implemented for free users
- CORS is properly configured for the production domain
- Environment variables are securely stored in Netlify