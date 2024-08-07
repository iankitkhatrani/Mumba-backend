const mongoose = require("mongoose")
const MongoID = mongoose.Types.ObjectId;

const PlayingTables = mongoose.model("andarBaharPlayingTables");
const GameUser = mongoose.model("users");

const CONST = require("../../constant");
const logger = require("../../logger");
const commandAcions = require("../helper/socketFunctions");
const roundStartActions = require("./roundStart");
const gameFinishActions = require("./gameFinish");
const checkWinnerActions = require("./checkWinner");
const checkUserCardActions = require("./checkUserCard");
const walletActions = require("./updateWallet");
/*
    bet : 10,
    actionplace:1 || 2
*/

module.exports.action = async (requestData, client) => {
    try {
        logger.info("Ander Bahar action requestData : ", requestData);

        if (typeof client.tbid == "undefined" || typeof client.uid == "undefined" || typeof client.seatIndex == "undefined") {
            commandAcions.sendDirectEvent(client.sck, CONST.ACTION_ANADAR_BAHAR, requestData, false, "User session not set, please restart game!");
            return false;
        }

        client.action = true;

        let gwh = {
            _id: MongoID(client.uid)
        }
        let UserInfo = await GameUser.findOne(gwh, {}).lean();
        logger.info("action UserInfo : ", gwh, JSON.stringify(UserInfo));


        const wh = {
            _id: MongoID(client.tbid.toString()),
            // status: "StartBatting"
        }
        const project = {}
        let tabInfo = await PlayingTables.findOne(wh, project).lean();
        logger.info("action tabInfo : ", tabInfo);

        let totalWallet = Number(UserInfo.chips) + Number(UserInfo.winningChips)

        if (Number(requestData.bet) > Number(totalWallet)) {
            logger.info("action client.su ::", client.seatIndex);
            delete client.action;
            commandAcions.sendDirectEvent(client.sck, CONST.ACTION_ANADAR_BAHAR, requestData, false, "Please add wallet!!");
            return false;
        }
        logger.info("requestData.bet   => ", requestData.bet)
        requestData.bet = Number(Number(requestData.bet).toFixed(2))

        await walletActions.deductWallet(client.uid, -requestData.bet, 2, "AnderBahar", tabInfo, client.id, client.seatIndex);

        if (tabInfo == null) {
            logger.info("action user not turn ::", tabInfo);
            delete client.action;
            return false
        }

        let updateData = {
            $set: {},
            $inc: {},
        };

        if (requestData.item === 'Andar') {
            logger.info("action user not turn Andar ::", tabInfo);

            let playerInfo = tabInfo.playerInfo[client.seatIndex];
            playerInfo.betLists.push(requestData);
            updateData.$set['playerInfo.$.betLists'] = playerInfo.betLists;
            updateData.$inc['counters.totalAnderChips'] = requestData.bet;

            const upWh = {
                _id: MongoID(client.tbid.toString()),
                'playerInfo.seatIndex': Number(client.seatIndex),
            };

            tabInfo = await PlayingTables.findOneAndUpdate(upWh, updateData, {
                new: true,
            });

            logger.info(" blackAmount table Info -->", tabInfo)
            commandAcions.sendEventInTable(tabInfo._id.toString(), CONST.ACTION_ANADAR_BAHAR, {
                bet: requestData.bet,
                item: requestData.item,
                totalAnderChips: tabInfo.counters.totalAnderChips
            });

        } else if (requestData.item === 'Bahar') {
            let playerInfo = tabInfo.playerInfo[client.seatIndex];
            playerInfo.betLists.push(requestData);
            updateData.$set['playerInfo.$.betLists'] = playerInfo.betLists;
            updateData.$inc['counters.totalBaharChips'] = requestData.bet;


            const upWh = {
                _id: MongoID(client.tbid.toString()),
                'playerInfo.seatIndex': Number(client.seatIndex),
            };

            tabInfo = await PlayingTables.findOneAndUpdate(upWh, updateData, {
                new: true,
            });

            logger.info("whiteAmount table Info -->", tabInfo)
            commandAcions.sendEventInTable(tabInfo._id.toString(), CONST.ACTION_ANADAR_BAHAR, {
                bet: requestData.bet,
                item: requestData.item,
                totalBaharChips: tabInfo.counters.totalBaharChips
            });
        }

        delete client.action;
        return true;
    } catch (e) {
        logger.info("Exception action : ", e);
    }
}

