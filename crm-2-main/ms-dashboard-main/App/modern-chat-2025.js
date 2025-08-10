// Initialize Lucide icons
lucide.createIcons();

// Theme management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let isDark = false;

// Load saved theme
const savedTheme = localStorage.getItem('chatTheme');
if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    isDark = true;
    themeToggle.innerHTML = '<i data-lucide="sun"></i>';
    lucide.createIcons();
}

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
        localStorage.setItem('chatTheme', 'dark');
    } else {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
        localStorage.setItem('chatTheme', 'light');
    }
    lucide.createIcons();
});

// Sample data
const chats = [
    {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'A',
        lastMessage: 'Hey! How are you doing?',
        time: '2:30 PM',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Sarah Wilson',
        avatar: 'S',
        lastMessage: 'The project is ready for review',
        time: '1:45 PM',
        unread: 0,
        online: false
    },
    {
        id: 3,
        name: 'Mike Chen',
        avatar: 'M',
        lastMessage: 'Great work on the presentation!',
        time: '12:20 PM',
        unread: 1,
        online: true
    },
    {
        id: 4,
        name: 'Emily Davis',
        avatar: 'E',
        lastMessage: 'Can we meet tomorrow?',
        time: '11:15 AM',
        unread: 0,
        online: false
    },
    {
        id: 5,
        name: 'David Brown',
        avatar: 'D',
        lastMessage: 'Thanks for the help!',
        time: '10:30 AM',
        unread: 3,
        online: true
    }
];

const messages = [
    {
        id: 1,
        text: 'Hey! How are you doing?',
        time: '2:30 PM',
        sent: false
    },
    {
        id: 2,
        text: 'Hi Alex! I\'m doing great, thanks for asking. How about you?',
        time: '2:32 PM',
        sent: true
    },
    {
        id: 3,
        text: 'Pretty good! Just working on some new features for the app.',
        time: '2:33 PM',
        sent: false
    },
    {
        id: 4,
        text: 'That sounds exciting! What kind of features are you working on?',
        time: '2:35 PM',
        sent: true
    },
    {
        id: 5,
        text: 'Mostly AI-powered chat enhancements and better user experience improvements.',
        time: '2:36 PM',
        sent: false
    }
];

// Render chats
function renderChats() {
    const chatsList = document.getElementById('chatsList');
    chatsList.innerHTML = chats.map(chat => `
        <div class="chat-item ${chat.id === 1 ? 'active' : ''}" data-chat-id="${chat.id}">
            <div class="chat-avatar">
                ${chat.avatar}
                <div class="status-indicator ${chat.online ? 'status-online' : 'status-offline'}"></div>
            </div>
            <div class="chat-info">
                <div class="chat-header-row">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-time">${chat.time}</div>
                </div>
                <div class="chat-preview">${chat.lastMessage}</div>
            </div>
            ${chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : ''}
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update header
            const chatId = parseInt(item.dataset.chatId);
            const chat = chats.find(c => c.id === chatId);
            if (chat) {
                document.querySelector('.contact-name').textContent = chat.name;
                document.querySelector('.contact-avatar').textContent = chat.avatar;
                document.querySelector('.contact-status').innerHTML = `
                    <div class="status-dot"></div>
                    ${chat.online ? 'Online' : 'Offline'}
                `;
            }
        });
    });
}

// Render messages
function renderMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = messages.map(message => `
        <div class="message ${message.sent ? 'sent' : 'received'}">
            <div class="message-bubble">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Message input handling
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const newMessage = {
        id: messages.length + 1,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: true
    };

    messages.push(newMessage);
    renderMessages();
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Simulate reply after 2 seconds
    setTimeout(() => {
        const reply = {
            id: messages.length + 1,
            text: 'Thanks for the message! I\'ll get back to you soon.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: false
        };
        messages.push(reply);
        renderMessages();
    }, 2000);
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const name = item.querySelector('.chat-name').textContent.toLowerCase();
        const preview = item.querySelector('.chat-preview').textContent.toLowerCase();
        
        if (name.includes(query) || preview.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Initialize
renderChats();
renderMessages();

// Add some micro-interactions
document.querySelectorAll('.action-btn, .input-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Smooth scrolling for messages
const messagesContainer = document.getElementById('messagesContainer');
messagesContainer.style.scrollBehavior = 'smooth';

// Add typing indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    setTimeout(() => {
        typingIndicator.remove();
    }, 3000);
}

// Show typing indicator when user starts typing
let typingTimeout;
messageInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        showTypingIndicator();
    }, 1000);
});

// Add hover effects for chat items
document.addEventListener('DOMContentLoaded', () => {
    // Add glassmorphism effect on hover for chat items
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backdropFilter = 'blur(10px)';
            this.style.background = 'rgba(59, 130, 246, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backdropFilter = 'none';
            this.style.background = '';
        });
    });
});

// Add smooth transitions for theme changes
document.addEventListener('DOMContentLoaded', () => {
    // Add transition class to all elements that should animate
    const elementsToAnimate = document.querySelectorAll('.chat-container, .sidebar, .chat-main, .sidebar-right');
    elementsToAnimate.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        // Show all chats
        document.querySelectorAll('.chat-item').forEach(item => {
            item.style.display = 'flex';
        });
    }
});

// Add loading states
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Simulate loading when switching chats
document.addEventListener('click', (e) => {
    if (e.target.closest('.chat-item')) {
        const messagesContainer = document.getElementById('messagesContainer');
        showLoading(messagesContainer);
        
        setTimeout(() => {
            hideLoading(messagesContainer);
        }, 500);
    }
});

// Add notification sound (optional)
function playNotificationSound() {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Add unread message notification
function addUnreadMessage(chatId) {
    const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (chatItem) {
        const existingBadge = chatItem.querySelector('.unread-badge');
        if (existingBadge) {
            const currentCount = parseInt(existingBadge.textContent);
            existingBadge.textContent = currentCount + 1;
        } else {
            const badge = document.createElement('div');
            badge.className = 'unread-badge';
            badge.textContent = '1';
            chatItem.appendChild(badge);
        }
        
        // Play notification sound
        playNotificationSound();
    }
}

// Simulate receiving messages periodically
setInterval(() => {
    const randomChatId = Math.floor(Math.random() * chats.length) + 1;
    if (Math.random() > 0.7) { // 30% chance
        addUnreadMessage(randomChatId);
    }
}, 10000); // Every 10 seconds

// Add smooth animations for new messages
function addMessageWithAnimation(message) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sent ? 'sent' : 'received'} slide-up`;
    messageElement.innerHTML = `
        <div class="message-bubble">
            <div class="message-text">${message.text}</div>
            <div class="message-time">${message.time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Remove animation class after animation completes
    setTimeout(() => {
        messageElement.classList.remove('slide-up');
    }, 300);
}

// Enhanced send message function with animation
function sendMessageWithAnimation() {
    const text = messageInput.value.trim();
    if (!text) return;

    const newMessage = {
        id: messages.length + 1,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: true
    };

    messages.push(newMessage);
    addMessageWithAnimation(newMessage);
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Simulate reply with animation
    setTimeout(() => {
        const reply = {
            id: messages.length + 1,
            text: 'Thanks for the message! I\'ll get back to you soon.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: false
        };
        messages.push(reply);
        addMessageWithAnimation(reply);
    }, 2000);
}

// Replace the original send message function
sendBtn.removeEventListener('click', sendMessage);
sendBtn.addEventListener('click', sendMessageWithAnimation);

messageInput.removeEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessageWithAnimation();
    }
});
