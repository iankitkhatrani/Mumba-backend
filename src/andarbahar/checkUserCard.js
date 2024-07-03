
const mongoose = require("mongoose")
const MongoID = mongoose.Types.ObjectId;

const PlayingTables = mongoose.model("andarBaharPlayingTables");
const commandAcions = require("../helper/socketFunctions");

const logger = require("../../logger");
const CONST = require("../../constant");
const _ = require("underscore");

module.exports.getWinnerUser = async (table, declareCard) => {
    try {
        logger.info("\n declareCard ->", declareCard)
        logger.info("\n getWinnerUser table ->", table)
        let deck = [
            'H-1-0', 'H-2-0', 'H-3-0', 'H-4-0', 'H-5-0', 'H-6-0', 'H-7-0', 'H-8-0', 'H-9-0', 'H-10-0', 'H-11-0', 'H-12-0', 'H-13-0',
            'S-1-0', 'S-2-0', 'S-3-0', 'S-4-0', 'S-5-0', 'S-6-0', 'S-7-0', 'S-8-0', 'S-9-0', 'S-10-0', 'S-11-0', 'S-12-0', 'S-13-0',
            'D-1-0', 'D-2-0', 'D-3-0', 'D-4-0', 'D-5-0', 'D-6-0', 'D-7-0', 'D-8-0', 'D-9-0', 'D-10-0', 'D-11-0', 'D-12-0', 'D-13-0',
            'C-1-0', 'C-2-0', 'C-3-0', 'C-4-0', 'C-5-0', 'C-6-0', 'C-7-0', 'C-8-0', 'C-9-0', 'C-10-0', 'C-11-0', 'C-12-0', 'C-13-0'
        ];

        // let declareCard = 'S-6-0';

        let ANBCards = {
            ander: [],
            bahar: []
        };

        // Fisher-Yates (Knuth) Shuffle
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Remove the declare card from the deck
        deck = deck.filter(card => card !== declareCard);

        // Shuffle the deck
        deck = shuffle(deck);

        let res = declareCard.split('-')[1];
        logger.info("getWinnerUser res =>", res);

        let isDeclareCardFound = false;
        let turn = 'Ander'; // To keep track of whose turn it is

        for (let i = 0; i < deck.length; i++) {
            let splitDeckCard = deck[i].split('-'); // Split card from deck
            if (splitDeckCard[1] === res) { // Compare values
                logger.info("getWinnerUser check-->");
                isDeclareCardFound = true;
                if (turn === 'Ander') {
                    ANBCards.ander.push(deck[i]);
                } else {
                    ANBCards.bahar.push(deck[i]);
                }
                break;
            }

            if (turn === 'Ander') {
                ANBCards.ander.push(deck[i]);
                turn = 'Bahar';
            } else {
                ANBCards.bahar.push(deck[i]);
                turn = 'Ander';
            }
        }

        logger.info("getWinnerUser turn", turn)
        logger.info('getWinnerUser ANBCards:', ANBCards);

        //updateAnbCards(ANBCards);

        let tb = await PlayingTables.findOneAndUpdate({ _id: MongoID(table._id) }, { $set: { ANBCards: ANBCards } }, { new: true });
        logger.info("getWinnerUser tb : ", tb);

        await this.sendCards(tb);

        return turn;

    } catch (error) {
        logger.error('getWinnerUser error => ', error);
    }
}

module.exports.sendCards = async (tb) => {
    let index = 0; // Start index
    let turn = 'ander'; // To alternate between ander and bahar
    const totalCards = tb.ANBCards.ander.length + tb.ANBCards.bahar.length;

    const intervalId = setInterval(() => {
        // Determine which deck to send from
        let card = null;
        if (turn === 'ander' && index < tb.ANBCards.ander.length) {
            card = tb.ANBCards.ander[index];
        } else if (turn === 'bahar' && index < tb.ANBCards.bahar.length) {
            card = tb.ANBCards.bahar[index];
        }

        // Send card if available
        if (card) {
            const response = {
                turn,
                card
            };
            commandAcions.sendEventInTable(tb._id.toString(), CONST.ANDER_BAHAR_SHOW_CARDS, response);
            logger.info(`Sent card: ${card} from ${turn}`);
        }

        // Switch turns
        turn = turn === 'ander' ? 'bahar' : 'ander';

        // Increment index every two turns
        if (turn === 'ander') {
            index++;
        }

        // Stop the interval if all cards have been sent
        if (index >= tb.ANBCards.ander.length && index >= tb.ANBCards.bahar.length) {
            clearInterval(intervalId);
            console.log('All cards have been sent.');
        }
    }, 500);

    return
}

