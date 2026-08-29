from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_engine import ai_engine
import sys

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Food Basket Python Pandas & NumPy AI Engine"
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '')
    
    if not message.strip():
        return jsonify({
            "reply": "Please enter a question or diet request (e.g. 'Suggest veg snacks under ₹200').",
            "recommendations": []
        })

    result = ai_engine.process_query(message)
    return jsonify(result)

if __name__ == '__main__':
    print("Starting Food Basket Python AI Assistant Server on http://localhost:5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
