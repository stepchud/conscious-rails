import { map, filter, some, isEmpty } from 'lodash'
import {
  shuffle,
  selectedCards,
  makeFaceCard,
  sameSuit,
} from 'reducers/cards'

const LAW_CARDS = [
  {
    "card": "2D",
    "text": "YOU GET THE HICCUPS:\nCREATE MI-192.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['MI-192']}
    ]
  },
  {
    "card": "2D",
    "text": "CATCHING YOUR THING\nIN YOUR ZIPPER RESULTS\nIN NO SEX FOR TWO WEEKS:\nCREATE ALL NOTES OF FOOD.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-768','RE-384','MI-192','FA-96','SO-48','LA-23','TI-12','DO-6']}
    ]
  },
  {
    "card": "3D",
    "text": "MASTURBATE...\nLOSE TI-12.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['TI-12']}
    ]
  },
  {
    "card": "3D",
    "text": "A GOOD MEAL CREATES THE\nFIRST THREE NOTES IN THE\nFOOD OCTAVE...\nCREATE\n DO-768 RE-384 MI-192.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-768','RE-384','MI-192']}
    ]
  },
  {
    "card": "4D",
    "text": "FORGET YOUR AIM...\nLOSE RE-24.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['RE-24']}
    ]
  },
  {
    "card": "4D",
    "text": "EAT A REALLY HOT PEPPER,\nCREATE ALL HYDROGEN-96.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['FA-96','RE-96']}
    ]
  },
  {
    "card": "5D",
    "text": "A BEE STINGS YOU...\nTHE PILLS YOU TAKE\nCREATE FA-96 SO-48.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['FA-96','SO-48']}
    ]
  },
  {
    "card": "5D",
    "text": "SKIP A MEAL...\nLOSE DO-768.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-768']}
    ]
  },
  {
    "card": "6D",
    "text": "YOU GET THE FLU...\nLOSE FA-96 AND SO-48.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['FA-96','SO-48']}
    ]
  },
  {
    "card": "6D",
    "text": "DO THE SLOW EATING\nEXERCISE: CREATE DO-768.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-768']}
    ]
  },
  {
    "card": "7D",
    "text": "FORGET TO BREATHE\nWHEN YOU EAT...\nLOSE ALL HYDROGEN-192.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['MI-192','DO-192']}
    ]
  },
  {
    "card": "7D",
    "text": "PROPER DIET...\nCREATE T1-12 LA-24.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['LA-24','TI-12']}
    ]
  },
  {
    "card": "8D",
    "text": "WATCH AN EMOTIONAL MOVIE:\nCREATE LA-6.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['LA-6']}
    ]
  },
  {
    "card": "8D",
    "text": "INTENTIONALLY LIE\nTO THE TEACHER...\nLOSE FA-6 AND THE\nNEXT HIGHEST NOTE FILLED.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['FA-6', 'HIGHEST-IMPRESSION']}
    ]
  },
  {
    "card": "9D",
    "text": "A LITTLE ALCOHOL\nCREATE DO-6.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-6']}
    ]
  },
  {
    "card": "9D",
    "text": "FAINT FROM THE SIGHT\nOF BLOOD:\nLOSE ALL HYDROGEN-96.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['FA-96','RE-96']}
    ]
  },
  {
    "card": "10D",
    "text": "WORKING IN THE MINES\nPOISONS YOUR LUNGS...\nLOSE YOUR AIR OCTAVE.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-192','RE-96','MI-48','FA-24','SO-12','LA-6']}
    ]
  },
  {
    "card": "10D",
    "text": "PRACTICE OPPOSITE\nPOSTURES:\nCREATE ALL HYDROGEN-24.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['LA-24','FA-24','RE-24']}
    ]
  },
  {
    "card": "JD",
    "text": "MECHANICAL LIFE:\nSTAY ASLEEP FOR\n21 SPACES.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'JD'},
      {type: 'SLEEP', for: 21},
    ]
  },
  {
    "card": "QD",
    "text": "PUT OTHERS FIRST...\nTRANSFORM EMOTIONS",
    "actions": [
      {type: 'TRANSFORM_EMOTIONS'}
    ]
  },
  {
    "card": "KD",
    "text": "CREATE MOON IN YOURSELF:\nKEEP THIS CARD, WHICH\nFREES YOU FROM ALL\nLAWS OF ACCIDENT.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'KD'},
    ]
  },
  {
    "card": "AD",
    "text": "WALKING TO YOUR CAR DURING\nA THUNDERSTORM AND ZAP,\nYOU ARE HIT BY LIGHTNING:\nINSTANT DEATH!",
    "actions": [
      {type: 'INSTANT_DEATH'}
    ]
  },
  {
    "card": "2C",
    "text": "TAKE THE LAW CARD FROM THE\nTOP THAT EQUALS YOUR TYPE\nAND OBEY IT WITHOUT ESCAPE\n(DISCARD LAWS IN BETWEEN).",
    "actions": [
      {type: 'ACTIVE_LAW', card: '2C'},
      {type: 'OBEY_WITHOUT_ESCAPE', card: '2C'}
    ]
  },
  {
    "card": "2C",
    "text": "LIE STILL FOR ONE HOUR:\nCREATE ALL HYDROGEN-12.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['TI-12','SO-12','MI-12']}
    ]
  },
  {
    "card": "3C",
    "text": "MEMORIZE 1001 WORDS\nAND RECEIVE THE\nMASTER EXERCISES:\nCREATE ALL IMPRESSIONS.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-48','RE-24','MI-12','FA-6']}
    ]
  },
  {
    "card": "3C",
    "text": "FAIL TO INSULATE YOURSELF:\nLOSE FA-6.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['FA-6']}
    ]
  },
  {
    "card": "4C",
    "text": "REMEMBERING YOUR OBJECTIVE\nPRAYER: CREATE A MAGNETIC\nCENTER MOMENT.",
    "actions": [
      {type: 'MAGNETIC_CENTER_MOMENT'},
    ]
  },
  {
    "card": "4C",
    "text": "CIGARETTE SMOKING WIPES\nOUT THE FIRST THREE NOTES\nIN THE AIR OCTAVE...\nLOSE DO-192 RE-96 MI-48",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-192','RE-96','MI-48']}
    ]
  },
  {
    "card": "5C",
    "text": "HAVE A LAPSE IN\nCONCENTRATION: LOSE DO-48.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-48']}
    ]
  },
  {
    "card": "5C",
    "text": "OBEY THE MASTER:\nTRANSFORM ALL MI-12 TO\nFA-6 AND ALL TI-12\n(OR HIGHEST FOOD) TO DO-6.",
    "actions": [
      {type: 'TRANSFORM_MI_TI_12'},
    ]
  },
  {
    "card": "6C",
    "text": "SOMEONE STARTLES YOU:\nCREATE DO-192.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-192']}
    ]
  },
  {
    "card": "6C",
    "text": "INTERNAL CONSIDER:\nLOSE THE FIRST 3 NOTES OF\nFOOD AND AIR AND THE\nFIRST IMPRESSION (3-3-1).",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-768','RE-384','MI-192','DO-192','RE-96','MI-48','DO-48']}
    ]
  },
  {
    "card": "7C",
    "text": "SWALLOW WATER WHILE\nSWIMMING: LOSE MI-48.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['MI-48']}
    ]
  },
  {
    "card": "7C",
    "text": "YOUR UNCONSCIOUS MUSCLE\nMOVEMENT LETS EVERYONE\nKNOW THAT YOU ARE A BOOBY:\nLOSE TI-12 AND LA-24.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['TI-12','LA-24']}
    ]
  },
  {
    "card": "8C",
    "text": "PRACTICE THE CHI EXERCISE:\nCREATE ALL HYDROGEN-48.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-48','MI-48','SO-48']}
    ]
  },
  {
    "card": "8C",
    "text": "TOURING YOUR LAND YOU\nARE BIT BY A SNAKE...\nLOSE DO-6 AND THE NEXT\nHIGHEST NOTE FILLED.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-6','HIGHEST-FOOD']}
    ]
  },
  {
    "card": "9C",
    "text": "FORGET TO MAKE\nONE THING YOUR GOD:\nLOSE ALL HYDROGEN-48.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-48','MI-48','SO-48']}
    ]
  },
  {
    "card": "9C",
    "text": "RIGHT PRAYER:\nCREATE ALL HYDROGEN-6.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-6','LA-6','FA-6']}
    ]
  },
  {
    "card": "10C",
    "text": "STOP YOURSELF\nAND TAKE A DEEP BREATH:\nSHOCKS FOOD.",
    "actions": [
      {type: 'SHOCKS_FOOD'}
    ]
  },
  {
    "card": "10C",
    "text": "GO AGAINST THE WORK\nFOR SELFISH REASONS:\nLOSE ALL IMPRESSIONS.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-48','RE-24','MI-12','FA-6']}
    ]
  },
  {
    "card": "JC",
    "text": "MECHANICAL LIFE:\nLOSE YOUR SKILLS\nFOR 37 SPACES.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'JC'},
      {type: 'LOSE_SKILLS', for: 37},
    ]
  },
  {
    "card": "QC",
    "text": "GOD SENDS A MESSAGE AND\nEVERY PERSON RECEIVES IT:\nALL SELF-REMEMBER.",
    "actions": [
      {type: 'SELF_REMEMBER'}
    ]
  },
  {
    "card": "KC",
    "text": "CREATE MOON IN YOURSELF:\nKEEP THIS CARD, WHICH\nFREES YOU FROM ALL LAWS\nOF CAUSE AND EFFECT.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'KC'},
    ]
  },
  {
    "card": "AC",
    "text": "BITING YOUR NAILS LEADS\nTO A FORM OF CANCER:\nDEATH COMES IN 41 SPACES!",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'AC'},
      {type: 'DEATH_SPACE', in: 41},
    ]
  },
  {
    "card": "2H",
    "text": "FORGET TO REMEMBER\nTHE COMPLETING PRINCIPLE:\nLOSE DO-6.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-6']}
    ]
  },
  {
    "card": "3H",
    "text": "STAND UP TOO FAST:\nLOSE DO-192.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-192']}
    ]
  },
  {
    "card": "4H",
    "text": "PICK A CENTER:\nDRAW ONE CARD.",
    "actions": [
      {type: 'DRAW_CARD'}
    ]
  },
  {
    "card": "5H",
    "text": "MANIFEST UNCONTROLLED\nIMAGINATION: LOSE LA-6.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['LA-6']}
    ]
  },
  {
    "card": "6H",
    "text": "SPEND YOUR DAY IN VANITY\nAND SELF LOVE:\nLOSE MI-12 AND RE-24.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['RE-24','MI-12']}
    ]
  },
  {
    "card": "6H",
    "text": "MAKE ONE THING YOUR GOD:\nPLAY ADDITIONAL LAW\nBY CHOICE.",
    "actions": [
      {type: 'LAW_BY_CHOICE'}
    ]
  },
  {
    "card": "7H",
    "text": "SMOKING POT CREATES\nFA-24 AND SO-12.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['FA-24','SO-12']}
    ]
  },
  {
    "card": "7H",
    "text": "EAT AT A DIRTY\nRESTAURANT: LOSE MI-192.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['MI-192']}
    ]
  },
  {
    "card": "8H",
    "text": "PRACTICE THREEFOLD\nATTENTION: ADD THREE\nLAWS TO YOUR LAW PILE.",
    "actions": [
      {type: 'DRAW_LAW_CARD'},
      {type: 'DRAW_LAW_CARD'},
      {type: 'DRAW_LAW_CARD'},
    ]
  },
  {
    "card": "8H",
    "text": "LEARN THIRD RESPONSE:\nDRAW FIVE CARDS.",
    "actions": [
      {type: 'DRAW_CARD'},
      {type: 'DRAW_CARD'},
      {type: 'DRAW_CARD'},
      {type: 'DRAW_CARD'},
      {type: 'DRAW_CARD'},
    ]
  },
  {
    "card": "9H",
    "text": "BREATHE NEGATIVE IONS:\nSHOCK ALL MI-48 TO LA-6,\nOR ENTER MI-48 IF NONE\nEXISTS.",
    "actions": [
      {type: 'SHOCK_MI48_LA6'}
    ]
  },
  {
    "card": "9H",
    "text": "HOLDING ACCOUNTS COSTS\nYOU ALL HYDROGEN-12:\nLOSE TI-12 MI-12 SO-12",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['TI-12','SO-12','MI-12']}
    ]
  },
  {
    "card": "10H",
    "text": "HAVE YOUR COFFEE WHILE\nYOU WATCH THE SUN RISE:\nCREATE ALL HYDROGEN-192.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['MI-192','DO-192']}
    ]
  },
  {
    "card": "10H",
    "text": "A CAR CROSSES MEDIAN,\nHITTING YOU AT 60 MPH:\nLOSE ALL YOUR FOOD.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-768','RE-384','MI-192','FA-96','SO-48','LA-24','TI-12','DO-6']}
    ]
  },
  {
    "card": "JH",
    "text": "MECHANICAL LIFE:\nLOSE YOUR POWERS\nFOR 33 SPACES.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'JH'},
      {type: 'LOSE_POWERS', for: 33},
    ]
  },
  {
    "card": "QH",
    "text": "PLAY THIS CARD AFTER\nANY ROLL AND TAKE\nTHE OPPOSITE SIDE\nOF THE DIE.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'QH'},
    ]
  },
  {
    "card": "KH",
    "text": "CREATE MOON IN YOURSELF:\nKEEP THIS CARD, WHICH\nFREES YOU FROM ALL\nLAWS OF FATE.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'KH'},
    ]
  },
  {
    "card": "AH",
    "text": "AN OLD FAMILY DISEASE\nMANIFESTS IN YOUR BEING:\nDEATH COMES IN 27 SPACES!",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'AH'},
      {type: 'DEATH_SPACE', in: 27},
    ]
  },
  {
    "card": "2S",
    "text": "TAKE ONE LAW CARD FROM\nTHE TOP, WHICH EVERYONE\nMUST OBEY WITHOUT ESCAPE.",
    "actions": [
      {type: 'ACTIVE_LAW', card: '2S'},
      {type: 'OBEY_WITHOUT_ESCAPE', card: '2S'}
    ]
  },
  {
    "card": "3S",
    "text": "PRACTICE THE TWO ENDS\nOF THE STICK EXERCISE:\nCREATE DO-48.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['DO-48']}
    ]
  },
  {
    "card": "3S",
    "text": "LAZINESS OF MIND:\nLOSE THE FIRST\nFILLED IMPRESSION.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['LOWEST-IMPRESSION']}
    ]
  },
  {
    "card": "4S",
    "text": "BREATHE WHEN YOU EAT:\nSHOCK ALL MI-192\nTO TI-12, OR ENTER MI-192\nIF NONE EXISTS",
    "actions": [
      {type: 'SHOCK_MI_TI_12'}
    ]
  },
  {
    "card": "4S",
    "text": "YOU GET A POTATO CHIP\nCAUGHT IN YOUR THROAT:\nTHROW UP THE FIRST THREE\nNOTES OF FOOD.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-768','RE-384','MI-192']}
    ]
  },
  {
    "card": "5S",
    "text": "LAUGHTER!\nCREATES RE-24.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['RE-24']}
    ]
  },
  {
    "card": "5S",
    "text": "RAMBLE ON AND ON...\nLOSE ALL HYDROGEN-24.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['LA-24','FA-24','RE-24']}
    ]
  },
  {
    "card": "6S",
    "text": "ASTHMA ATTACK...\nLOSE FA-24 AND SO-12.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['FA-24','SO-12']}
    ]

  },
  {
    "card": "6S",
    "text": "REMEMBER TO PICK A CENTER:\nPLAY ONE ADDITIONAL LAW\nBY RANDOM DRAW.",
    "actions": [
      {type: 'LAW_BY_RANDOM'}
    ]
  },
  {
    "card": "7S",
    "text": "A WISE MAN TELLS YOU AN\nANCIENT TRUTH: MI-12 IS\nCREATED IN YOUR BEING.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['MI-12']}
    ]
  },
  {
    "card": "7S",
    "text": "LOSE YOUR TEMPER:\nLOSE MI-12.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['MI-12']}
    ]
  },
  {
    "card": "8S",
    "text": "FORGET TO PICK A CENTER:\nDISCARD ALL LAW CARDS\nNOT IN PLAY.",
    "actions": [
      {type: 'DISCARD_LAW_HAND'}
    ]
  },
  {
    "card": "8S",
    "text": "IMPROPER BREATHING\nEXERCISE DESTROYS LA-6\nAND THE NEXT HIGHEST\nNOTE FILLED.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['LA-6','HIGHEST-AIR']}
    ]
  },
  {
    "card": "9S",
    "text": "EXPERIENCE A DEEP CALMNESS\nAFTER LYING STILL FOR\nONE HOUR: CREATE FA-6.",
    "actions": [
      {type: 'ADD_NOTES', notes: ['FA-6']}
    ]
  },
  {
    "card": "9S",
    "text": "DAY DREAM:\nDISCARD ONE CARD\nBY RANDOM.",
    "actions": [
      {type: 'DISCARD_BY_RANDOM'},
    ]
  },
  {
    "card": "10S",
    "text": "MANIFEST FROM CONSCIENCE:\nUSE THIS CARD TO ROLL AGAIN\nAFTER ANY ROLL.",
    "actions": [
      {type: 'ACTIVE_LAW', card: '10S'},
    ]
  },
  {
    "card": "10S",
    "text": "DOUBLE CRYSTALLIZE:\nLOSE HALF YOUR CARDS.",
    "actions": [
      {type: 'LOSE_HALF_CARDS'}
    ]
  },
  {
    "card": "JS",
    "text": "FORMATORY:\nLOSE HYDROGEN-6.",
    "actions": [
      {type: 'TAKE_NOTES', notes: ['DO-6','LA-6','FA-6']}
    ]
  },
  {
    "card": "QS",
    "text": "CREATE RIGHT VALUE:\nALL SHOCKS ARE BROUGHT\nTO YOUR BEING.",
    "actions": [
      {type: 'ALL_SHOCKS'}
    ]
  },
  {
    "card": "KS",
    "text": "CREATE MOON IN YOURSELF:\nKEEP THIS CARD, WHICH FREES\nYOU FROM ALL LAWS OF WILL.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'KS'},
    ]
  },
  {
    "card": "AS",
    "text": "A CRAZED IDENTIFIED MAN\nCLIMBS A TOWER AND\nSHOOTS 17 PEOPLE TO DEATH;\nYOU ARE ONE OF THEM!",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'AS'},
      {type: 'INSTANT_DEATH'},
    ]
  },
  {
    "card": "XJ",
    "text": "ALL THREE-BRAINED BEINGS\nFEEL THE POWER OF ETERNAL\nFORGIVNESS, CANCELS ALL\nLAW CARDS IN PLAY.",
    "actions": [
      {type: "CANCEL_ALL_LAWS"}
    ]
  },
  {
    "card": "JO",
    "text": "HASNAMUSS:\nEXERCISE NO ROLL OPTIONS\nFOR THE DURATION OF YOUR EXISTENCE.",
    "actions": [
      {type: 'ACTIVE_LAW', card: 'JO'},
      {type: 'HASNAMUSS'},
    ]
  }
]

