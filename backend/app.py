
from flask import Flask, jsonify, request
from flask_cors import CORS
from graph_demo import graph, agent

app = Flask(__name__)
CORS(app)

SITUATION_CATEGORIES = [
    "Travel",
    "Shopping",
    "Restaurant",
    "Healthcare"
]


def run_feature(feature, user_input, goal=""):
    result = graph.invoke({
        "feature": feature,
        "user_input": user_input,
        "goal": goal,
        "result": ""
    })

    return result["result"]


@app.route("/")
def home():
    return jsonify({
        "message": "Kannada Saathi Agent API is running!"
    })


@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json(silent=True) or {}
    sentence = data.get("sentence", "")

    if not isinstance(sentence, str) or not sentence.strip():
        return jsonify({
            "error": "Please enter a sentence."
        }), 400

    try:
        result = run_feature(
            "translate",
            sentence.strip()
        )

        return jsonify({
            "sentence": sentence.strip(),
            "result": result
        })

    except Exception:
        app.logger.exception("Translation agent failed")

        return jsonify({
            "error": "The translation service failed. Please try again."
        }), 500


@app.route("/situations", methods=["GET"])
def get_situations():
    return jsonify({
        "situations": SITUATION_CATEGORIES
    })


@app.route("/situations", methods=["POST"])
def get_phrases():
    data = request.get_json(silent=True) or {}
    situation = data.get("situation", "")
    goal = data.get("goal", "")

    if not isinstance(situation, str):
        return jsonify({
            "error": "Please select a valid situation."
        }), 400

    category = next(
        (
            item for item in SITUATION_CATEGORIES
            if item.lower() == situation.strip().lower()
        ),
        None
    )

    if category is None:
        return jsonify({
            "error": "Choose Travel, Shopping, Restaurant, or Healthcare."
        }), 400

    if not isinstance(goal, str):
        return jsonify({
            "error": "The situation goal must be text."
        }), 400

    try:
        result = run_feature(
            "situation",
            category,
            goal.strip()
        )

        return jsonify({
            "situation": category,
            "result": result
        })

    except Exception:
        app.logger.exception("Situation agent failed")

        return jsonify({
            "error": "The situation assistant failed. Please try again."
        }), 500


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    situation = data.get("situation", "")

    if not isinstance(situation, str) or not situation.strip():
        return jsonify({
            "error": "Please describe your situation."
        }), 400

    try:
        result = run_feature(
            "ask",
            situation.strip()
        )

        return jsonify({
            "result": result
        })

    except Exception:
        app.logger.exception("Situation assistant failed")

        return jsonify({
            "error": "Kannada Saathi could not process your request. Please try again."
        }), 500



@app.route("/voice", methods=["POST"])
def voice():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "No speech text received."}), 400

    try:
        response = agent.invoke({
            "messages": [
                {
                    "role": "user",
                    "content": f"""
The user spoke this text and needs help communicating in Kannada.
Use the assist_with_situation tool to understand their goal.

Spoken text: {text}
"""
                }
            ]
        })

        return jsonify({
            "result": response["messages"][-1].content
        })

    except Exception:
        return jsonify({
            "error": "Agent failed. Check the backend terminal for details."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)