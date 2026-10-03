/* =========================
   SMOOTH NAVIGATION
========================== */

const navLinks =
    document.querySelectorAll(".nav a");

navLinks.forEach(function (link) {

    link.addEventListener(
        "click",
        function () {

            const target =
                document.querySelector(
                    link.getAttribute("href")
                );

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

});



/* =========================
   MOBILE NAVIGATION
========================== */

const menuToggle =
    document.querySelector(".menu-toggle");

const nav =
    document.querySelector(".nav");


if (menuToggle && nav) {

    menuToggle.addEventListener(
        "click",
        function () {

            nav.classList.toggle("active");


            if (
                nav.classList.contains("active")
            ) {

                menuToggle.textContent = "✕";

            } else {

                menuToggle.textContent = "☰";

            }

        }
    );


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                nav.classList.remove(
                    "active"
                );

                menuToggle.textContent = "☰";

            }
        );

    });

}



/* =========================
   MENU FILTER
========================== */

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const category =
                button.dataset.category;


            filterButtons.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add("active");


            menuItems.forEach(
                function (item) {

                    const itemCategory =
                        item.dataset.category;


                    if (
                        category === "all" ||
                        itemCategory === category
                    ) {

                        item.style.display =
                            "block";

                    } else {

                        item.style.display =
                            "none";

                    }

                }
            );

        }
    );

});



/* =========================
   RESERVATION FORM
========================== */

const reservationForm =
    document.querySelector(
        "#reservationForm"
    );


const formMessage =
    document.querySelector(
        "#formMessage"
    );


if (
    reservationForm &&
    formMessage
) {

    reservationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.querySelector(
                    "#name"
                ).value.trim();


            const date =
                document.querySelector(
                    "#date"
                ).value;


            const time =
                document.querySelector(
                    "#time"
                ).value;


            const guests =
                document.querySelector(
                    "#guests"
                ).value;


            if (
                name === "" ||
                date === "" ||
                time === "" ||
                guests === ""
            ) {

                formMessage.textContent =
                    "Please complete all required fields.";

                formMessage.style.color =
                    "#a34d3d";

                return;

            }


            formMessage.textContent =
                `Thank you, ${name}! Your table request for ${guests} guest(s) on ${date} at ${time} has been received.`;


            formMessage.style.color =
                "#5f7b52";


            reservationForm.reset();

        }
    );

}



/* =========================
   FOOTER YEAR
========================== */

const currentYear =
    new Date().getFullYear();


const footer =
    document.querySelector(
        ".footer"
    );


if (footer) {

    const footerText =
        footer.querySelector(
            "p:last-child"
        );


    if (footerText) {

        footerText.textContent =
            `© ${currentYear} Bean & Bloom Café. All rights reserved.`;

    }

}



/* =========================
   AI CHATBOT
========================== */

const chatbotButton =
    document.querySelector(
        "#chatbotButton"
    );


const chatbotWindow =
    document.querySelector(
        "#chatbotWindow"
    );


const chatbotClose =
    document.querySelector(
        "#chatbotClose"
    );


const chatbotInput =
    document.querySelector(
        "#chatbotInput"
    );


const chatbotSend =
    document.querySelector(
        "#chatbotSend"
    );


const chatbotMessages =
    document.querySelector(
        "#chatbotMessages"
    );



/*
    Stores the conversation
    during the current website session.
*/

let conversationHistory = [];



/* =========================
   OPEN CHATBOT
========================== */

if (
    chatbotButton &&
    chatbotWindow
) {

    chatbotButton.addEventListener(
        "click",
        function () {

            chatbotWindow.classList.toggle(
                "active"
            );


            if (
                chatbotWindow.classList.contains(
                    "active"
                )
            ) {

                chatbotInput.focus();

            }

        }
    );

}



/* =========================
   CLOSE CHATBOT
========================== */

if (
    chatbotClose &&
    chatbotWindow
) {

    chatbotClose.addEventListener(
        "click",
        function () {

            chatbotWindow.classList.remove(
                "active"
            );

        }
    );

}



/* =========================
   ADD CHAT MESSAGE
========================== */

function addChatMessage(
    message,
    sender
) {

    const messageElement =
        document.createElement(
            "div"
        );


    if (sender === "user") {

        messageElement.className =
            "user-message";

    } else {

        messageElement.className =
            "bot-message";

    }


    messageElement.textContent =
        message;


    chatbotMessages.appendChild(
        messageElement
    );


    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;

}



