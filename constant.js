const CONST = {
  // card deck array for distribute
  // prettier-ignore
  deckOne: [
    'H-1-0', 'H-2-0', 'H-3-0', 'H-4-0', 'H-5-0', 'H-6-0', 'H-7-0', 'H-8-0', 'H-9-0', 'H-10-0', 'H-11-0', 'H-12-0', 'H-13-0',
    'S-1-0', 'S-2-0', 'S-3-0', 'S-4-0', 'S-5-0', 'S-6-0', 'S-7-0', 'S-8-0', 'S-9-0', 'S-10-0', 'S-11-0', 'S-12-0', 'S-13-0',
    'D-1-0', 'D-2-0', 'D-3-0', 'D-4-0', 'D-5-0', 'D-6-0', 'D-7-0', 'D-8-0', 'D-9-0', 'D-10-0', 'D-11-0', 'D-12-0', 'D-13-0',
    'C-1-0', 'C-2-0', 'C-3-0', 'C-4-0', 'C-5-0', 'C-6-0', 'C-7-0', 'C-8-0', 'C-9-0', 'C-10-0', 'C-11-0', 'C-12-0', 'C-13-0',
  ],

  // table status
  PLAYING: 'PLAYING',
  LOCKED: 'LOCKED',
  RESTART: 'RESTART',
  // GAME_START_TIMER: "GAME_START_TIMER",
  LOCK_IN_PERIOD: 'LOCK_IN_PERIOD',
  WAITING: 'WAITING',
  BOT_WAITING: 'BOT_WAITING',
  ROUND_STARTED: 'RoundStated',
  ROUND_START_TIMER: 'GameStartTimer',
  ROUND_COLLECT_BOOT: 'CollectBoot',
  ROUND_END: 'RoundEndState',
  ROUND_LOCK: 'RoundLock',
  GAMEPLAY: 'GAMEPLAY',
  CARD_DEALING: 'CardDealing',

  // SPENN Paymnent Key
  API_KEY: 'Owiv+7//L9E3TsxkJuBHAInUSPHYfVJIw2KKcPjpyrZA4bBxxnDFHbL7c0yAyRADbO/REty9bwU=',

  // Entry Fee
  CHAT_MESSAGES: ['Hi All', 'Welcome', 'Please Play Fast', 'Well done!', 'Good turn', 'Bye', 'Try next time', 'Where are you from? I am from ', 'Finally I won'],

  POOL_DETAIL_OF_101: '101POOL',
  POOL_DETAIL_OF_201: '201POOL',
  //--------------------------------------------------------------------------------------------
  //Login && Signup
  //--------------------------------------------------------------------------------------------
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  VERIFY_OTP: 'VOTP',
  RESEND_OTP: 'ROTP',
  CHECK_REFERAL_CODE: 'CRC',
  CHECK_MOBILE_NUMBER: 'CMN',
  OLD_SESSION_RELEASE: 'OSR',
  DASHBOARD: 'DASHBOARD',
  WALLET_UPDATE: 'WU',
  BANNER: 'BANNER',

  // Socket events names

  // SORAT ============================================
  SORAT_PLAYGAME: 'SPG',
  SORAT_JOIN_TABLE: "SJT",
  SORAT_ROUND_START_TIMER: 'SoratGameStartTimer',
  SORAT_GAME_TABLE_INFO: 'SGTI',
  STARTSORAT: "STARTSORAT",
  SORATLOGIC: "Client",
  ACTIONSORAT: "ACTIONSORAT",
  GAME_START_TIMER: 'GST',
  SORATWINNER: "SORATWINNER",
  //===================================================


  // SPINNER GAME============================================
  SPINNER_GAME_PLAYGAME: 'SGPG',
  SPINNER_GAME_JOIN_TABLE: "SGJT",
  SPINNER_GAME_ROUND_START_TIMER: 'SpinnerGameStartTimer',
  SPINNER_GAME_TABLE_INFO: 'SPGTI',
  STARTSPINNER: "STARTSPINNER",
  SPINNERLOGIC: "Client",
  ACTIONSPINNNER: "ACTIONSPINNER",
  GAME_START_TIMER: 'GST',
  SPINNERWINNER: "SPINNERWINNER",
  RECONNECTSPINNER: "RECONNECTSPINNER",
  LEAVETABLESPINNER: "LEAVETABLESPINNER",
  //===================================================



  USER_JOIN_IN_TABLE: "UJIT",
  COLLECT_BOOT: "CB",
  USER_CARD: "UC",
  TABLE_CARD_DEAL: "TCD",
  PACK: "PACK",

  SEE_CARD_INFO: "SCI",
  SEE_CARD: "SC",
  CHAL: "CHAL",
  SHOW: "SHOW",
  TABLE_USER_WALLET_UPDATE: "TUWU",
  JOIN: 'JOIN',
  JOIN_SIGN_UP: 'SP',

  PING: 'PING',
  PICK_CARD: 'PIC',
  DISCARD: 'DIC',
  CARD_GROUP: 'CG',
  DECLARE: 'DEC',
  FINISH: 'FNS',
  FINISH_TIMER_SET: 'FTS',
  INVALID_DECLARE: 'IND',
  PLAYER_CARD_ACTION: 'PCA',
  INVALID_PLAYER_CARD_ACTION: 'IPCA',
  GAME_CARD_DISTRIBUTION: 'GCD',
  DONE: 'DONE',
  ERROR: 'ERROR',
  PONG: 'PONG',
  USER_TURN_START: 'UTS',
  GAME_TIME_START: 'GTS',
  INSUFFICIENT_CHIPS: 'IC',
  WIN: 'WIN',
  GAME_SCORE_BOARD: 'GSB',
  USER_TIME_OUT: 'UTO',
  USER_FINAL_TIMEOUT: 'UFTO',
  SEND_MESSAGE_TO_TABLE: 'MSGTT',
  LEAVE: 'LEAVE',
  SWITCH_TABLE: 'SWITCH',
  GAME_REPORT_PROBLEM: 'GRP',
  STAND_UP: 'STANDUP',
  LAST_GAME_SCORE_BOARD: 'LGSB',
  PLAYER_INFORMATION: 'PI',
  UPDATE_GAME_COIN: 'UGC',
  REGISTER_USER: 'RU',
  SIGN_IN: 'SI',
  OPEN_CHAT_PANEL: 'OCP',
  SEND_MESSAGE: 'SM',
  AUTO_LOGIN: 'AL',
  MANUAL_LOGIN: 'ML',
  PRIVATE_TABLE: 'PT',
  CREATE_PRIVATE_TABLE_ID: 'CPTI',
  JOIN_PRIVATE_TABLE: 'JPT',
  PRIVATE_TABLE_NOT_FOUND: 'PTNF',
  TOURNAMENT_LIST: 'TL',
  TOURNAMENT_INFORMATION: 'TI',
  TOURNAMENT_END: 'TE',
  REGISTRATION_TOURNAMENT: 'RT',
  FRIEND_REQUEST_RESULT: 'FRR',
  RECEIVE_FRIEND_REQUEST: 'RFR',
  UNFRIEND_REQUEST: 'UFR',
  LOCAL_FRIEND_LIST: 'LFL',
  FRIEND_LEADERBOARD: 'FLB',
  SEND_OTP: 'SOTP',
  PRIVATE_TABLE_START: 'PTS',
  INAPP_PURCHASE_DONE: 'IAPD',
  USER_UPDATE_PROFILE: 'UUP',
  LOGOUT: 'LOGOUT',
  EXIT: 'EXIT',
  VALIDATE_CARD: 'VC',
  GET_BET_LIST: 'GBL',
  POOL_GET_BET_LIST: 'PGBL',
  RECONNECT: 'RE',
  PLAYER_BALANCE: 'PB',
  DEPOSITE_AMOUNT: 'DA',
  INVALID_EVENT: 'IE',
  COUNTER: 'COUNTER',
  FLUTTERWAVE_WITHDRAW: 'FW',
  UPDATE_WALLET: 'UW',
  SPENN_DEPOSIT: 'SD',
  SPENN_RECEIVE: 'SR',
  PLAYER_PAYMENT_HISTORY: 'PH',
  SPENN_NOTIFICATION: 'SN',
  BORROW_USER_CHIPS: 'BUC',
  DECLARE_TIMER_SET: 'DTS',
  RESTART_GAME_TABLE: 'RT',
  PLAYER_FINISH_DECLARE_TIMER: 'PFDT',
  // new
  GET_TEEN_PATTI_ROOM_LIST: 'GTPRL',
  USER_JOIN_IN_TABLE: 'UJIT',
  TABLE_FULL_DATA: 'TFD',

  COLLECT_BOOT: 'CB',
  LEAVE_TABLE: 'LT',
  TABLE_CARD_DEAL: 'TCD',
  TURN_START: 'TS',
  PACK: 'PACK',
  WINNER: 'WINNER',
  TABLE_USER_WALLET_UPDATE: 'TUWU',
  KILL: 'KILL',
  FLUTTERWAVE_MOBILE_MONEY_DEPOSIT: 'FMMD',
  WEB_VIEW_CLOSE: 'WVC',
  LAST_POOL_POINT: 'LPP',
  DEMO_LAST_POOL_POINT: 'DEMOLPP',
  RE_JOIN: 'RE_JOIN',
  DISCONNECT: 'DISCONNECT',
  GET_MY_TOURNAMENT: 'MT',

  //ONE TO TWELVE
  ONE_GAME_JOIN_TABLE: 'OJT',
  ONE_ROUND_START_TIMER: 'ORST',
  ONE_GAME_TABLE_INFO: 'OJTI',
  ONE_GAME_START_TIMER: 'OGST',
  ONE_START_BATTING_TIMER: 'OSBT',
  ONE_START_BATTING_TIMER_DELAY: 'OSBTD',
  ONE_START_BATTING: 'OSB',
  ONE_WINNER: 'OWIN',


  // Player Status
  WATCHING: 'WATCHING',
  DECLARED: 'DECLARED',
  LEFT: 'LEFT',
  INVALID_DECLARED: 'INVALID_DECLARED',
  VALID_DECLARED: 'VALID_DECLARED',
  DROPPED: 'DROP',
  LOST: 'LOST',
  WON: 'WON',
  FINISHED: 'FINISHED',
  EXPELED: 'EXPELED',
  LEADER_BOARD: 'LB',
  ADD_FRIEND: 'AF',
  CHANGE_PASWORD: 'CP',
  FORGOT_PASWORD: 'FP',
  USER_PROFILE_DETAILS: 'UPD',
  USER_PROFILE_UPDATE: 'UUP',
  STOP_GAME_TIMER: 'SGT',
  UPDATE_CARD_STATUS: 'UCS',
  NOTIFICATION: 'NOTIFICATION',
  FLUTTERWAVE_BENEFICIARY: 'FB',
  PAYMENT_NOTIFICATION: 'PN',
  FLUTTERWAVE_KYC: 'FK',
  FLUTERWAVE_SAVE_DATA: 'FSD',
  INSUFFICIENT_MONEY: 'IM',
  FLUTTERWAVE_MOBILE_ADD_MONEY: 'FMAM',
  RE_JOIN_UPDATE_SCORE: 'RJUS',
  REMOVE_USERSOCKET_FROM_TABLE: 'RUFT',
  REGISTER_TOURNAMENT: 'TR',
  JOIN_TOURNAMENT: 'JTR',
  WITHDRAW_TOURNAMENT: 'WTR',

  //1 to 12 Game
  ONE_JOIN_TABLE: 'OJT',

  // Timer
  userTurnTimer: 30,
  gameStartTime: 10,
  gameCardDistributeDelayTime: 1,
  finishTimer: 20,
  rsbTimer: 4,
  restartTimer: 5,

  // commission
  commission: 10,
  POOL_COMMISSION: 15,

  // TOURNAMENT COIN
  TOURNAMENT_COIN: 500,

  // player score
  PLAYER_SCORE: 80,
  GAME_PLAY_COST: 3,
  PLAYER_LEAVE_SCORE: 20,
  FIRST_DROP: 16,
  SECOND_DROP: 30,
  TIME_TURN_OUT_COUNTER: 3,
  COMPUTER_TIME_TURN_OUT_COUNTER: 3,

  // Player
  TOTAL_PLAYER: 5,
  COMPUTER_TOTAL_PLAYER: 2,
  TOTAL_PLAYER_FOR_COMPUTER: 2,
  SIGN_UP_PLAYER_COIN: 500,
  // AVAILABLE_SEAT_POSITION: [5, 4, 3, 2, 1, 0],

  // Variable Name
  TOTAL_PLYING_POINT: 'TPP',
  TOTAL_WINNING_POINT: 'TWP',

  TOTAL_PLYING_POOL: 'TPPO',
  TOTAL_WINNING_POOL: 'TWPP',

  TOTAL_PLYING_DEAL: 'TPD',
  TOTAL_WINNING_DEAL: 'TWD',

  COIN_TRANSACTION: {
    MATCH_WON: 'Match Won',
    AD_VIEWED: 'Ad Viewed',
    DEFAULT: 'Registration',

    MATCH_LOST: 'Match Lost',
    DECLARED: 'Invalid Declared',
    DECLARED_WON: 'Declared Won',
    GAME_LEAVE: 'Leave Game',
  },

  // friendship status
  // 1 for pending 2 for approved,3 for decline

  FRIENDSHIP: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECT: 'decline',
  },

  LOGIN_TYPE: {
    LOGIN: 'login',
    SIGNUP: 'signup',
  },

  COUNTRY_CODE: process.env.COUNTRY_CODE || '+91',

  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

module.exports = CONST;
