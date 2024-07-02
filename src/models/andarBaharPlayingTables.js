const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'andarBaharPlayingTables';

const PlayingTablesSchema = new Schema({
    gameId: { type: String, default: "" },
    gameType: { type: String, default: "AnderBahar" },
    activePlayer: { type: Number, default: 0 },
    maxSeat: { type: Number, default: 6 },
    entryFee: { type: Number },
    decalreCard: { type: String, default: 0 },
    boot: { type: Number, default: 0 },
    turnStartTimer: { type: Date },
    jobId: { type: String, default: "" },
    turnDone: { type: Boolean, default: false },
    playerInfo: [],
    gameState: { type: String, default: "" },
    dealerSeatIndex: { type: Number, default: -1 },
    turnSeatIndex: { type: Number, default: -1 },
    gameTimer: {},
    gameResult: {},
    gameTracks: [],
    ANBCards: { ander: [], bahar: [] },
    callFinalWinner: { type: Boolean, default: false },
    isLastUserFinish: { type: Boolean, default: false },
    isFinalWinner: { type: Boolean, default: false },
    counters: {
        totalAnderChips: { type: Number, default: 0 },
        totalBaharChips: { type: Number, default: 0 },
    },
    history: [],
    betLists: [],
    lastGameResult: [],
    totalbet: { type: Number, default: 0 },
}, { versionKey: false });

module.exports = mongoose.model(collectionName, PlayingTablesSchema, collectionName);
