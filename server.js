// server.js - Main server file for mock OpenAI API
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Load datasets
const companyData = require('./data/company.json');
const productsData = require('./data/products.json');

// Track conversation state
const conversations = {};
const contactInfo = {};

// Store conversation history and analytics
const conversationHistory = {};
const analytics = {
    topQuestions: {},
    popularProducts: {},
    sessionDurations: []
};

// Track session start time
app.use((req, res, next) => {
    if (req.path === '/chat' && req.method === 'POST') {
        const userId = req.body.userId;
        if (!conversationHistory[userId]) {
            conversationHistory[userId] = {
                startTime: Date.now(),
                messages: []
            };
        }
    }
    next();
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Helper function to validate contact information
function validateContactInfo(info) {
    const { name, email, phone } = info;
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Please provide a valid name');
    }
    if (!email || !isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }
    if (!phone || !isValidPhone(phone)) {
        errors.push('Please provide a valid phone number');
    }
    
    return errors;
}

// Contact information endpoint
app.post('/contact', (req, res) => {
    const { userId, contactInfo: info } = req.body;
    
    if (!userId || !info) {
        return res.status(400).json({ success: false, message: 'Missing required information' });
    }
    
    const errors = validateContactInfo(info);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    
    contactInfo[userId] = info;
    res.json({ success: true, message: 'Contact information saved successfully' });
});

// Get contact information endpoint (admin only)
app.get('/admin/contacts', (req, res) => {
    res.json(contactInfo);
});

// Main chat completion endpoint
app.post('/v1/chat/completions', (req, res) => {
  console.log('Received request:', req.body);
  const { messages, user } = req.body;
  
  // Initialize conversation state if it doesn't exist
  if (!conversations[user]) {
    conversations[user] = {
      askedForContact: false,
      sharedProducts: false,
      currentProduct: null,
      endingConversation: false
    };
  }
  
  const userState = conversations[user];
  const userMessage = messages[messages.length - 1].content.toLowerCase();
  
  console.log('Processing message:', userMessage);
  console.log('User state:', userState);
  
  // Process user message and generate response
  let botResponse = generateResponse(userMessage, userState);
  
  console.log('Generated response:', botResponse);
  
  // Format response to match OpenAI API structure
  res.json({
    id: 'chatcmpl-' + Math.random().toString(36).substring(2, 12),
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'abc-lighting-bot',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: botResponse
        },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens: countTokens(messages),
      completion_tokens: countTokens(botResponse),
      total_tokens: countTokens(messages) + countTokens(botResponse)
    }
  });
});

// Image serving endpoint
app.get('/images/:productId', (req, res) => {
  const productId = req.params.productId;
  const imagePath = path.join(__dirname, 'public/images', `${productId}.jpg`);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send('Image not found');
  }
});

// Reset conversation state endpoint (for admin panel)
app.post('/admin/reset/:userId', (req, res) => {
  const userId = req.params.userId;
  
  if (conversations[userId]) {
    delete conversations[userId];
    res.json({ success: true, message: `Conversation state for ${userId} has been reset` });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// Admin panel endpoint for viewing conversation states
app.get('/admin/conversations', (req, res) => {
  res.json(conversations);
});

// Helper function to generate responses
function generateResponse(message, state) {
  let response = '';
  
  // Check if user is ending the conversation
  if (state.endingConversation && 
     (message.includes('no') || message.includes('that\'s all') || message.includes('bye'))) {
    
    if (!state.askedForContact) {
      state.askedForContact = true;
      return "I'd be happy to conclude our conversation. Before you go, could you please share your contact information (name, email, and phone number) so we can reach out if we have any follow-up information about our products?";
    } else {
      // User already provided contact info or declined
      return "Thank you for contacting ABC Lighting Company. Have a great day!";
    }
  }
  
  // Process normal conversation flow
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    response = `Welcome to ABC Lighting Company! I'm your virtual assistant. ${companyData.greeting} How can I help you today?`;
  } 
  else if (message.includes('hour') || message.includes('open')) {
    response = `Our business hours are: ${companyData.businessHours}`;
  } 
  else if (message.includes('location') || message.includes('address') || message.includes('where')) {
    response = `We have locations at:\n1. ${companyData.locations[0]}\n2. ${companyData.locations[1]}`;
  } 
  else if (message.includes('product') || message.includes('what do you sell') || message.includes('offer')) {
    state.sharedProducts = true;
    response = `We offer the following solar-powered lighting solutions:\n`;
    
    productsData.forEach(product => {
      response += `- ${product.name}: ${product.shortDescription}\n`;
    });
    
    response += `\nWould you like to know more about any specific product?`;
  } 
  else if (message.includes('street light') || message.includes('streetlight')) {
    state.currentProduct = 'street-light';
    const product = productsData.find(p => p.id === 'street-light');
    response = generateProductResponse(product, message);
  } 
  else if (message.includes('driveway') || message.includes('drive way')) {
    state.currentProduct = 'driveway-light';
    const product = productsData.find(p => p.id === 'driveway-light');
    response = generateProductResponse(product, message);
  } 
  else if (message.includes('wall light') || message.includes('wall-light')) {
    state.currentProduct = 'wall-light';
    const product = productsData.find(p => p.id === 'wall-light');
    response = generateProductResponse(product, message);
  } 
  else if (message.includes('image') || message.includes('picture') || message.includes('photo')) {
    if (state.currentProduct) {
      const product = productsData.find(p => p.id === state.currentProduct);
      response = `Here's an image of our ${product.name}:\n\n[Image URL: http://localhost:3000/images/${state.currentProduct}]`;
    } else {
      response = "I'd be happy to show you product images. Which product are you interested in seeing? We have street lights, driveway lights, and wall lights.";
    }
  } 
  else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    if (state.currentProduct) {
      const product = productsData.find(p => p.id === state.currentProduct);
      response = `The ${product.name} is priced at ${product.price}. Would you like more information about this product?`;
    } else {
      response = "I'd be happy to provide pricing information. Which of our products are you interested in? We offer street lights, driveway lights, and wall lights.";
    }
  } 
  else if (message.includes('warranty') || message.includes('guarantee')) {
    if (state.currentProduct) {
      const product = productsData.find(p => p.id === state.currentProduct);
      response = `The ${product.name} comes with a ${product.warranty} warranty. Our warranty covers manufacturing defects and normal usage issues.`;
    } else {
      response = "All our products come with competitive warranties. Which specific product would you like warranty information for?";
    }
  } 
  else if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
    state.askedForContact = true;
    return "Please provide your contact information in the following format:\n" +
           "Name: [Your Name]\n" +
           "Email: [Your Email]\n" +
           "Phone: [Your Phone Number]";
  } 
  else {
    // Default response for messages we don't recognize
    response = "I'm not sure I understood your question. As a customer service representative for ABC Lighting Company, I can help with information about our solar lighting products, store locations, business hours, and product specifications. How can I assist you today?";
  }
  
  // Check if we need to ask the follow-up question
  state.endingConversation = true;
  return response + "\n\nIs there anything else I can help you with?";
}

