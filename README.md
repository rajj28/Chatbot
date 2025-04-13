# ABC Lighting Bot

A Postman-based customer service chatbot for ABC Lighting Company that provides information about solar lighting products and company details.

## Project Overview

This project implements a conversational AI bot that:
- Provides information about ABC Lighting Company and its products
- Handles customer inquiries about three solar-powered lighting products
- Displays product images upon request
- Collects contact information when appropriate
- Uses a structured dataset approach with parent and child data levels

## Features

### Company Information
- Business hours: Monday-Friday 9:00 AM - 6:00 PM, Saturday 10:00 AM - 4:00 PM
- Two locations:
  - Main Office: 123 Solar Street, Sunnyvale, CA 94085
  - Showroom: 456 Renewable Road, San Jose, CA 95112

### Product Catalog
1. **SolarBright Pro Street Light**
   - High-performance solar street light for urban areas
   - 30W Monocrystalline Solar Panel
   - 24000mAh Lithium-ion battery
   - 2000 lumens output
   - 12-14 hours operating time per charge
   - 5-year warranty
   - Price: $599.99

2. **SolarPath Driveway Illuminator**
   - Energy-efficient lighting for residential driveways
   - 10W Polycrystalline Solar Panel
   - 8000mAh Lithium-ion battery
   - 650 lumens output
   - 8-10 hours operating time per charge
   - 3-year warranty
   - Price: $129.99

3. **SolarGlow Exterior Wall Light**
   - Modern solar-powered wall lights for home exteriors
   - 5W Monocrystalline Solar Panel
   - 4000mAh Lithium-ion battery
   - 400 lumens output
   - 6-8 hours operating time per charge
   - 2-year warranty
   - Price: $79.99

## Technical Implementation

### Data Structure
- **Parent Dataset**: Company information, locations, and business hours
- **Child Datasets**: Detailed specifications for each product
- **Assets**: Product images stored in a public repository

### API Endpoints
- `/v1/chat/completions`: Main chat endpoint for handling conversations
- `/images/:productId`: Endpoint for serving product images
- `/admin/conversations`: Admin endpoint for viewing conversation history
- `/admin/contacts`: Admin endpoint for viewing collected contact information

### Frontend Implementation
- Responsive web interface with chat functionality
- Support for displaying product images
- Suggestion buttons for common queries
- Typing indicators for better user experience

## Project Structure
```
abc-lighting-bot/
├── data/
│   ├── company.json      # Company information
│   └── products.json     # Product specifications
├── public/
│   ├── index.html        # Main chat interface
│   └── admin.html        # Admin dashboard
├── prompts/
│   ├── parent_prompt.md  # Main bot personality
│   ├── street_light_prompt.md
│   ├── driveway_light_prompt.md
│   └── wall_light_prompt.md
├── postman/
│   └── ABC_Lighting_ChatBot.postman_collection.json
└── server.js             # Main server implementation
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Access the chat interface at `http://localhost:3000`

## Usage

1. Open the chat interface in your browser
2. Type your questions about:
   - Company information
   - Product specifications
   - Pricing
   - Product images
   - Business hours
   - Store locations

3. The bot will respond with relevant information and may ask follow-up questions
4. When ending the conversation, the bot will request contact information

## Admin Features

The admin dashboard provides:
- View conversation history
- Monitor collected contact information
- Reset conversation states
- View analytics data

## Implementation Status

✅ All objectives have been completed:
- Created parent and child datasets
- Implemented product image display functionality
- Set up conversation flow with contact collection
- Developed responsive frontend interface
- Created admin dashboard for monitoring
- Implemented Postman collection for testing
- Added product specifications and images
- Set up proper error handling and user feedback

## Future Enhancements

- Add more product categories
- Implement user authentication
- Add multilingual support
- Integrate with a real database
- Add more detailed analytics
- Implement email notifications

## License

ISC
