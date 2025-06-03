# AI Email Enhancement Setup

This guide explains how to set up the AI email enhancement functionality powered by Google's Gemini API using the latest `@google/genai` SDK.

## Prerequisites

1. A Google Cloud account
2. Access to the Gemini API

## Setup Steps

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the generated API key

### 2. Configure Environment Variables

1. Create a `.env` file in the `frontend` directory (if it doesn't exist)
2. Add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your actual API key to version control. Add `.env` to your `.gitignore` file.

### 3. Install Dependencies

The project uses the latest `@google/genai` package (automatically installed during setup):

```bash
npm install @google/genai
```

### 4. Restart the Development Server

After adding the environment variable, restart your Vite development server:

```bash
npm run dev
```

## Features

The AI Email Enhancement component provides the following features:

### Content Enhancement
- **Improve Overall**: Makes the email more professional, clear, and engaging
- **Expand & Add Details**: Adds more comprehensive information and examples
- **Make More Concise**: Shortens the content while maintaining key messages
- **Change Tone**: Adjusts the tone (professional, friendly, formal, casual, etc.)

### Structure Improvement
- Organizes content with better paragraphs and logical flow
- Improves readability with clear sections
- Ensures proper introduction, body, and conclusion

### Subject Line Generation
- Generates 3-5 compelling subject lines based on email content
- Considers tone and email type for better targeting
- Provides clickable options to apply directly

## Usage

1. Navigate to any email template creation/editing page
2. Enter some content in the email body
3. Click the "Enhance with AI" button
4. Select your enhancement options (tone, type, audience)
5. Choose from "Enhance Content" or "Generate Subjects" tabs
6. Apply the AI suggestions

## Configuration Options

- **Tone**: Professional, Friendly, Formal, Casual, Persuasive, Urgent, Warm, Confident
- **Email Type**: General, Sales, Follow-up, Introduction, Thank You, Announcement, Invitation
- **Target Audience**: General, Clients, Prospects, Colleagues, Executives, Customers

## Technical Details

This implementation uses:
- **Package**: `@google/genai` (latest official Google Gen AI SDK)
- **Model**: `gemini-2.0-flash-001` (latest Gemini 2.0 model)
- **API**: Google Gemini Developer API

## Important Notes

- All placeholder variables (like `{{name}}`, `{{company}}`) are preserved during AI enhancement
- AI suggestions should be reviewed before use
- The component requires internet connectivity to access the Gemini API
- API usage may be subject to Google's rate limits and pricing

## Troubleshooting

### Common Issues

1. **"Failed to enhance content" error**
   - Check that your API key is correctly set in the `.env` file
   - Verify the API key is valid and has proper permissions
   - Check your internet connection
   - Ensure you're using the correct environment variable name: `VITE_GEMINI_API_KEY`

2. **Component not loading**
   - Ensure you've restarted the development server after adding the environment variable
   - Check the browser console for any JavaScript errors
   - Verify the `@google/genai` package is properly installed

3. **Empty responses**
   - Make sure you have content in the email body before trying to enhance
   - Try different enhancement options if one doesn't work
   - Check that your API key has proper permissions for the Gemini API

4. **Import/Module errors**
   - Ensure you're using the correct package: `@google/genai` (not the deprecated `@google/generative-ai`)
   - Clear your node_modules and reinstall if needed: `rm -rf node_modules package-lock.json && npm install`

### Support

If you continue to experience issues, check:
- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Google Gen AI SDK Documentation](https://googleapis.github.io/js-genai/)
- [Gemini API Documentation](https://ai.google.dev/api)

## Security Considerations

- Keep your API key secure and never expose it publicly
- Consider implementing API key rotation for production environments
- Monitor your API usage in the Google Cloud Console
- Be aware of data privacy when sending email content to external APIs

## Migration Notes

If you previously used `@google/generative-ai`, this implementation uses the newer `@google/genai` package which:
- Provides better support for Gemini 2.0 features
- Has a more streamlined API
- Is actively maintained and receives new features
- Uses the latest `gemini-2.0-flash-001` model for better performance 