/*
    winamount : 10,
    actionplace:1 || 2
*/
module.exports.CHECKOUT_ANADAR_BAHAR = async (requestData, client) => {
    try {
        logger.info("check out requestData : ", requestData);
        if (typeof client.tbid == "undefined" || typeof client.uid == "undefined" || typeof client.seatIndex == "undefined" || typeof requestData.winamount == "undefined") {
            commandAcions.sendDirectEvent(client.sck, CONST.CHECKOUT_ANADAR_BAHAR, requestData, false, "User session not set, please restart game!");
            return false;
        }
        if (typeof client.action != "undefined" && client.action) return false;

        client.action = false;

        const wh = {
            _id: MongoID(client.tbid.toString()),
        }
        const project = {

        }
        const tabInfo = await PlayingTables.findOne(wh, project).lean();
        logger.info("check out tabInfo : ", tabInfo);

        if (tabInfo == null) {
            logger.info("check out user not turn ::", tabInfo);
            delete client.action;
            return false
        }
        if (tabInfo.turnDone) {
            logger.info("check out : client.su ::", client.seatIndex);
            delete client.action;
            commandAcions.sendDirectEvent(client.sck, CONST.CHECKOUT_ANADAR_BAHAR, requestData, false, "Turn is already taken!");
            return false;
        }


        let gwh = {
            _id: MongoID(client.uid)
        }
        let UserInfo = await GameUser.findOne(gwh, {}).lean();
        logger.info("check out UserInfo : ", gwh, JSON.stringify(UserInfo));

        let updateData = {
            $set: {}
        }
        updateData.$set["playerInfo.$.playStatus"] = "check out"

        winAmount = Number(Number(requestData.winamount).toFixed(2))

        await walletActions.deductWallet(client.uid, winAmount, 2, "aviator Win", tabInfo, client.id, client.seatIndex);

        if (requestData.actionplace == 1)
            updateData.$set["playerInfo.$.chalValue"] = 0;
        else
            updateData.$set["playerInfo.$.chalValue1"] = 0;


        updateData.$set["turnDone"] = true;
        commandAcions.clearJob(tabInfo.job_id);

        const upWh = {
            _id: MongoID(client.tbid.toString()),
            "playerInfo.seatIndex": Number(client.seatIndex)
        }
        logger.info("action upWh updateData :: ", upWh, updateData);

        const tb = await PlayingTables.findOneAndUpdate(upWh, updateData, { new: true });
        logger.info("action tb : ", tb);

        let response = {
            seatIndex: tb.turnSeatIndex,
            winamount: winAmount
        }
        commandAcions.sendEventInTable(tb._id.toString(), CONST.CHECKOUT_ANADAR_BAHAR, response);
        delete client.action;

        // let activePlayerInRound = await roundStartActions.getPlayingUserInRound(tb.playerInfo);
        // logger.info("action activePlayerInRound :", activePlayerInRound, activePlayerInRound.length);
        // if (activePlayerInRound.length == 1) {
        //     await gameFinishActions.lastUserWinnerDeclareCall(tb);
        // } else {
        //     await roundStartActions.nextUserTurnstart(tb);
        // }

        return true;
    } catch (e) {
        logger.info("Exception action : ", e);
    }
}

