const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'spinnerTables';

const PlayingTablesSchema = new Schema({
    gameId: { type: String, default: "" },
    activePlayer: { type: Number, default: 0 },
    playerInfo: [],
    gameState: { type: String, default: "" },
    turnStartTimer: { type: Date },
    jobId: { type: String, default: "" },
    turnDone: { type: Boolean, default: false },
    gameTimer: {},
    gameTracks: [],
    callFinalWinner: { type: Boolean, default: false },
    isLastUserFinish: { type: Boolean, default: false },
    isFinalWinner: { type: Boolean, default: false },
    history:[],
    betamount:[],
    totalbet:{ type: Number, default: 0 },
    itemObject:"",
    TableObject:[0,1,2,3,4,5,6,7,8,9],
    minbet:{ type: Number, default: 0 },
    maxbet:{ type: Number, default: 1000 }
}, { versionKey: false });

module.exports = mongoose.model(collectionName, PlayingTablesSchema, collectionName);