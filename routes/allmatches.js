const express = require('express');
const router = express.Router();
const axios  = require('axios');
const setNewTournament  = require('../scripts/FirebaseSetNewTournament');
const registerAllTeams  = require('../scripts/FirebaseRegisterAllTeams');
const updateLogo  = require('../scripts/UpdateLogo');


const callAPI = async () => {
    try {
        let respuestaAPI = await axios.get(`https://api.pandascore.co/csgo/matches?sort=begin_at&filter[status]=not_started,running&token=yVPKLDCsTsxGSJcEWb_gbzDiC6NSWVQ3thriZ3Qft_p6lGvLxPc`)
        let {data} = respuestaAPI;
        //console.log("voy a llamar a nuevo tournament");
        return data;
    } catch (error) {
        console.log(error);
    }
}

router.get('/', async (req, res) => {
    let response = await callAPI();
    res.send(response);
    setNewTournament(response);
    registerAllTeams(response);
    updateLogo(response);
});

module.exports = router;