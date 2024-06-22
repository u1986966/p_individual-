document.addEventListener('DOMContentLoaded', function() {
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
    if (!Array.isArray(scores)) {
        scores = [];
    }
    scores.sort((a, b) => b.score - a.score);


    var totalScores = JSON.parse(localStorage.getItem('totalScores')) || [];

    totalScores.forEach((totalScore, index) => {
        scores.push({ name: 'Total Score ' + (index + 1), score: totalScore });
    });

    var scoreList = document.getElementById('scoreList');
    scores.forEach((item, index) => {
        var listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${item.name}: ${item.score}`;
        scoreList.appendChild(listItem);
    });

});