module.exports.winnerDeclareCall = async (tblInfo) => {
    const tabInfo = tblInfo;
    try {
        const tbid = tabInfo._id.toString();

        if (tabInfo.gameState === CONST.ROUND_END) return false;

        let updateData = {
            $set: {},
            $inc: {},
        };

        updateData.$set['isFinalWinner'] = true;
        updateData.$set['gameState'] = CONST.ROUND_END;
        updateData.$set['playerInfo.$.playerStatus'] = CONST.WON;

        const upWh = {
            _id: MongoID(tbid),
            'playerInfo.seatIndex': Number(tabInfo.playerInfo[tabInfo.currentPlayerTurnIndex].seatIndex),
        };

        const tbInfo = await PlayingTables.findOneAndUpdate(upWh, updateData, {
            new: true,
        });
        logger.info('\n winnerDeclareCall tbInfo  ==>', tbInfo);

        const playerInGame = await getPlayingUserInRound(tbInfo.playerInfo);
        const table = await this.manageUserScore(playerInGame, tabInfo);
        logger.info('\n Final winnerDeclareCall tbInfo  ==>', tbInfo);

        let amount = (table.tableAmount * CONST.commission) / 100;
        table.tableAmount -= amount;

        updateData.$inc['playerInfo.$.gameChips'] = table.tableAmount;
        updateData.$set['tableAmount'] = table.tableAmount;

        const tableInfo = await PlayingTables.findOneAndUpdate(upWh, updateData, {
            new: true,
        });

        for (let i = 0; i < playerInGame.length; i++) {
            tableInfo.gameTracks.push({
                _id: playerInGame[i]._id,
                username: playerInGame[i].username,
                seatIndex: playerInGame[i].seatIndex,
                cards: playerInGame[i].cards,
                gCard: playerInGame[i].gCard,
                gameChips: playerInGame[i].gameChips,
                point: playerInGame[i].point,
                gameBet: tableInfo.entryFee,
                result: playerInGame[i].playerStatus === CONST.WON ? CONST.WON : CONST.LOST,
            });
        }

        const winnerTrack = await gameTrackActions.gamePlayTracks(tableInfo.gameTracks, tableInfo);

        for (let i = 0; i < tableInfo.gameTracks.length; i++) {
            if (tableInfo.gameTracks[i].result === CONST.WON) {
                logger.info(' Add Win COunter');
                await walletActions.addWallet(tableInfo.gameTracks[i]._id, Number(winnerTrack.winningAmount), 'Credit', 'Win', tableInfo);
            }
        }

        const playersScoreBoard = await countPlayerScore(tableInfo);
        let winnerViewResponse = winnerViewResponseFilter(playersScoreBoard);

        const response = {
            playersScoreBoard: winnerViewResponse.userInfo,
            totalLostChips: tableInfo.tableAmount,
        };

        commandAcions.sendEventInTable(tableInfo._id.toString(), CONST.ANADAR_BAHAR_WINNER, response);
        const gsbResponse = { ...response, wildCard: tableInfo.wildCard, gamePlayType: tableInfo.gamePlayType };

        const addLastScoreBoard = tableInfo.lastGameScoreBoard.push(gsbResponse);
        logger.info('addLastScoreBoard Score board ==>', addLastScoreBoard);

        const qu = {
            _id: MongoID(tbid),
        };

        let updatedata = {
            $set: {
                gameTracks: tableInfo.gameTracks,
                lastGameScoreBoard: tableInfo.lastGameScoreBoard,
            },
        };

        let tblInfo = await PlayingTables.findOneAndUpdate(qu, updatedata, { new: true });
        logger.info('set gamePlaytracks and pointPoolTable =>', tblInfo);

        let jobId = commandAcions.GetRandomString(10);
        let delay = commandAcions.AddTime(4);
        await commandAcions.setDelay(jobId, new Date(delay));

        commandAcions.sendEventInTable(tableInfo._id.toString(), CONST.GAME_SCORE_BOARD, gsbResponse);

        let gamePlayData = JSON.parse(JSON.stringify(tableInfo));
        const rest = omit(gamePlayData, ['_id']);
        let tableHistory = { ...rest, tableId: tableInfo._id };

        let tableHistoryData = await commonHelper.insert(TableHistory, tableHistory);
        logger.info('gameFinish.js tableHistory Data => ', tableHistoryData);

        await roundEndActions.roundFinish(tableInfo);
    } catch (err) {
        logger.error('gameFinish.js  WinnerDeclareCall => ', err);
    }
};

module.exports.playerLastScoreBoard = async (requestData, client) => {
    try {
        const wh = {
            _id: MongoID(client.tbid.toString()),
        };

        const project = {};
        const tabInfo = await PlayingTables.findOne(wh, project).lean();

        if (tabInfo === null) {
            logger.info('playerLastScoreBoard user not turn ::', tabInfo);
            return false;
        }

        let length = tabInfo.lastGameScoreBoard.length;

        let msg = {
            msg: 'Data is not available',
        };

        if (length !== 0) {
            commandAcions.sendDirectEvent(client.sck, CONST.LAST_GAME_SCORE_BOARD, tabInfo.lastGameScoreBoard[length - 1]);
        } else {
            commandAcions.sendDirectEvent(client.sck, CONST.LAST_GAME_SCORE_BOARD, msg);
        }

        return true;
    } catch (e) {
        logger.error('gamePlay.js playerDrop error => ', e);
    }
};

module.exports.lastGameScoreBoard = async (requestData, client) => {
    try {
        const wh = {
            _id: MongoID(client.tbid.toString()),
        };

        const project = {};
        const tabInfo = await PlayingTables.findOne(wh, project).lean();

        if (tabInfo === null) {
            logger.info('table not found', tabInfo);
            return false;
        }

        let msg = {
            msg: 'Data is not available',
        };

        if (tabInfo.lastGameResult) {
            commandAcions.sendDirectEvent(client.sck, CONST.ANDER_BAHAR_PREVIOUS_RESULT_HISTORY, { list: tabInfo.lastGameResult });
        } else {
            commandAcions.sendDirectEvent(client.sck, CONST.ANDER_BAHAR_PREVIOUS_RESULT_HISTORY, msg);
        }

        return true;
    } catch (e) {
        logger.error('lastGameScoreBoard playerDrop error => ', e);
    }
};

