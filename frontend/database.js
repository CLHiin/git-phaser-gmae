var database = {
    1: {
      name: "落石",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "土",
      cardlevel: 1
    },
    2: {
      name: "土法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "土",
      cardlevel: 2
    },
    3: {
      name: "城牆",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２。",
      attributes: "土",
      cardlevel: 3
    },
    4: {
      name: "石巨人",
      content: "防禦時點數暫時上升５，攻擊時點數暫時下降１。",
      attributes: "土",
      cardlevel: 4
    },
    5: {
      name: "地震",
      content: "對敵全體造成攻擊。（一次性）",
      attributes: "土",
      cardlevel: 5
    },
    6: {
      name: "沙塵暴",
      content: "卡牌放置於場上時，我方的水屬性卡牌點數上升２點。",
      attributes: "土",
      cardlevel: 6
    },
    7: {
      name: "泥沼",
      content: "卡牌放置於場上時，對方攻擊狀態卡牌點數下降１點。",
      attributes: "土",
      cardlevel: 7
    },
    8: {
      name: "梅杜莎",
      content: "攻擊時點數可以暫時降低３點使用石化（無法行動一回合）",
      attributes: "土",
      cardlevel: 8
    },
    9: {
      name: "堡壘",
      content: "防禦時點數暫時上升５，攻擊時點數暫時下降２",
      attributes: "土",
      cardlevel: 9
    },
    10: {
      name: "天崩地裂",
      content: "對敵全體卡牌隨機造成五點傷害，並轉為防守狀態。（一次性）",
      attributes: "土",
      cardlevel: 10
    },
    11: {
      name: "騎士",
      content: "",
      attributes: "土",
      cardlevel: 11
    },
    12: {
      name: "皇后",
      content: "",
      attributes: "土",
      cardlevel: 12
    },
    13: {
      name: "國王",
      content: "",
      attributes: "土",
      cardlevel: 13
    },
    14: {
      name: "水彈",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "水",
      cardlevel: 1
    },
    15: {
      name: "冰法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "水",
      cardlevel: 2
    },
    16: {
      name: "冰牆",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２",
      attributes: "水",
      cardlevel: 3
    },
    17: {
      name: "水母",
      content: "被攻擊後，對方的卡牌點數永久下降２點",
      attributes: "水",
      cardlevel: 4
    },
    18: {
      name: "冰封",
      content: "敵方單體卡牌冰封狀態三回合。（一次性）",
      attributes: "水",
      cardlevel: 5
    },
    19: {
      name: "雪地",
      content: "卡牌放置於場上時，我方的水屬性卡牌點數上升２點。",
      attributes: "水",
      cardlevel: 6
    },
    20: {
      name: "暴雨",
      content: "卡牌放置於場上時，對方的火屬性卡牌點數下降２點。",
      attributes: "水",
      cardlevel: 7
    },
    21: {
      name: "冰龍",
      content: "攻擊時可以選擇範圍攻擊，點數暫時下降３，對敵全體卡牌造成攻擊。",
      attributes: "水",
      cardlevel: 8
    },
    22: {
      name: "暴風雪",
      content: "對敵全體卡牌隨機造成五～十點傷害。（一次性）",
      attributes: "水",
      cardlevel: 9
    },
    23: {
      name: "絕對零度",
      content: "將對方場上的一張卡牌永久冰封（無法行動、攻擊）。（一次性）",
      attributes: "水",
      cardlevel: 10
    },
    24: {
      name: "騎士",
      content: "",
      attributes: "水",
      cardlevel: 11
    },
    25: {
      name: "皇后",
      content: "",
      attributes: "水",
      cardlevel: 12
    },
    26: {
      name: "國王",
      content: "",
      attributes: "水",
      cardlevel: 13
    },
    27: {
      name: "火球",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "火",
      cardlevel: 1
    },
    28: {
      name: "火法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "火",
      cardlevel: 2
    },
    29: {
      name: "炎牆",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２",
      attributes: "火",
      cardlevel: 3
    },
    30: {
      name: "自爆兵",
      content: "攻擊時可以選擇自爆，點數暫時上升３",
      attributes: "火",
      cardlevel: 4
    },
    31: {
      name: "惡魔",
      content: "每次攻擊前必須捨棄一張手牌，同時點數永久上升３點。",
      attributes: "火",
      cardlevel: 5
    },
    32: {
      name: "煉獄",
      content: "卡牌放置於場上時，我方的火屬性卡牌點數上升２點。",
      attributes: "火",
      cardlevel: 6
    },
    33: {
      name: "陽光",
      content: "卡牌放置於場上時，對方的水屬性卡牌點數下降２點。",
      attributes: "火",
      cardlevel: 7
    },
    34: {
      name: "火龍",
      content: "攻擊時可以選擇範圍攻擊，點數暫時下降３，對敵全體卡牌造成攻擊。",
      attributes: "火",
      cardlevel: 8
    },
    35: {
      name: "流星雨",
      content: "對敵全體卡牌隨機造成五～十點傷害。（一次性）",
      attributes: "火",
      cardlevel: 9
    },
    36: {
      name: "核彈",
      content: "不分敵我，所有卡牌受到點數＋５的傷害。（一次性）",
      attributes: "火",
      cardlevel: 10
    },
    37: {
      name: "騎士",
      content: "",
      attributes: "火",
      cardlevel: 11
    },
    38: {
      name: "皇后",
      content: "",
      attributes: "火",
      cardlevel: 12
    },
    39: {
      name: "國王",
      content: "",
      attributes: "火",
      cardlevel: 13
    },
    40: {
      name: "風刃",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "風",
      cardlevel: 1
    },
    41: {
      name: "風法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "風",
      cardlevel: 2
    },
    42: {
      name: "風障",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２。",
      attributes: "風",
      cardlevel: 3
    },
    43: {
      name: "旋風",
      content: "對敵全體卡牌造成攻擊。（一次性）",
      attributes: "風",
      cardlevel: 4
    },
    44: {
      name: "風狼",
      content: "攻擊時點數暫時上升４，被攻擊時點數下降４",
      attributes: "風",
      cardlevel: 5
    },
    45: {
      name: "勇氣之風",
      content: "選擇場上一張卡，卡片變為攻擊狀態。（一次性）",
      attributes: "風",
      cardlevel: 6
    },
    46: {
      name: "神速",
      content: "選擇我方場上的一張卡，本回合可以行動兩次。（一次性）",
      attributes: "風",
      cardlevel: 7
    },
    47: {
      name: "精靈",
      content: "攻擊時，轉化為能克制該卡的屬性。",
      attributes: "風",
      cardlevel: 8
    },
    48: {
      name: "颱風",
      content: "對敵全體卡牌隨機造成五～十點傷害。（一次性）",
      attributes: "風",
      cardlevel: 9
    },
    49: {
      name: "風神之舞",
      content: "所有風屬性卡牌點數暫時上升五點。（一次性）",
      attributes: "風",
      cardlevel: 10
    },
    50: {
      name: "騎士",
      content: "",
      attributes: "風",
      cardlevel: 11
    },
    51: {
      name: "皇后",
      content: "",
      attributes: "風",
      cardlevel: 12
    },
    52: {
      name: "國王",
      content: "",
      attributes: "風",
      cardlevel: 13
    }
  };
  