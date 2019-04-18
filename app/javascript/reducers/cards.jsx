import { times, shuffle, map, filter, isEmpty, every, some, sortBy } from 'lodash'
import { Dice } from 'reducers/board'

const generateDeck = () => {
  let deck = []
  for (let suit of ['D','C','H','S']) {
    for (let j=2; j<=4; j++) {
      times(4, ()=>{deck.push(j+suit)})
    }
    for (let j=5; j<=7; j++) {
      times(3, ()=>{deck.push(j+suit)})
    }
    for (let j=8; j<=10; j++) {
      times(2, ()=>{deck.push(j+suit)})
    }
  }
  times(4, deck.push('JS'))
  times(3, deck.push('JD'))
  times(2, deck.push('JC'))
  times(2, deck.push('QD'))
  deck.push('JH')
  deck.push('QC')
  return shuffle(deck)
}

const suit = card => card[card.length-1]
const suitInt = card => {
  switch(suit(card)) {
    case 'D': return 0
    case 'C': return 100
    case 'H': return 200
    case 'S': return 300
    default:  return 400
  }
}
const rank = card => (card=='XJ' || card=='JO') ? card : card.slice(0, -1)
const isFace = card => ['K','Q','J'].includes(rank(card))
const rankInt = card => {
  const r = rank(card)
  if ('JO' === r) {
    return 16
  } else if ('XJ' === r) {
    return 15
  } else if ('A' === r) {
    return 14
  } else if ('K' === r) {
    return 13
  } else if ('Q' === r) {
    return 12
  } else if ('J' === r) {
    return 11
  } else {
    return parseInt(r)
  }
}
export const sameSuit = (...cards) => {
  const firstSuit = suit(cards[0])
  return every(cards, c => suit(c) === firstSuit)
}
const sameRank = (...cards) => {
  const ranks = new Set(map(cards, rank))
  return ranks.size < cards.length
}
const grouped = (...cards) => {
  const ranks = cards.map(rank).map(c => Number(c))
  if (some(ranks, isNaN)) {
    return false
  }

  return every(ranks, c => c>=2 && c<=4) ||
         every(ranks, c => c>=5 && c<=7) ||
         every(ranks, c => c>=8 && c<=10)
}

export const selectedCards = (cards) => map(filter(cards, 'selected'), 'c')
const sortedHand = (cards) => sortBy(cards, c => suitInt(c.c) + rankInt(c.c))
// cards can be played together to make new parts
export const playable = (selected) => {
  if (selected.length == 0 || selected.length > 3) {
    return false
  }
  if (selected.length == 1) {
    return /^[XJQKA]/.test(selected[0])
  }
  if (selected.length == 2 || selected.length == 3) {
    return sameSuit(...selected) && !sameRank(...selected) && grouped(...selected)
  }
}
// board parts can be combined together to make new parts
// ASSUMES parts aren't the same rank/suit
export const combinable = (parts) => {
  if (parts.length != 2) { return false }
  if (parts.includes('JO')) { return false }
  if (parts.includes('XJ') && parts.includes('AS')) {
    return 'all_shocks'
  }
  if (rank(parts[0]) === 'A' && rank(parts[1]) === 'A' && suit(parts[0]) != 'S' && suit(parts[1]) != 'S') {
    return 'wild_shock'
  }
  if (sameSuit(...parts) && isFace(parts[0]) && isFace(parts[1])) {
    return 'transforms'
  }

  return false
}

export const makeFaceCard = (cards) => {
  if (!playable(cards)) { return false }

  const c = cards[0]
  if (cards.length == 1) {
    return [c, 1]
  } else {
    const firstRank = rank(c)
    const face = (firstRank <= 4) ? 'J' : (firstRank <= 7 ? 'Q' : 'K')
    return [
      `${face}${suit(c)}`,
      cards.length == 3 ? 2 : 1
    ]
  }
}
export const makeNewPart = (parts) => {
  switch(combinable(parts)) {
    case 'transforms':
      return 'A'+suit(parts[0])
    case 'wild_shock':
      return 'XJ'
    case 'all_shocks':
      return 'JO'
    default:
      return
  }
}

const cards = (
  state = {
    deck: generateDeck(),
    discards: [],
    hand: [],
    pieces: [],
  },
  action
) => {
  const {
    hand,
    deck,
    discards,
    pieces,
  } = state

  switch(action.type) {
    case 'DRAW_CARD':
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
        hand: sortedHand(hand.concat({ c: nextDeck[0], selected: false })),
      }
    case 'START_GAME':
      return {
        ...state,
        deck: deck.slice(7),
        hand: sortedHand(
          hand.concat([
            { c: deck[0], selected: false },
            { c: deck[1], selected: false },
            { c: deck[2], selected: false },
            { c: deck[3], selected: false },
            { c: deck[4], selected: false },
            { c: deck[5], selected: false },
            { c: deck[6], selected: false },
          ])
        )
      }
    case 'SELECT_CARD':
      const card = hand[action.card]
      const nextHand = [
        ...hand.slice(0, action.card),
        { c: card.c, selected: !card.selected },
        ...hand.slice(action.card+1)
      ]
      return {
        ...state,
        hand: nextHand,
      }
    case 'PLAY_SELECTED':
      if (!action.pieces) { return state }

      return {
        ...state,
        pieces: action.pieces,
        discards: [...discards, ...action.cards],
        hand: hand.filter(c => !c.selected),
      }
    case 'COMBINE_PARTS':
      const newPart = makeNewPart(action.selected)
      if (!newPart) { return state }

      return {
        ...state,
        pieces: [newPart, 1],
      }
    case 'DISCARD_BY_RANDOM':
      const rand = Dice(hand.length).roll()
      return {
        ...state,
        hand: [...hand.slice(0, rand), ...hand.slice(rand+1)],
        discards: discards.concat(hand[rand]),
      }
    case 'LOSE_HALF_CARDS':
      const shuffled = shuffle(hand)
      const half = Math.floor(hand.length/2)
      return {
        ...state,
        hand: hand.slice(half),
        discards: discards.concat(hand.slice(0, half)),
      }
    case 'CLEAR_PIECES':
      return {
        ...state,
        pieces: []
      }
    default:
      return state
  }
}

export default cards