// Helper function to generate product-specific responses
function generateProductResponse(product, message) {
  if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    return `The ${product.name} is priced at ${product.price}. Would you like more information about this product?`;
  } 
  else if (message.includes('warranty') || message.includes('guarantee')) {
    return `The ${product.name} comes with a ${product.warranty} warranty. Our warranty covers manufacturing defects and normal usage issues.`;
  }
  else if (message.includes('image') || message.includes('picture') || message.includes('photo')) {
    return `Here's an image of our ${product.name}:\n\n[Image URL: http://localhost:3000/images/${product.id}]`;
  }
  else {
    return `About our ${product.name}:\n${product.description}\n\nKey specifications:\n` +
      Object.entries(product.specifications)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n') +
      `\n\nWould you like to see an image of the ${product.name}?`;
  }
}

// Simple token counter for usage metrics
function countTokens(text) {
  if (typeof text === 'object') {
    text = JSON.stringify(text);
  }
  return Math.ceil(text.length / 4);
}

// Update analytics
function updateAnalytics(userId, message, product) {
    // Track questions
    if (message.role === 'user') {
        analytics.topQuestions[message.content] = (analytics.topQuestions[message.content] || 0) + 1;
    }
    
    // Track products
    if (product) {
        analytics.popularProducts[product] = (analytics.popularProducts[product] || 0) + 1;
    }
    
    // Track session duration
    if (message.role === 'user' && message.content.toLowerCase().includes('bye')) {
        const session = conversationHistory[userId];
        if (session) {
            const duration = Date.now() - session.startTime;
            analytics.sessionDurations.push(duration);
            // Keep only last 100 sessions for average calculation
            if (analytics.sessionDurations.length > 100) {
                analytics.sessionDurations.shift();
            }
        }
    }
}

// Store messages in conversation history
function storeMessage(userId, message) {
    if (!conversationHistory[userId]) {
        conversationHistory[userId] = {
            startTime: Date.now(),
            messages: []
        };
    }
    conversationHistory[userId].messages.push(message);
}

// Update the chat endpoint to store messages
app.post('/chat', async (req, res) => {
    const { message, userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Store user message
    storeMessage(userId, { role: 'user', content: message });
    
    const response = await generateResponse(message, userId);
    
    // Store bot response
    storeMessage(userId, { role: 'assistant', content: response });
    
    // Update analytics
    updateAnalytics(userId, { role: 'user', content: message }, conversations[userId]?.currentProduct);
    
    res.json({ response });
});

// Admin endpoints
app.get('/admin/conversations', (req, res) => {
    const conversations = {};
    for (const [userId, state] of Object.entries(conversations)) {
        conversations[userId] = {
            ...state,
            messages: conversationHistory[userId]?.messages || []
        };
    }
    res.json(conversations);
});

app.get('/admin/contacts', (req, res) => {
    res.json(contactInfo);
});

app.get('/admin/analytics', (req, res) => {
    res.json(analytics);
});

app.post('/admin/reset/:userId', (req, res) => {
    const userId = req.params.userId;
    delete conversations[userId];
    delete conversationHistory[userId];
    res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Mock OpenAI API server running at http://localhost:${PORT}`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin.html`);
});