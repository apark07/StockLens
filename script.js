// script.js

document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    const communityContainer = document.getElementById('community-container');
    const stocksContainer = document.getElementById('stocks-container');
    const updatesContainer = document.getElementById('updates-container');
    const chatbotResponse = document.getElementById('chatbot-response');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');

    // Fetch stock news
    fetch('')
        .then(response => response.json())
        .then(data => {
            data.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.textContent = news.title;
                newsContainer.appendChild(newsItem);
            });
        });

    // Community feature (mock data)
    const communityPosts = [
        "User1: I think stock X is going to rise!",
        "User2: Just sold my shares of stock Y.",
    ];
    communityPosts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.textContent = post;
        communityContainer.appendChild(postItem);
    });

    // Stock summaries (mock data)
    const stockSummaries = [
        { name: "Stock A", summary: "Summary of Stock A" },
        { name: "Stock B", summary: "Summary of Stock B" },
    ];
    stockSummaries.forEach(stock => {
        const stockItem = document.createElement('div');
        stockItem.innerHTML = `<strong>${stock.name}</strong>: ${stock.summary}`;
        stocksContainer.appendChild(stockItem);
    });

    // Real-time updates (mock data)
    const stockUpdates = [
        "Stock A: +2.5%",
        "Stock B: -1.2%",
    ];
    stockUpdates.forEach(update => {
        const updateItem = document.createElement('div');
        updateItem.textContent = update;
        updatesContainer.appendChild(updateItem);
    });

    // AI Chatbot functionality
    sendButton.addEventListener('click', function() {
        const userText = userInput.value;
        const responseText = `You asked about: ${userText}`;
        chatbotResponse.textContent = responseText;
        userInput.value = '';
    });
});



