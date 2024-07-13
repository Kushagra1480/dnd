from flask import Flask, request, jsonify

# LLM
import openai
from langchain import ConversationChain
from langchain.prompts import PromptTemplate

openai.api_key = 'your_openai_api_key'



conversation_prompt_template = """
You are playing dungons and dragon with a few users. Engage in a conversation with the user, setup the game. and play

User: {user_input}
Assistant:"""

conversation_chain = ConversationChain(
    prompt_template=PromptTemplate.from_template(conversation_prompt_template)
)


# Function to handle conversation turns
def handle_conversation_turn(user_input):
    response = conversation_chain.generate({
        'user_input': user_input
    })
    return response



# Backend Server
app = Flask(__name__)
@app.route('/helloworld')
def home():
    return jsonify({"message": "hello world!"})

# Define a route to generate text using the LLM
@app.route('/', methods=['POST'])
def generate_text():
    try:
        # Get the request data
        data = request.get_json()
        user_input = data["user"]
        assistant_response = handle_conversation_turn(user_input)
        print(f"Assistant: {assistant_response['choices'][0]['text'].strip()}")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the application
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
