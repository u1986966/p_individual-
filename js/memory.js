
export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        visible: false, // per no ser clicada quan es veu
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.visible = false;
                this.callback();
            }, 1000);
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.visible = true;
            this.callback();
        }
    };

    const default_options = {
        pairs:2,
        difficulty:'normal'
    };


    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
    
    console.log(options);
    var lastCard;
    var pairs = options.pairs;
    var difficulty = options.difficulty;
    var points = 100;
    var temps = 1000;
    var restapunts

    if (options.difficulty == 'hard'){
        temps = 500;
        restapunts  =50;
    }
    else if (options.difficulty == 'normal'){
        temps = 1000;
        restapunts  =25;
    }
    else {
        temps = 5000;
        restapunts  =10;
    };
    var points = 100;
    return {
        init: function (call){
            var items = resources.slice(); // Copiem l'array
            items.sort(() => Math.random() - 0.5); // Aleatòria
            items = items.slice(0, pairs); // Agafem els primers
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5); // Aleatòria

            var c = items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
            c.forEach( obj =>{
                obj.current = obj.front;
                obj.clickable = false; //inicialment les cartes no es poden clicar
                obj.visible = false; // tampoc son visibles
                setTimeout(() => {
                    obj.current = back;
                    obj.clickable = true;
                    obj.callback()
                }, temps);
            });
            
            return c;


        },
        click: function (card){
            if (!card.clickable || card.visible) return;
            card.goFront();
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=25;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        
        },
        save: function (){
            var partida = {
                uuid: localStorage.uuid,
                pairs: pairs,
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
        }
    }
}();
