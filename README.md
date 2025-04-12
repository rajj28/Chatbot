# ABC Lighting Bot

A conversational AI bot for ABC Lighting Company that helps customers with product information, inquiries, and support.

## Features

- Interactive chat interface
- Product information and recommendations
- Contact information collection
- Admin panel with:
  - Conversation history
  - Analytics dashboard
  - Contact management
  - Real-time updates
- Image support for product visualization

## Setup

1. Clone the repository:
```bash
git clone https://github.com/rajj28/Chatbot.git
cd abc-lighting-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your environment variables:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the server:
```bash
npm start
```

5. Access the application:
- Chat interface: http://localhost:3000
- Admin panel: http://localhost:3000/admin.html

## Technologies Used

- Node.js
- Express.js
- OpenAI API
- HTML/CSS/JavaScript
- Bootstrap

## Project Structure

- `server.js` - Main server file
- `public/` - Frontend files
  - `index.html` - Chat interface
  - `admin.html` - Admin panel
  - `images/` - Product images
- `data/` - Data files
  - `company.json` - Company information
  - `products.json` - Product catalog
- `prompts/` - AI prompt templates

## How to Use

1. Start a conversation with "hi" or "hello"
2. Ask about products:
   - "Tell me about your products"
   - "What street lights do you have?"
   - "Show me driveway lights"
3. Request images:
   - "Can I see a picture of that?"
   - "Show me images of your products"
   - "I'd like to see what it looks like"

## License

ISC