module.exports.clearAllBet = async (requestData, client) => {
    try {
        let gwh = {
            _id: MongoID(client.uid)
        }
        let UserInfo = await GameUser.findOne(gwh, {}).lean();
        logger.info("action clearAllBet : ", gwh, JSON.stringify(UserInfo));


        const wh = {
            _id: MongoID(client.tbid.toString()),
            // status: "StartBatting"
        }
        const project = {}
        let tabInfo = await PlayingTables.findOne(wh, project).lean();
        logger.info("clearAllBet tabInfo : ", tabInfo);


        if (tabInfo == null) {
            logger.info("action user not turn ::", tabInfo);
            delete client.action;
            return false
        }

        let updateData = {
            $set: {},
            $inc: {},
        };

        let playerInfo = tabInfo.playerInfo[client.seatIndex];
        logger.info("clearAllBet playerInfo : ", playerInfo);

        updateData.$set['playerInfo.$.betLists'] = [];

        const upWh = {
            _id: MongoID(client.tbid.toString()),
            'playerInfo.seatIndex': Number(client.seatIndex),
        };

        tabInfo = await PlayingTables.findOneAndUpdate(upWh, updateData, {
            new: true,
        });

        if (tabInfo == null) {
            logger.info("Table Not Found ::", tabInfo);
            return false
        }


        if (tabInfo) {
            
            const sumOfBets = playerInfo.betLists.reduce((accumulator, currentBet) => {
                return accumulator + currentBet.bet;
              }, 0); // Initial value is 0
            
              await walletActions.addWallet(playerInfo._id, Number(sumOfBets), 'Credit', 'ClearBet', tabInfo,client,client.seatIndex);

            commandAcions.sendDirectEvent(client.sck, CONST.ANADAR_BAHAR_CLEAR_BET, { status: true, msg: "Bet cleared successfully" });
        } else {
            commandAcions.sendDirectEvent(client.sck, CONST.ANADAR_BAHAR_CLEAR_BET, { status: false, msg: "Bet Not cleared" });
        }

        return true;
    } catch (e) {
        logger.error('lastGameScoreBoard playerDrop error => ', e);
    }
};

module.exports.doubleUP = async (requestData, client) => {
    try {
        const gwh = {
            _id: MongoID(client.uid)
        }
        const UserInfo = await GameUser.findOne(gwh, {}).lean();
        logger.info("action clearAllBet : ", gwh, JSON.stringify(UserInfo));

        const wh = {
            _id: MongoID(client.tbid.toString()),
            // status: "StartBatting"
        }
        const project = {}
        let tabInfo = await PlayingTables.findOne(wh, project).lean();
        logger.info("clearAllBet tabInfo : ", tabInfo);

        if (tabInfo == null) {
            logger.info("action user not turn ::", tabInfo);
            delete client.action;
            return false;
        }

        const playerInfo = tabInfo.playerInfo[client.seatIndex];
        logger.info("clearAllBet playerInfo : ", playerInfo);

        if (!playerInfo || !playerInfo.betLists) {
            logger.info("No betLists found for the player.");
            return false;
        }

        // Initialize variables to store doubled amounts for "Andar" and "Bahar"
        let totalDoubledAndar = 0;
        let totalDoubledBahar = 0;

        // Double the bet amounts and accumulate the totals
        playerInfo.betLists.forEach(bet => {
            // Double the bet amount
            bet.bet *= 2;
            if (bet.item === "Andar") {
                totalDoubledAndar += bet.bet;
            } else if (bet.item === "Bahar") {
                totalDoubledBahar += bet.bet;
            }
        });

        // Prepare the update data
        const updateData = {
            $set: {
                'playerInfo.$.betLists': playerInfo.betLists
            }
        };

        const upWh = {
            _id: MongoID(client.tbid.toString()),
            'playerInfo.seatIndex': Number(client.seatIndex),
        };

        const updatedTableInfo = await PlayingTables.findOneAndUpdate(upWh, updateData, {
            new: true,
        });

        if (!updatedTableInfo) {
            logger.info("Table Not Found ::", updatedTableInfo);
            return false;
        }

        let totalAmount = ((totalDoubledBahar/2)+(totalDoubledAndar/2))
        logger.info("totalAmount  : ",totalAmount)

        await walletActions.deductWallet(client.uid, -totalAmount, 2, "AnderBahar", tabInfo, client.id, client.seatIndex);

        // Send event to client with separated doubled amounts
        commandAcions.sendDirectEvent(client.sck, CONST.ANADAR_BAHAR_DOUBLE_BET, {
            status: true,
            msg: "Bet doubled successfully",
            totalDoubledAndar,
            totalDoubledBahar
        });

        return true;
    } catch (e) {
        logger.error('doubleUP error => ', e);
        return false;
    }
};

