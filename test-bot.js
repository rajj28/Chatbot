const axios = require('axios');

const API_URL = 'http://localhost:3000/v1/chat/completions';
const TEST_USER = 'test-user-' + Date.now();

async function testBot() {
    try {
        console.log('Starting bot tests...\n');

        // Test 1: Initial greeting
        console.log('Test 1: Initial greeting');
        const greetingResponse = await sendMessage('Hello');
        console.log('Bot response:', greetingResponse);
        console.log('----------------------------------------\n');

        // Test 2: Business hours
        console.log('Test 2: Business hours');
        const hoursResponse = await sendMessage('What are your business hours?');
        console.log('Bot response:', hoursResponse);
        console.log('----------------------------------------\n');

        // Test 3: Product information
        console.log('Test 3: Product information');
        const productsResponse = await sendMessage('What products do you offer?');
        console.log('Bot response:', productsResponse);
        console.log('----------------------------------------\n');

        // Test 4: Specific product details
        console.log('Test 4: Specific product details');
        const streetLightResponse = await sendMessage('Tell me about your street lights');
        console.log('Bot response:', streetLightResponse);
        console.log('----------------------------------------\n');

        // Test 5: Product specifications
        console.log('Test 5: Product specifications');
        const specsResponse = await sendMessage('What are the specifications of the street light?');
        console.log('Bot response:', specsResponse);
        console.log('----------------------------------------\n');

        // Test 6: Pricing
        console.log('Test 6: Pricing');
        const priceResponse = await sendMessage('How much does the street light cost?');
        console.log('Bot response:', priceResponse);
        console.log('----------------------------------------\n');

        // Test 7: Warranty
        console.log('Test 7: Warranty');
        const warrantyResponse = await sendMessage('What is the warranty on the street light?');
        console.log('Bot response:', warrantyResponse);
        console.log('----------------------------------------\n');

        // Test 8: Image request
        console.log('Test 8: Image request');
        const imageResponse = await sendMessage('Can I see an image of the street light?');
        console.log('Bot response:', imageResponse);
        console.log('----------------------------------------\n');

        // Test 9: Location information
        console.log('Test 9: Location information');
        const locationResponse = await sendMessage('Where are your locations?');
        console.log('Bot response:', locationResponse);
        console.log('----------------------------------------\n');

        // Test 10: End conversation
        console.log('Test 10: End conversation');
        const endResponse = await sendMessage('No, that\'s all. Thank you!');
        console.log('Bot response:', endResponse);
        console.log('----------------------------------------\n');

        console.log('All tests completed!');
    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

async function sendMessage(message) {
    try {
        const response = await axios.post(API_URL, {
            messages: [{ role: 'user', content: message }],
            user: TEST_USER
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        throw new Error(`Failed to send message: ${error.message}`);
    }
}

// Run the tests
testBot(); 