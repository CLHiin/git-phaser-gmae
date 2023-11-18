var once_true = [1,5,10,14,18,22];
var database = {
    1: {
      name: "落石",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "dust",
      cardlevel: 1,
      once: true,
      handfunction(scene,container){
        
      },
    },
    2: {
      name: "土法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "dust",
      cardlevel: 2,
      once: false,
    },
    3: {
      name: "城牆",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２。",
      attributes: "dust",
      cardlevel: 3,
      once: false,
    },
    4: {
      name: "石巨人",
      content: "防禦時點數暫時上升５，攻擊時點數暫時下降１。",
      attributes: "dust",
      cardlevel: 4,
      once: false,
    },
    5: {
      name: "地震",
      content: "對敵全體造成攻擊。（一次性）",
      attributes: "dust",
      cardlevel: 5,
      once: true,
    },
    6: {
      name: "沙塵暴",
      content: "卡牌放置於場上時，我方的水屬性卡牌點數上升２點。",
      attributes: "dust",
      cardlevel: 6,
      once: false,
    },
    7: {
      name: "泥沼",
      content: "卡牌放置於場上時，對方攻擊狀態卡牌點數下降１點。",
      attributes: "dust",
      cardlevel: 7,
      once: false,
    },
    8: {
      name: "梅杜莎",
      content: "攻擊時點數可以暫時降低３點使用石化（無法行動一回合）",
      attributes: "dust",
      cardlevel: 8,
      once: false,
    },
    9: {
      name: "堡壘",
      content: "防禦時點數暫時上升５，攻擊時點數暫時下降２",
      attributes: "dust",
      cardlevel: 9,
      once: false,
    },
    10: {
      name: "天崩地裂",
      content: "對敵全體卡牌隨機造成五點傷害，並轉為防守狀態。（一次性）",
      attributes: "dust",
      cardlevel: 10,
      once: true,
    },
    11: {
      name: "騎士",
      content: "",
      attributes: "dust",
      cardlevel: 11,
      once: false,
    },
    12: {
      name: "皇后",
      content: "",
      attributes: "dust",
      cardlevel: 12,
      once: false,
    },
    13: {
      name: "國王",
      content: "",
      attributes: "dust",
      cardlevel: 13,
      once: false,
    },
    14: {
      name: "水彈",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "water",
      cardlevel: 1,
      once: true
    },
    15: {
      name: "冰法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "water",
      cardlevel: 2,
      once: false
    },
    16: {
      name: "冰牆",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２",
      attributes: "water",
      cardlevel: 3,
      once: false
    },
    17: {
      name: "水母",
      content: "被攻擊後，對方的卡牌點數永久下降２點",
      attributes: "water",
      cardlevel: 4,
      once: false
    },
    18: {
      name: "冰封",
      content: "敵方單體卡牌冰封狀態三回合。（一次性）",
      attributes: "water",
      cardlevel: 5,
      once: true
    },
    19: {
      name: "雪地",
      content: "卡牌放置於場上時，我方的水屬性卡牌點數上升２點。",
      attributes: "water",
      cardlevel: 6,
      once: false
    },
    20: {
      name: "暴雨",
      content: "卡牌放置於場上時，對方的火屬性卡牌點數下降２點。",
      attributes: "water",
      cardlevel: 7,
      once: false
    },
    21: {
      name: "冰龍",
      content: "攻擊時可以選擇範圍攻擊，點數暫時下降３，對敵全體卡牌造成攻擊。",
      attributes: "water",
      cardlevel: 8,
      once: false
    },
    22: {
      name: "暴風雪",
      content: "對敵全體卡牌隨機造成五～十點傷害。（一次性）",
      attributes: "water",
      cardlevel: 9,
      once: true
    },
    23: {
      name: "絕對零度",
      content: "將對方場上的一張卡牌永久冰封（無法行動、攻擊）。（一次性）",
      attributes: "water",
      cardlevel: 10,
      once: true
    },
    24: {
      name: "騎士",
      attributes: "water",
      cardlevel: 11,
      once: false
    },
    25: {
      name: "皇后",
      attributes: "water",
      cardlevel: 12,
      once: false
    },
    26: {
      name: "國王",
      attributes: "water",
      cardlevel: 13,
      once: false
    },
    27: {
      name: "火球",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "fire",
      cardlevel: 1,
      once: true
    },
    28: {
      name: "火法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "fire",
      cardlevel: 2,
      once: false
    },
    29: {
      name: "炎牆",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２",
      attributes: "fire",
      cardlevel: 3,
      once: false
    },
    30: {
      name: "自爆兵",
      content: "攻擊時可以選擇自爆，點數暫時上升３",
      attributes: "fire",
      cardlevel: 4,
      once: false
    },
    31: {
      name: "惡魔",
      content: "每次攻擊前必須捨棄一張手牌，同時點數永久上升３點。",
      attributes: "fire",
      cardlevel: 5,
      once: false
    },
    32: {
      name: "煉獄",
      content: "卡牌放置於場上時，我方的火屬性卡牌點數上升２點。",
      attributes: "fire",
      cardlevel: 6,
      once: false
    },
    33: {
      name: "陽光",
      content: "卡牌放置於場上時，對方的水屬性卡牌點數下降２點。",
      attributes: "fire",
      cardlevel: 7,
      once: false
    },
    34: {
      name: "火龍",
      content: "攻擊時可以選擇範圍攻擊，點數暫時下降３",
      attributes: "fire",
      cardlevel: 8,
      once: false
    },
    35: {
      name: "流星雨",
      content: "對敵全體卡牌隨機造成五～十點傷害。（一次性）",
      attributes: "fire",
      cardlevel: 9,
      once: true
    },
    36: {
      name: "核彈",
      content: "不分敵我，所有卡牌受到點數＋５的傷害。（一次性）",
      attributes: "fire",
      cardlevel: 10,
      once: true
    },
    37: {
      name: "騎士",
      attributes: "fire",
      cardlevel: 11,
      once: false
    },
    38: {
      name: "皇后",
      attributes: "fire",
      cardlevel: 12,
      once: false
    },
    39: {
      name: "國王",
      attributes: "fire",
      cardlevel: 13,
      once: false
    },
    40: {
      name: "風刃",
      content: "到自己的反擊階段時，點數暫時上升２點。（一次性）",
      attributes: "wind",
      cardlevel: 1,
      once: true
    },
    41: {
      name: "風法師",
      content: "攻擊時點數暫時上升３，防禦時點數暫時下降１。",
      attributes: "wind",
      cardlevel: 2,
      once: false
    },
    42: {
      name: "風障",
      content: "防禦時點數暫時上升４，攻擊時點數暫時下降２。",
      attributes: "wind",
      cardlevel: 3,
      once: false
    },
    43: {
      name: "旋風",
      content: "對敵全體卡牌造成攻擊。（一次性）",
      attributes: "wind",
      cardlevel: 4,
      once: true
    },
    44: {
      name: "風狼",
      content: "攻擊時點數暫時上升４，被攻擊時點數下降４",
      attributes: "wind",
      cardlevel: 5,
      once: false
    },
    45: {
      name: "勇氣之風",
      content: "選擇場上一張卡，卡片變為攻擊狀態。（一次性）",
      attributes: "wind",
      cardlevel: 6,
      once: true
    },
    46: {
      name: "神速",
      content: "選擇我方場上的一張卡，本回合可以行動兩次。（一次性）",
      attributes: "wind",
      cardlevel: 7,
      once: true
    },
    47: {
      name: "精靈",
      content: "攻擊時，轉化為能克制該卡的屬性。",
      attributes: "wind",
      cardlevel: 8,
      once: false
    },
    48: {
      name: "颱風",
      content: "對敵全體卡牌隨機造成五～十點傷害。（一次性）",
      attributes: "wind",
      cardlevel: 9,
      once: true
    },
    49: {
      name: "風神之舞",
      content: "所有風屬性卡牌點數暫時上升五點。（一次性）",
      attributes: "wind",
      cardlevel: 10,
      once: true
    },
    50: {
      name: "騎士",
      attributes: "wind",
      cardlevel: 11,
      once: false
    },
    51: {
      name: "皇后",
      attributes: "wind",
      cardlevel: 12,
      once: false
    },
    52: {
      name: "國王",
      attributes: "wind",
      cardlevel: 13,
      once: false
    }
};
  