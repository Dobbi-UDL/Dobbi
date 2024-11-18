export async function getOpenAIResponse(messages) {
    const apiKey = 'xai-wLQwbVPQ2XVUiid5jzw8JSS3JX3D68ISPajOJqC3k31k2Xd9bF1qAjZj8SYDNrwmT4197vIX9LnDdoiE'; // Replace with your actual key or use secure methods to retrieve it.
  
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-beta', // Replace with 'gpt-3.5-turbo' or another model if needed
          messages: messages,
          temperature: 1,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.choices[0].message.content;
      } else {
        console.error('Error:', data);
        throw new Error(data.error.message || 'An error occurred while fetching the response');
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
  
  