module.exports.getWinState = (userCards, hukum) => {

    // let hukumCards = this.gethukumList(userCards, hukum);
    // logger.info("\ngetWinState hukumCards : ", hukumCards);

    // let remaningCards = _.difference(userCards, hukumCards);
    // logger.info("getWinState hciuc :", remaningCards, hukumCards, userCards);

    // remaningCards = remaningCards.sort((a, b) => {
    //     return b.split('-')[1] - a.split('-')[1];
    // })
    // logger.info("getWinState remaningCards :", remaningCards);

    let cards = userCards //this.replaceHukumCards(remaningCards, hukum);
    logger.info("getWinState cards :", cards);

    cards = cards.sort((a, b) => {
        return b.split('-')[1] - a.split('-')[1];
    });
    logger.info("getWinState cards :", cards);

    let resTrail = this.checkTrail(cards);
    logger.info("getWinState resTrail :", resTrail);

    if (resTrail.flag) {
        return resTrail;
    }

    let resPureSeq = this.checkPureSeq(cards);
    logger.info("getWinState resPureSeq :", resPureSeq);

    if (resPureSeq.flag) {
        return resPureSeq;
    }

    let resSeq = this.checkSeq(cards);
    logger.info("getWinState resSeq :", resSeq);

    if (resSeq.flag) {
        return resSeq;
    }

    let resColor = this.checkColor(cards);
    logger.info("getWinState resColor :", resColor);

    if (resColor.flag) {
        return resColor;
    }

    let resPair = this.checkPair(cards);
    logger.info("getWinState resPair :", resPair);

    if (resPair.flag) {
        return resPair;
    }

    return {
        flag: true,
        cards: cards,
        cardCount: this.countCards(cards),
        status: "High_Cards",
        index: 6,
        winResult: "",
    }
}

module.exports.gethukumList = (nCards, hukum) => {
    logger.info("gethukumList check  cards -->", nCards)
    let hukumList = [];
    nCards = nCards.map((e) => {
        logger.info("gethukumList check  cards  E-->", e)
        if ((e.split("-")[1]) === (hukum.split("-")[1])) {
            hukumList.push(e);
        }
        return e;
    })
    return hukumList;
}

module.exports.replaceHukumCards = (remaningCards, hukum) => {
    logger.info("replaceHukumCards remaningCards : ", remaningCards.length);
    if (remaningCards.length == 0) {
        return [
            "H-1-0", "S-1-0", "D-1-0"
        ]
    } else if (remaningCards.length == 1) {
        let suit = ["H", "S", "D", "C"];
        let cards = [remaningCards[0]];
        for (let i = 0; i < (3 - remaningCards.length); i++) {
            for (let j = 0; j < suit.length; j++) {
                let card = suit[j] + "-" + remaningCards[0].split('-')[1] + "-0";
                if (cards.indexOf(card) == -1) {
                    cards.push(card);
                    break;
                }
            }
        }
        return cards;
    } else if (remaningCards.length == 2) {
        logger.info("replaceHukumCards remaningCards 11: ", remaningCards[0].split('-')[0], remaningCards[1].split('-')[0]);
        if (remaningCards[0].split('-')[0] == remaningCards[1].split('-')[0]) {
            logger.info("replaceHukumCards remaningCards 11: ", remaningCards.length);
            let cards = this.getRemaningCards(remaningCards);
            return cards;
        } else {
            let cards = this.getRemaningCards(remaningCards);
            return cards;
        }
    } else {
        return remaningCards;
    }
}

module.exports.getRemaningCards = (remaningCards) => {
    logger.info("getRemaningCards remaningCards 11: ", remaningCards)
    if (remaningCards[0].split('-')[1] == 12 && remaningCards[1].split('-')[1] == 1) {

        let card = remaningCards[0].split('-')[0] + "-14-0"
        remaningCards.push(card);

        return remaningCards;
    } else if (remaningCards[0].split('-')[1] == 13 && remaningCards[1].split('-')[1] == 12) {

        let card = remaningCards[0].split('-')[0] + "-1-0"
        remaningCards.push(card);

        return remaningCards;
    } else if (remaningCards[0].split('-')[1] == 2 && remaningCards[1].split('-')[1] == 3) {

        let card = remaningCards[0].split('-')[0] + "-" + (remaningCards[1].split('-')[1] - 1) + "-0"
        remaningCards.push(card);

        return remaningCards;
    } else if ((remaningCards[1].split('-')[1] - remaningCards[0].split('-')[1]) == -1) {
        let no = Number(remaningCards[0].split('-')[1]) + 1;
        let card = remaningCards[0].split('-')[0] + "-" + no + "-0"
        remaningCards.push(card);

        return remaningCards;
    } else if ((remaningCards[1].split('-')[1] - remaningCards[0].split('-')[1]) == -2) {
        let no = Number(remaningCards[1].split('-')[1]) + 1
        let card = remaningCards[0].split('-')[0] + "-" + no + "-0"
        remaningCards.push(card);

        return remaningCards;
    } else if (remaningCards[0].split('-')[0] == remaningCards[1].split('-')[0]) {

        let card = remaningCards[0].split('-')[0] + "-1-0"
        remaningCards.push(card); 1

        return remaningCards;
    } else {
        let suit = ["H", "S", "D", "C"];
        let cards = remaningCards;
        logger.info("getRemaningCards cards 11: ", cards)
        for (let i = 0; i < (3 - remaningCards.length); i++) {
            for (let j = 0; j < suit.length; j++) {
                let card = suit[j] + "-" + remaningCards[0].split('-')[1] + "-0";
                logger.info("getRemaningCards card 11: ", card)
                if (cards.indexOf(card) == -1) {
                    cards.push(card);
                    break;
                }
            }
        }
        return cards;
    }
}

