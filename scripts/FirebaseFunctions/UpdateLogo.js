const FirebaseConfig = require("../../config/FirebaseConfig");
const getColor = require("../Helpers/ExtractColorOther");
const database = FirebaseConfig();

const updateLogo = (concated) => {
  let pathsDatabase = database
    .ref("teams")
    .once("value")
    .then(function (snapshot) {
      let responseOfDatabase = snapshot.val();
      let pathsDatabase = Object.values(responseOfDatabase);
      return pathsDatabase;
    });

  pathsDatabase.then((pathsDatabase) => {
    concated.map((match) => {
      let { opponents } = match;
      if (opponents[0] !== false && opponents[1] !== false) {
        opponents.map((opponent) => {
          let { image_url, name, id } = opponent.opponent;
          if (name) {
            let teamDatabase = pathsDatabase.find(
              (element) => element.id === id
            );
            if (teamDatabase !== undefined) {
              if (image_url !== null) {
                if (teamDatabase.img !== image_url) {
                  let query = database
                    .ref()
                    .child("teams")
                    .orderByChild("id")
                    .equalTo(id);
                  query.once("child_added", async function (snapshot) {
                    snapshot.ref.update({
                      img: image_url,
                      colors: await getColor(image_url),
                    });
                  });
                }
                //console.log("la image url de api es null");
              }
              if (teamDatabase.name !== name) {
                let query = database
                  .ref()
                  .child("teams")
                  .orderByChild("id")
                  .equalTo(id);
                query.once("child_added", function (snapshot) {
                  snapshot.ref.update({ name: name });
                });
              }
              //console.log("database undefined");
            }
            //console.log("name del oponent no existe");
          }
        });
        //console.log("length de oponentes es corto");
      }
    });
  });
};

module.exports = updateLogo;