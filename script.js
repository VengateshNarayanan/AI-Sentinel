const analyzeBtn = document.getElementById("analyzeBtn");
const buttonText = document.getElementById("buttonText");
const loader = document.getElementById("loader");

const subjectInput = document.getElementById("subject");
const senderInput = document.getElementById("sender");
const messageInput = document.getElementById("message");

const resultSection = document.getElementById("resultSection");

const riskBadge = document.getElementById("riskBadge");
const category = document.getElementById("category");
const riskScore = document.getElementById("riskScore");
const indicatorsList = document.getElementById("indicatorsList");
const explanation = document.getElementById("explanation");
const recommendation = document.getElementById("recommendation");


analyzeBtn.addEventListener("click", analyzeMessage);


async function analyzeMessage() {

    const subject = subjectInput.value.trim();
    const sender = senderInput.value.trim();
    const message = messageInput.value.trim();

    if (!message) {
        alert("Please enter an email or message to analyze.");
        return;
    }

    analyzeBtn.disabled = true;
    buttonText.classList.add("hidden");
    loader.classList.remove("hidden");

    resultSection.classList.add("hidden");


    try {

        const response = await fetch("/api/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                subject: subject,
                sender: sender,
                message: message
            })

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.error || "Analysis failed.");
        }


        displayResult(data);


    } catch (error) {

        console.error("Analysis error:", error);

        alert(error.message);

    } finally {

        analyzeBtn.disabled = false;
        buttonText.classList.remove("hidden");
        loader.classList.add("hidden");

    }
}


function displayResult(data) {

    resultSection.classList.remove("hidden");

    category.textContent = data.category;
    riskScore.textContent = `${data.risk_score}/100`;
    explanation.textContent = data.explanation;
    recommendation.textContent = data.recommended_action;


    riskBadge.textContent = data.risk_level;


    riskBadge.classList.remove(
        "risk-high",
        "risk-medium",
        "risk-low"
    );


    const risk = data.risk_level.toLowerCase();


    if (risk === "high") {

        riskBadge.classList.add("risk-high");

    } else if (risk === "medium") {

        riskBadge.classList.add("risk-medium");

    } else if (risk === "low") {

        riskBadge.classList.add("risk-low");

    }


    indicatorsList.innerHTML = "";


    data.indicators.forEach(function(indicator) {

        const li = document.createElement("li");

        li.textContent = indicator;

        indicatorsList.appendChild(li);

    });


    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}