module.exports.countCards = (cards) => {
    let sum = 0;
    for (let i = 0; i < cards.length; i++) {
        let cardsC = (Number(cards[i].split('-')[1]) == 1) ? 14 : Number(cards[i].split('-')[1])
        sum = sum + cardsC
    }
    return sum
}

module.exports.checkTrail = (cards) => {
    let response = {
        flag: false
    }
    for (let i = 0; i < cards.length; i++) {
        if (cards[0].split('-')[1] != cards[i].split('-')[1]) {
            return response;
        }
    }
    if (cards[0].split('-')[1] == 1) {
        return {
            flag: true,
            cards: cards,
            cardCount: (14) * 3,
            status: "Tie",
            index: 1
        }
    } else {
        return {
            flag: true,
            cards: cards,
            cardCount: (cards[0].split('-')[1]) * 3,
            status: "Tie",
            index: 1
        }
    }
}

module.exports.checkSeqCondition = (cards, flag) => {
    if (cards[0].split('-')[1] == 3 && cards[1].split('-')[1] == 2 && cards[2].split('-')[1] == 1) {
        return {
            flag: true,
            cards: cards,
            cardCount: 38,
            status: (flag) ? "Pure_Sequence" : "Sequence",
            index: (flag) ? 2 : 3
        }
    } else if (cards[0].split('-')[1] == 13 && cards[1].split('-')[1] == 12 && cards[2].split('-')[1] == 1) {
        return {
            flag: true,
            cards: cards,
            cardCount: 37,
            status: (flag) ? "Pure_Sequence" : "Sequence",
            index: (flag) ? 2 : 3
        }
    } else {
        return {
            flag: false
        }
    }
}

module.exports.checkPureSeq = (cards) => {
    logger.info("checkPureSeq  cards : ", cards);
    let response = {
        flag: false
    }
    for (let i = 0; i < cards.length; i++) {
        if (cards[0].split('-')[0] != cards[i].split('-')[0]) {
            return response;
        }
    }

    let special_seq = this.checkSeqCondition(cards, true);
    if (special_seq.flag) {
        return special_seq
    }

    for (let i = 0; i < cards.length - 1; i++) {
        if ((cards[i].split('-')[1] - cards[i + 1].split('-')[1]) != 1) {
            return response;
        }
    }

    return {
        flag: true,
        cards: cards,
        cardCount: this.countCards(cards),
        status: "Pure_Sequence",
        index: 2
    }
}

module.exports.checkSeq = (cards) => {
    logger.info("checkSeq  cards : ", cards);
    let response = {
        flag: false
    }

    let special_seq = this.checkSeqCondition(cards, true);
    if (special_seq.flag) {
        return special_seq
    }

    for (let i = 0; i < cards.length - 1; i++) {
        if ((cards[i].split('-')[1] - cards[i + 1].split('-')[1]) != 1) {
            return response;
        }
    }

    return {
        flag: true,
        cards: cards,
        cardCount: this.countCards(cards),
        status: "Sequence",
        index: 3
    }
}

module.exports.checkColor = (cards) => {
    logger.info("checkColor  cards : ", cards);
    let response = {
        flag: false
    }
    for (let i = 0; i < cards.length; i++) {
        if (cards[0].split('-')[0] != cards[i].split('-')[0]) {
            return response;
        }
    }
    return {
        flag: true,
        cards: cards,
        cardCount: this.countCards(cards),
        status: "Color",
        index: 4
    }
}

module.exports.checkPair = (cards) => {
    logger.info("checkPair  cards : ", cards);
    let response = {
        flag: false
    }
    let same = false;
    for (let i = 0; i < cards.length - 1; i++) {
        if (Number(cards[i].split('-')[1]) == Number(cards[i + 1].split('-')[1])) {
            same = true;
        }
    }
    if (!same) {
        return response;
    }
    return {
        flag: true,
        cards: cards,
        cardCount: this.countCards(cards),
        status: "Pair",
        index: 5
    }
}
