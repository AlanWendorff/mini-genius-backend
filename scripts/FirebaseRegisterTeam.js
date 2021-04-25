const FirebaseConfig  = require('../config/FirebaseConfig');

const registerTeam = (response, Teamid) =>{

    const database = FirebaseConfig();
    let pathsDatabase = database.ref('paths').once('value').then(function (snapshot) {
        let responseOfDatabase = snapshot.val();
        let pathsDatabase = Object.values(responseOfDatabase);
        return pathsDatabase;
    }); 

    pathsDatabase.then(pathsDatabase => {
        let teams = [];
        let matchesFiltered = response.filter(status => status.status !== "canceled");
        matchesFiltered.map(match => {
            let {opponents} = match;
            let counterTeam = opponents.find(element => element.opponent.id !== Teamid);
            if (counterTeam.length !== 0) {
                let {id, image_url, name, slug} = counterTeam.opponent;
                if (image_url === null) {
                    image_url = "https://i.ibb.co/Hxy6gm2/csgo-Logo-Default.png";
                }
                teams.push(
                {
                    "id" : id,
                    "img" : image_url,
                    "name" : name,
                    "path" : slug
                });
            }
        }) 
        
        function comparer(otherArray){
            return function(current){
                return otherArray.filter(function(other){
                return other.id === current.id
                }).length === 0;
            }
        }
        let onlyInB = teams.filter(comparer(pathsDatabase));
        
        let cleanTeam = onlyInB.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
        cleanTeam.map(team=> {
            let {path} = team;
            if (path !== undefined) {
                database.ref().child('paths/'+path).set({
                    "id" : team.id,
                    "img" : team.img,
                    "name" : team.name,
                    "path" : team.path
                });
            }
        }) 
    });
}

module.exports = registerTeam;