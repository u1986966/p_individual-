addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./phasergame.html");
    });

    document.getElementById('play2').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./phasergame2.html");
    });
});