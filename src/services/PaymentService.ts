import { auth } from '../lib/firebase';

class PaymentService {
  private async getIdToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.getIdToken(true);
  }

  async createCheckoutSession(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/.netlify/functions/createCheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getIdToken()}`
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email
        })
      });

      if (!response.ok) {
        let errorMessage = 'Payment processing failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get the raw text
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!data.sessionUrl) {
        console.error('Invalid checkout response:', data);
        throw new Error('Invalid checkout response from server');
      }

      return data.sessionUrl;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  async redirectToCheckout(): Promise<void> {
    try {
      const checkoutUrl = await this.createCheckoutSession();
      if (!checkoutUrl) {
        throw new Error('Invalid checkout URL');
      }
      
      // Log the redirect
      console.log('Redirecting to checkout:', checkoutUrl);
      
      // Perform the redirect
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Redirect error:', error);
      throw error;
    }
  }
}

export default new PaymentService();