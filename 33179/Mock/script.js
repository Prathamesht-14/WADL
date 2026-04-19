function submitQuiz() {

    let answers = [];

    for (let i = 1; i <= 5; i++) {
        let q = document.querySelector('input[name="q' + i + '"]:checked');

        if (!q) {
            alert("Please answer all questions!");
            return;
        }

        answers.push(q.value);
    }

    localStorage.setItem("userAnswers", JSON.stringify(answers));

    window.location.href = "result.html";
}