export const selectedLaws = (cards) => map(filter(cards, 'selected'), 'c.card')
const activeKings = (active) => filter(active, (c) => c.slice(0, 1) === 'K')
const activeTwo = (active) => filter(active, (c) => '2C' === c || '2S' === c).length

const generateLawDeck = () => {
  return shuffle(LAW_CARDS)
}

const laws = (
  state = {
    hand: [],
    active: [],
    deck: generateLawDeck(),
    discards: [],
    actions: [],
  },
  action
) => {
  const {
    hand,
    active,
    deck,
    discards,
  } = state
  switch(action.type) {
    case 'DRAW_LAW_CARD':
      let nextDeck, nextDiscards
      if (isEmpty(deck)) {
        nextDeck = shuffle(discards)
        nextDiscards = []
      } else {
        nextDeck = deck
        nextDiscards = discards
      }
      return {
        ...state,
        deck: nextDeck.slice(1),
        discards: nextDiscards,
        hand: hand.concat({ c: nextDeck[0], selected: false }),
      }
    case 'SELECT_LAW_CARD':
      const card = hand[action.card]
      return {
        ...state,
        hand: [
          ...hand.slice(0, action.card),
          { ...card, selected: !card.selected },
          ...hand.slice(action.card+1)
        ],
      }
    case 'PLAY_SELECTED':
      const cards = selectedCards(action.hand)
      const lawCards = selectedLaws(action.lawHand)
      if (!makeFaceCard(cards.concat(lawCards))) { return state }

      // mark laws as played, cards reducer handles piece creation
      return {
        ...state,
        hand: map(action.lawHand, (c) => {
          return c.selected ?
            {
              ...c,
              selected: false,
              played: true
            } : {
              ...c
            }
        }),
      }
    case 'OBEY_LAW':
      if (filter(hand, 'selected').length !== 1) {
        console.log("only 1 law play at a time")
        return state
      }
      const lc = filter(hand, 'selected')[0]
      if (lc.obeyed) {
        console.log("already obeyed ", lc)
        return state
      }

      let nextState = {
        ...state,
        hand: map(hand, (c) => {
          return c.selected ?
            {
              ...c,
              selected: false,
              obeyed: true
            } : {
              ...c
            }
        }),
      }

      if (activeTwo(active)) {
        console.log("no escape!")
      } else {
        if (some(activeKings(active), (k) => sameSuit(k, lc.c.card))) {
          console.log("Moon escapes! ", lc)
          return nextState
        }
      }

      return {
        ...nextState,
        actions: lc.c.actions,
      }
    case 'ACTIVE_LAW':
      return {
        ...state,
        active: active.concat(action.card),
      }
    case 'CLEAR_ACTIONS':
      return {
        ...state,
        actions: []
      }
    default:
      return state
  }
}

export default laws