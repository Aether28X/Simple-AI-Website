const API_KEY = 'get your own key lol';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

let isGenerating = false;

async function generateResponse(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

function createMessageElement(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    return messageDiv;
}

async function handleUserInput() {
    if (isGenerating) return;

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    chatContainer.appendChild(createMessageElement(userMessage, true));
    userInput.value = '';

    typingIndicator.style.display = 'block';
    isGenerating = true;

    try {
        const response = await generateResponse(userMessage);

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            chatContainer.appendChild(createMessageElement(response));
            chatContainer.scrollTop = chatContainer.scrollHeight;
            isGenerating = false;
        }, 1000);
    } catch (error) {
        console.error(error);
        isGenerating = false;
        typingIndicator.style.display = 'none';
    }
}

sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

chatContainer.scrollTop = chatContainer.scrollHeight;
