export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, 1000);
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };
    const default_options = {
            pairs: 2,
            timeLimit: 1000,
            penaltyIncrease: 50,
            level: 1,
    };

    function updateOptions(options) {
        localStorage.options = JSON.stringify(options);
    }
    function updateScore(scoreDelta) {
        scores += scoreDelta;
        //scores.push(scoreDelta);
        localStorage.setItem('scores', scores);
    }


    var options = JSON.parse(localStorage.options || JSON.stringify(default_options));
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores= (options.level*2)-2;
    console.log(options);
    var lastCard;
    console.log(options.level);
    options.pairs= (options.level *1);
    console.log(options.pairs);
    options.timeLimit=1000;
    console.log(options.timeLimit);
    options.timeLimit = options.timeLimit - (options.level*50);
    console.log(options.timeLimit);
    options.penaltyIncrease = options.level * 5;
    var pairs= options.pairs;

    //HACER QUE PUNTOS FUNCIONEN

    var maxCartas = 6;
    var tiempoInicial = options.timeLimit;
    var restapunts = options.penaltyIncrease;
    var points = 100;
    console.log(puntos);
    var puntos= (options.level*2)-2;
    console.log(puntos);
    //var puntos=0;

    function actualizarDificultad() {
        pairs++;
        //options.pairs++;
        //scores += scores+10;
        options.timeLimit -= 50; 
        options.penaltyIncrease += 5; 
        options.level++;
        options.pairs = Math.min(pairs, maxCartas);
        updateOptions(options);
    }

    return {
        init: function (call){
            console.log("Cantidad de cartas:", options.pairs);
            console.log("Time Limit:", options.timeLimit);
            console.log("Penalizacion:", options.penaltyIncrease);
            console.log("Nivel:", options.level);
            console.log("Puntos:",puntos);
            console.log("Score: ", scores);
            var items = resources.slice();
            items.sort(() => Math.random() - 0.5);
            items = items.slice(0, options.pairs);
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5);
            var carta = items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
            carta.forEach(obj => {
                obj.current = obj.front;
                setTimeout(() => {
                    obj.current = back;
                    obj.clickable = true;
                    obj.callback();
                }, tiempoInicial);
            });
            return carta;
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront();
            if (lastCard){
                if (card.front === lastCard.front){
                    options.pairs--;
                    if (options.pairs <= 0){
                        this.cargarSiguienteNivel();
                        return;
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points -= restapunts;
                    if (points <= 0){
                        alert ("¡Has perdido!");
                        puntos=0;
                        //scores=0;
                        var totalScores = JSON.parse(localStorage.getItem('totalScores')) || [];
                        totalScores.push(scores);
                        localStorage.setItem('totalScores', JSON.stringify(totalScores));
                        localStorage.removeItem('options');
                        window.location.replace("../");
                        return;
                    }
                }
                lastCard = null;
            }
            else lastCard = card;
        },
        reiniciarJuego: function() {
            window.location.reload();
        },

        cargarSiguienteNivel: function() {
            actualizarDificultad(); 
            puntos += options.level * 2; 
            console.log(puntos);
            updateScore(puntos); 
            //localStorage.setItem('scores', JSON.stringify(scores));
            this.reiniciarJuego();
        },
        save: function (){
            var partida = {
                uuid: localStorage.uuid,
                pairs: options.pairs,
                points: points,
                cards: []
            };
            cards.forEach(c=>{
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });

            let json_partida = JSON.stringify(partida);

            fetch("../php/save.php",{
                method: "POST",
                body: json_partida,
                headers: {"content-type":"application/json; charset=UTF-8"}
            })
            .then(response=>response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err=>{
                console.log(err);
                localStorage.save = json_partida;
                console.log(localStorage.save);
            })
            .finally(()=>{
                window.location.replace("../");
            });
        },
        getScores: function() {
            return scores;
        }
    }
}();