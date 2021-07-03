// get DOM elements
const htmlChatWindow = document.getElementById('chat-window');
const htmlTxt = document.getElementById('txt');
const htmlBtnSend = document.getElementById('btnSend');
const htmlOnlineList = document.getElementById('list');
const htmlTyping = document.getElementById('typing');
let typingTimeout;

// Ask for client name
const personName = prompt('Please enter a name', 'Anonymous') || 'Anonymous';

// Get Socket.io
const socket = io('http://localhost:3000');

// Socket: connect (predefined)
socket.on('connect', () => {
    // confirm/register connection in server
    socket.emit('identity', personName);
});

// Socket: disconnect
socket.on('disconnect', () => {
    socket.emit('socketDisconnected');
});

// Socket: identity (defined)
socket.on('identity', (m) => {
    // add notification in chat window
    let domString = `<div class="identity container"><strong>${m}</strong> is now connected!</div>`;
    let node = new DOMParser().parseFromString(domString, 'text/html');
    htmlChatWindow.appendChild(node.body);
});

// Socket: message (defined)
socket.on('message', (m) => {
    addChat(m);
    htmlTyping.classList.remove('active');

    // if user is not backreading messages then scroll to bottom
    if (htmlChatWindow.scrollTop <= htmlChatWindow.scrollHeight) {
        htmlChatWindow.scrollTop = htmlChatWindow.scrollHeight; // scroll to bottom
    }
});

// Socket: typing (defined)
socket.on('typing', () => {
    htmlTyping.classList.add('active');
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(inactiveTyping, 1500);
});

// Socket: onlineList is refreshed (defined)
socket.on('onlineListRefresh', (list) => {
    let node;
    let domString = ``;

    list.forEach((value) => {
        domString += `<div class="container">${value}</div>`;
    });

    node = new DOMParser().parseFromString(domString, 'text/html');
    htmlOnlineList.innerHTML = node.body.innerHTML;
});

// Socket: someoneDisconnected (defined)
socket.on('someoneDisconnected', (data) => {
    let domString = `<div class="identity container"><strong>${data.theOneWhoDisconnected}</strong> was disconnected.</div>`;
    let node = new DOMParser().parseFromString(domString, 'text/html');
    htmlChatWindow.appendChild(node.body);

    domString = ``;
    data.list.forEach((value) => {
        domString += `<div class="container">${value}</div>`;
    });

    node = new DOMParser().parseFromString(domString, 'text/html');
    htmlOnlineList.innerHTML = node.body.innerHTML;
});

/**
 * Send chat message to socket and emit to server
 */
const sendMessage = () => {
    const msg = htmlTxt.value.trim();
    if (msg == '' || msg == null) return false;
    // set payload
    const data = { name: personName, message: htmlTxt.value };

    // use socket to emit the payload
    socket.emit('message', data, (chat) => {
        // after server received,
        // store response in "chat"
        addChat(chat, true); // true to set CSS 'sent-message' class name
        htmlChatWindow.scrollTop = htmlChatWindow.scrollHeight; // scroll to bottom
    });

    htmlTxt.value = '';
};

/**
 * Add DOM element as message
 * @param {*} chat - contains the name and message
 * @param self - for styling CSS to 'sent-message'
 */
const addChat = (chat, self) => {
    let domString;
    let node;

    if (self) {
        domString = `
            <div class="sent-message"><p>${chat.message}</p></div>
        `;
    } else {
        domString = `
            <div class="received-message">
                <p>
                    <span class="name">${chat.name}</span>
                    <span class="message">${chat.message}</span>
                </p>
            </div>
        `;
    }

    node = new DOMParser().parseFromString(domString, 'text/html');

    htmlChatWindow.appendChild(node.body.firstChild);
};

/**
 * To emit while typing
 * @param evt Keyboard event
 */
const typing = (evt) => {
    if (evt.code != 'Enter') {
        socket.emit('typing');
    } else {
        clearTimeout(typingTimeout);
        inactiveTyping();
    }
};

/**
 * Remove "someone is typing" if no one is typing
 */
function inactiveTyping() {
    htmlTyping.classList.remove('active');
}

function getRandomStrings(length = 10) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
