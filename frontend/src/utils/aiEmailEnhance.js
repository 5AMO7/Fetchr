import { GoogleGenAI } from '@google/genai';

// Gemini ai initializaiton
const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here'
});

export class GeminiService {
  constructor() {
    this.ai = genAI;
  }

  async enhanceEmailContent(content, context = {}) {
    try {
      const { tone = 'professional', purpose = 'improve', audience = 'general' } = context;
      
      let prompt = '';
      
      switch (purpose) {
        case 'improve':
          prompt = `Make this email more ${tone}, clear, and engaging. Rules: Keep [{{variable}}](placeholder) format exactly. Preserve [text](url) links. No intro text. Start with improved content.
          ${content}`;
          break;
        case 'expand':
          prompt = `Expand this email with more details, ${tone} tone. Rules: Keep [{{variable}}](placeholder) format exactly. Preserve [text](url) links. No intro text. Start with expanded content.
          ${content}`;
          break;
        case 'shorten':
          prompt = `Make this email concise, ${tone} tone. Rules: Keep [{{variable}}](placeholder) format exactly. Preserve [text](url) links. No intro text. Start with shortened content.
          ${content}`;
          break;
        case 'change_tone':
          prompt = `Rewrite this email with ${tone} tone. Rules: Keep [{{variable}}](placeholder) format exactly. Preserve [text](url) links. No intro text. Start with rewritten content.
          ${content}`;
          break;
        default:
          prompt = `Improve this email for ${audience}, ${tone} tone. Rules: Keep [{{variable}}](placeholder) format exactly. Preserve [text](url) links. No intro text. Start with improved content.
          ${content}`;
      }

      console.log('Sending prompt to AI:', prompt.substring(0, 200) + '...');
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
          parts: [{ text: prompt }]
        }]
      });

      let enhancedContent = response.text.trim();
      
      // Extracts the subject line if it exists
      let extractedSubject = null;
      const subjectMatch = enhancedContent.match(/^Subject:\s*(.+?)(?:\n|$)/i);
      if (subjectMatch) {
        extractedSubject = subjectMatch[1].trim();
        // Removes the subject line from the content
        enhancedContent = enhancedContent.replace(/^Subject:\s*.+?(?:\n|$)/i, '').trim();
      }
      
      // Cleans up any potential intro text that might generate
      const introPatterns = [
        /^Here is your improved[\s\S]*?:/i,
        /^Here is the improved[\s\S]*?:/i,
        /^Here's your improved[\s\S]*?:/i,
        /^Here's the improved[\s\S]*?:/i,
        /^Improved version[\s\S]*?:/i,
        /^Enhanced version[\s\S]*?:/i,
        /^Here is your[\s\S]*?:/i,
        /^Here's your[\s\S]*?:/i
      ];
      
      for (const pattern of introPatterns) {
        enhancedContent = enhancedContent.replace(pattern, '').trim();
      }
      
      console.log('AI Response received:', enhancedContent.substring(0, 200) + '...');
      console.log('AI Response full length:', enhancedContent.length);
      if (extractedSubject) {
        console.log('Extracted subject:', extractedSubject);
      }

      return {
        success: true,
        content: enhancedContent,
        subject: extractedSubject // Inserts the generated subject
      };
    } catch (error) {
      console.error('Error enhancing email content:', error);
      return {
        success: false,
        error: error.message || 'Failed to enhance content'
      };
    }
  }

  async generateEmailSubject(bodyContent, context = {}) {
    try {
      const { tone = 'professional', type = 'general' } = context;
      
      const prompt = `Generate 5 ${tone} email subject lines for this ${type} email. Rules: One per line, no numbering, no intro text.

      ${bodyContent}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: [{
          parts: [{ text: prompt }]
        }]
      });
      
      let responseText = response.text.trim();
      
      // Clean up any intro text
      const introPatterns = [
        /^Here are your[\s\S]*?:/i,
        /^Here are the[\s\S]*?:/i,
        /^Subject lines[\s\S]*?:/i,
        /^Generated subject lines[\s\S]*?:/i
      ];
      
      for (const pattern of introPatterns) {
        responseText = responseText.replace(pattern, '').trim();
      }
      
      const subjects = responseText.split('\n').filter(line => line.trim());
      
      return {
        success: true,
        subjects: subjects.map(subject => subject.trim()),
        original: bodyContent
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate subjects with AI',
        original: bodyContent
      };
    }
  }

  async improveEmailStructure(content) {
    try {
      const prompt = `Restructure this email with better organization, paragraphs, and flow. Rules: Keep [{{variable}}](placeholder) format exactly. Preserve [text](url) links. No intro text. Start with restructured content.

      ${content}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: [{
          parts: [{ text: prompt }]
        }]
      });
      
      let structuredContent = response.text.trim();
      
      // Extracts the subject line if it exists
      let extractedSubject = null;
      const subjectMatch = structuredContent.match(/^Subject:\s*(.+?)(?:\n|$)/i);
      if (subjectMatch) {
        extractedSubject = subjectMatch[1].trim();
        // Removes the subject line from the content
        structuredContent = structuredContent.replace(/^Subject:\s*.+?(?:\n|$)/i, '').trim();
      }
      
      // Cleans up any potential intro text that might generate
      const introPatterns = [
        /^Here is your improved[\s\S]*?:/i,
        /^Here is the improved[\s\S]*?:/i,
        /^Here's your improved[\s\S]*?:/i,
        /^Here's the improved[\s\S]*?:/i,
        /^Improved version[\s\S]*?:/i,
        /^Enhanced version[\s\S]*?:/i,
        /^Here is your[\s\S]*?:/i,
        /^Here's your[\s\S]*?:/i
      ];
      
      for (const pattern of introPatterns) {
        structuredContent = structuredContent.replace(pattern, '').trim();
      }
      
      return {
        success: true,
        content: structuredContent,
        subject: extractedSubject, // Iserts the generated subject
        original: content
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to improve structure with AI',
        original: content
      };
    }
  }
}

export const geminiService = new GeminiService(); 