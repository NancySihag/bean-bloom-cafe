from flask import Flask, request, jsonify
from flask_cors import CORS
import requests


app = Flask(__name__)

CORS(app)


# =========================
# CAFÉ INFORMATION
# =========================

SYSTEM_PROMPT = """
You are the friendly AI assistant for Bean & Bloom Café.

You help customers with information about the café.

CAFÉ INFORMATION:

Name:
Bean & Bloom Café

Location:
24 Bloom Street, Jaipur, Rajasthan

Opening hours:
Monday-Friday: 8 AM - 9 PM
Saturday-Sunday: 9 AM - 10 PM


MENU:

Coffee:
- Cappuccino - ₹180
- Café Latte - ₹190

Cold Drinks:
- Cold Coffee - ₹210
- Iced Mocha - ₹230

Food:
- Chocolate Brownie - ₹150
- Butter Croissant - ₹160


CONTACT:

Phone:
+91 98765 43210

Email:
hello@beanandbloom.com


RESERVATIONS:

Customers can request a table through the reservation
form on the website.

The reservation form is only a demo request form.
Do NOT claim that a reservation has actually been booked.


IMPORTANT RULES:

- Be friendly and helpful.
- Keep answers reasonably short.
- Answer questions about Bean & Bloom Café.
- Do not invent café information.
- If you don't know something, clearly say that you don't have that information.
- Use the café information provided above.
- Do not invent menu items or prices.
- Do not claim that a reservation has been confirmed.
- You can explain how customers can use the reservation form.
- If a customer asks something unrelated to the café, politely say that you are the Bean & Bloom Café assistant and can mainly help with café-related questions.
- Remember the conversation context when answering follow-up questions.
"""


# =========================
# CHAT ENDPOINT
# =========================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid request."
            }), 400


        message = data.get(
            "message",
            ""
        ).strip()


        conversation = data.get(
            "conversation",
            []
        )


        if not message:

            return jsonify({
                "error": "Message is required."
            }), 400


        # =========================
        # BUILD CONVERSATION
        # =========================

        conversation_text = ""


        for item in conversation:

            role = item.get(
                "role",
                ""
            )

            content = item.get(
                "content",
                ""
            )


            if role == "user":

                conversation_text += (
                    f"Customer: {content}\n"
                )


            elif role == "assistant":

                conversation_text += (
                    f"Bean & Bloom AI: {content}\n"
                )


        # =========================
        # BUILD AI PROMPT
        # =========================

        prompt = f"""
{SYSTEM_PROMPT}


PREVIOUS CONVERSATION:

{conversation_text}


NEW CUSTOMER MESSAGE:

Customer: {message}


INSTRUCTIONS:

Answer the customer's latest message.

Use the previous conversation when it helps
understand follow-up questions.

Keep the response friendly, natural,
and reasonably short.

Bean & Bloom AI:
"""


        # =========================
        # CALL OLLAMA
        # =========================

        response = requests.post(

            "http://127.0.0.1:11434/api/generate",

            json={

                "model": "llama3.2",

                "prompt": prompt,

                "stream": False

            },

            timeout=60

        )


        response.raise_for_status()


        result = response.json()


        reply = result.get(
            "response",
            ""
        ).strip()


        if not reply:

            reply = (
                "Sorry, I couldn't generate a response right now."
            )


        # =========================
        # RETURN RESPONSE
        # =========================

        return jsonify({

            "reply": reply

        })


    except requests.exceptions.ConnectionError:

        return jsonify({

            "error":
            "Ollama is not running. "
            "Please start Ollama and try again."

        }), 500


    except requests.exceptions.Timeout:

        return jsonify({

            "error":
            "The AI took too long to respond. "
            "Please try again."

        }), 500


    except Exception as error:

        print(
            "Error:",
            error
        )


        return jsonify({

            "error":
            "Sorry, something went wrong."

        }), 500


# =========================
# START SERVER
# =========================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )