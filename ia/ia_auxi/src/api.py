from flask import Flask, request, jsonify
from chatbot import predict, add_new_phrase

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    response, _ = predict(user_input)
    return jsonify({"response": response})

@app.route("/add", methods=["POST"])
def add():
    data = request.json
    user_input = data.get("message", "")
    response_text = data.get("response", "")
    if not user_input or not response_text:
        return jsonify({"error": "Missing message or response"}), 400

    # Se predice categoría automáticamente
    _, category = predict(user_input)
    add_new_phrase(user_input, response_text, category)
    return jsonify({"status": "added", "category": category})

if __name__ == "__main__":
    app.run(port=5000)
