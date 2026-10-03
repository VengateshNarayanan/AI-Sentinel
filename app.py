from flask import Flask, render_template, request, jsonify

from Services.ai_analyzer import analyze_email


app = Flask(
    __name__,
    template_folder="template",
    static_folder="template",
    static_url_path="/static"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/analyze", methods=["POST"])
def analyze_email_route():

    data = request.get_json()

    subject = data.get("subject", "")
    sender = data.get("sender", "")
    message = data.get("message", "")

    if not message:
        return jsonify({
            "error": "Message cannot be empty."
        }), 400

    try:

        result = analyze_email(
            subject,
            sender,
            message
        )

        return jsonify(result)

    except Exception as error:

        print("Analysis error:", error)

        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)