import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


class PhishingAnalysis(BaseModel):
    risk_level: str
    risk_score: int
    category: str
    indicators: list[str]
    explanation: str
    recommended_action: str


def analyze_email(subject, sender, message):

    prompt = f"""
Analyze this email for phishing, scams, fraud, social engineering,
credential theft, impersonation, malicious links, or other suspicious behavior.

Subject:
{subject}

Sender:
{sender}

Message:
{message}

Analyze the content carefully.
"""

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": PhishingAnalysis,
        },
    )

    result = response.parsed

    if isinstance(result, PhishingAnalysis):
        return result.model_dump()

    return result