/* =========================
   TYPING MESSAGE
========================== */

function showTypingMessage() {

    const typingElement =
        document.createElement(
            "div"
        );


    typingElement.className =
        "bot-message typing-message";


    typingElement.textContent =
        "Bean & Bloom AI is typing...";


    typingElement.id =
        "typingMessage";


    chatbotMessages.appendChild(
        typingElement
    );


    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;

}



/* =========================
   REMOVE TYPING MESSAGE
========================== */

function removeTypingMessage() {

    const typingMessage =
        document.querySelector(
            "#typingMessage"
        );


    if (typingMessage) {

        typingMessage.remove();

    }

}



/* =========================
   SEND CHAT MESSAGE
========================== */

async function sendChatMessage() {

    const message =
        chatbotInput.value.trim();


    if (message === "") {

        return;

    }


    /* Add user's message to UI */

    addChatMessage(
        message,
        "user"
    );


    /* Add user's message to history */

    conversationHistory.push({

        role: "user",

        content: message

    });


    /* Clear input */

    chatbotInput.value = "";


    /* Show typing indicator */

    showTypingMessage();


    /* Disable send button */

    if (chatbotSend) {

        chatbotSend.disabled = true;

    }


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/chat",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        message: message,

                        conversation:
                            conversationHistory

                    })

                }
            );


        const data =
            await response.json();


        removeTypingMessage();


        if (!response.ok) {

            addChatMessage(
                data.error ||
                "Sorry, I couldn't process your message right now.",
                "bot"
            );


            return;

        }


        const reply =
            data.reply ||
            "Sorry, I couldn't generate a response.";


        /* Add AI response to UI */

        addChatMessage(
            reply,
            "bot"
        );


        /* Save AI response */

        conversationHistory.push({

            role: "assistant",

            content: reply

        });


    } catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        removeTypingMessage();


        addChatMessage(
            "I can't connect to the Bean & Bloom AI server right now. Please make sure the Python backend is running.",
            "bot"
        );

    } finally {

        if (chatbotSend) {

            chatbotSend.disabled = false;

        }


        chatbotInput.focus();

    }

}



/* =========================
   SEND BUTTON
========================== */

if (chatbotSend) {

    chatbotSend.addEventListener(
        "click",
        sendChatMessage
    );

}



/* =========================
   ENTER KEY
========================== */

if (chatbotInput) {

    chatbotInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendChatMessage();

            }

        }
    );

}



/* =========================
   WELCOME MESSAGE
========================== */

console.log(
    "Bean & Bloom Café website loaded successfully ☕"
);

console.log(
    "AI chatbot connected to local Ollama backend 🤖"
);

/* =========================
   FAQ ACCORDION
========================== */

const faqQuestions =
    document.querySelectorAll(
        ".faq-question"
    );


faqQuestions.forEach(function (question) {

    question.addEventListener(
        "click",
        function () {

            const faqItem =
                question.parentElement;

            const faqAnswer =
                faqItem.querySelector(
                    ".faq-answer"
                );


            /* Close other FAQ items */

            document
                .querySelectorAll(".faq-item")
                .forEach(function (item) {

                    if (item !== faqItem) {

                        item.classList.remove(
                            "active"
                        );

                        const otherAnswer =
                            item.querySelector(
                                ".faq-answer"
                            );

                        if (otherAnswer) {

                            otherAnswer.style.maxHeight =
                                null;

                        }

                    }

                });


            /* Toggle current FAQ */

            faqItem.classList.toggle(
                "active"
            );


            if (
                faqItem.classList.contains(
                    "active"
                )
            ) {

                faqAnswer.style.maxHeight =
                    faqAnswer.scrollHeight + "px";

            } else {

                faqAnswer.style.maxHeight =
                    null;

            }

        }
    );

});

/* =========================
   SCROLL TO TOP
========================== */

const scrollTopButton =
    document.querySelector(
        "#scrollTop"
    );


if (scrollTopButton) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 500) {

                scrollTopButton.classList.add(
                    "show"
                );

            } else {

                scrollTopButton.classList.remove(
                    "show"
                );

            }

        }
    );


    scrollTopButton.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}