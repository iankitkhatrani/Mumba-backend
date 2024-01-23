
const { getBetList } = require('./betList');
const { otJoinTable } = require("./joinTable");
const { leaveTable } = require("./leaveTable");
const { disconnectTableHandle, findDisconnectTable } = require("./disconnectHandle");
const { cardPack, seeCard, chal, show } = require("./gamePlay");

module.exports = {
  getBetList: getBetList,
  otJoinTable: otJoinTable,
  cardPack: cardPack,
  seeCard: seeCard,
  chal: chal,
  show: show,
  leaveTable: leaveTable,
  findDisconnectTable: findDisconnectTable,
  disconnectTableHandle: disconnectTableHandle,
};
