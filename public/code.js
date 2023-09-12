(function(){
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0){
            return;
        }

        socket.emit("newuser", username);
        uname = username;
        // console.log(username)
        app.querySelector(".join-screen").classList.remove("active")
        app.querySelector(".chat-screen").classList.add("active")
    });

    // Listen for keydown event on the username input field
    app.querySelector(".join-screen #username").addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            joinChat();
        }
    });

    function joinChat() {
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0){
            return;
        }

        socket.emit("newuser", username);
        uname = username;
        // console.log(username)
        app.querySelector(".join-screen").classList.remove("active")
        app.querySelector(".chat-screen").classList.add("active")
    }

    app.querySelector(".chat-screen #send-message").addEventListener("click", sendMessage);

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    app.querySelector(".chat-screen #message-input").addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            sendMessage();
        }
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });

    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    function sendMessage() {
        let messageInput = app.querySelector(".chat-screen #message-input");
        let message = messageInput.value;
        if(message.length == 0){
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        messageInput.value = "";
    }

    function renderMessage(type, message) {
        try {
            let messageContainer = app.querySelector(".chat-screen .message");
            if (type == "my") {
                let el = document.createElement("div");
                el.setAttribute("class", "message my-message");
                el.innerHTML = `
                    <div>
                        <div class="name">You</div>
                        <div class="text">${message.text}</div>
                    </div>
                `;
                messageContainer.appendChild(el);
            } else if (type == "other") {
                let el = document.createElement("div");
                el.setAttribute("class", "message other-message");
                el.innerHTML = `
                    <div>
                        <div class="name">${message.username}</div>
                        <div class="text">${message.text}</div>
                    </div>
                `;
                messageContainer.appendChild(el);
            } else if (type == "update") {
                let el = document.createElement("div");
                el.setAttribute("class", "update");
                el.innerText = message;
                messageContainer.appendChild(el);
            }
            messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
        } catch (error) {
            console.error("Error rendering message:", error);
        }
    }
})();
