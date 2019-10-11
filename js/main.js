// Utilities
$ = (arg) => {
    if (arg[0] == '.') {
        let className = arg.replace('.', '');
        return document.getElementsByClassName(className)[0];
    } else if (arg[0] == '#') {
        let id = arg.replace('#', '');
        return document.getElementById(id);
    }
}

class Card {
    constructor(id, stats) {
        this.id = id;
        this.health = stats.health;
        this.attack = stats.attack;
        this.defense = stats.defense;
        this.evilness = stats.evilness;
        this.deception = stats.deception;
        this.wins = 0;
    }

    htmlConstructor() {
        let html = '';
        html += `<div onclick="game.chooseCard(${this.id})" class="card"><h1>Trumps</h1><hr>Health: <b>${this.health}`;
        html += `</b></br>Attack: <b>${this.attack}</b></br>Defense: <b>${this.defense}</b></br>`;
        html += `Evilness: <b>${this.evilness}</b></br>Deception: <b>${this.deception}</b></br></br>`;
        html += `Wins: <b>${this.wins}</b></br></div>`;
        return html;
    }

    compare(card) {
        let win = false;
        switch(game.player.selectedAttr) {
            case 'health':
                if (this.health > card.health) {
                    win = true;
                } else if (this.health == card.health) {
                    win = [this, card];
                } else {
                    win = false;
                }
                break;
            case 'attack':
                if (this.attack > card.attack) {
                    win = true;
                } else if (this.attack == card.attack) {
                    win = [this, card];
                } else {
                    win = false;
                }
                break;
            case 'defense':
                if (this.defense > card.defense) {
                    win = true;
                } else if (this.defense == card.defense) {
                    win = [this, card];
                } else {
                    win = false;
                }
                break;
            case 'evilness':
                if (this.evilness < card.evilness) {
                    win = true;
                } else if (this.evilness == card.evilness) {
                    win = [this, card];
                } else {
                    win = false;
                }
                break;
            case 'deception':
                if (this.deception < card.deception) {
                    win = true;
                } else if (this.deception == card.deception) {
                    win = [this, card];
                } else {
                    win = false;
                }
                break;
            default:
                break;
        }
        return win;
    }
}

let game = {
    player: {
        playersChoice: true,
        deck: [],
        otherDeck: [],
        selectedCard: null,
        selectedAttr: null,
        limboCards: null
    },
    choiceCardDeck: [],
    settings: {
        choiceCardLength: 30,
        maxCards: 15,
        inPlay: false
    },
    randomNumber(max = 100) {
        return Math.floor(Math.random() * max) + 1;
    },
    makeCard(id) {
        return new Card(id, {
            health: this.randomNumber(1000),
            attack: this.randomNumber(500),
            defense: this.randomNumber(750),
            evilness: this.randomNumber(10),
            deception: this.randomNumber(5)
        })
    },
    getCardById(id) {
        let correctCard = null;
        this.player.deck.forEach(card => {
            if (card.id == id) {
                correctCard = card;
            }
        });
        return correctCard;
    },
    getIndexById(array, id) {
        let correctCard = null;
        for (let i = 0; i < array.length; i++) {
            let card = array[i];
            if (card.id == id) {
                correctCard = i;
                break;
            } 
        }
        return correctCard;
    },
    chooseCard(id) {
        if (!this.settings.inPlay) {
            this.player.selectedCard = this.getCardById(id);
            $('.cardRow').style.visibility = 'hidden';
            if (this.player.playersChoice) {
                $('.pickAtt').style.visibility = 'visible';
                this.updateGameInfo('Pick an attribute to compare!');
            } else {
                let attrs = ['health', 'attack', 'defense', 'evilness', 'deception'];
                let attr = attrs[this.randomNumber(attrs.length - 1)];
                this.player.selectedAttr = attr;
                this.updateGameInfo(`The chosen attribute is ${attr} | Click reveal to see who won!`);
                $('.revealBox').style.visibility = 'visible';
                $('.revealBox').innerHTML = this.player.selectedCard.htmlConstructor() + this.generateEmptyCard();
                $('.revealBox').innerHTML += '</br><button onclick="game.revealTurnWinner()">Reveal</button>'
                this.settings.inPlay = true;
            }
        }
    },
    chooseAttribute(attr) {
        this.player.selectedAttr = attr;
        $('.pickAtt').style.visibility = 'hidden';
        this.updateGameInfo('Click reveal to see who won!');
        $('.revealBox').style.visibility = 'visible';
        $('.revealBox').innerHTML = this.player.selectedCard.htmlConstructor() + this.generateEmptyCard();
        $('.revealBox').innerHTML += '</br><button onclick="game.revealTurnWinner()">Reveal</button>'
        this.settings.inPlay = true;
    },
    generateDecks() {
        let deck = [];
        for (let i = 0; i < this.settings.choiceCardLength; i++) {
            deck.push(this.makeCard(i));
        }
        for (let i = 0; i < 15; i++) {
            let randomNumber = this.randomNumber(deck.length - 1);  
            this.player.deck.push(deck[randomNumber]);
            deck.splice(randomNumber, 1);
        }
        this.player.otherDeck = deck;
    },
    revealTurnWinner() {
        let indexOfOtherCard = this.randomNumber(this.player.otherDeck.length - 1);
        if (this.player.otherDeck.length == 1) {
            indexOfOtherCard = 0;
        }
        let otherCard = this.player.otherDeck[indexOfOtherCard];
        $('.revealBox').innerHTML = this.player.selectedCard.htmlConstructor() + otherCard.htmlConstructor();
        $('.revealBox').innerHTML += '</br><button onclick="game.nextTurn()">Continue</button>';
        let state = this.player.selectedCard.compare(otherCard);
        if (state === true) {
            this.player.playersChoice = true;
            $('.gameInfo').innerHTML = 'Player 1 won this turn!';
            this.player.selectedCard.wins++;
            this.player.deck.push(otherCard);
            this.player.otherDeck.splice(indexOfOtherCard, 1);
            if (this.player.limboCards) {
                this.addLimboCards(this.player.deck);
            }
        } else if (state === false) {
            $('.gameInfo').innerHTML = 'Player 2 won this turn!';
            this.player.playersChoice = false;
            otherCard.wins++;
            this.player.otherDeck.push(this.player.selectedCard);
            this.player.deck.splice(this.getIndexById(this.player.deck, this.player.selectedCard.id), 1);
            if (this.player.limboCards) {
                this.addLimboCards(this.player.otherDeck);
            }
        } else {
            this.updateGameInfo('There was a tie! Both cards have entered a limbo state! Next winner takes all!');
            this.player.otherDeck.splice(indexOfOtherCard, 1);
            this.player.deck.splice(this.getIndexById(this.player.deck, this.player.selectedCard.id), 1);
            this.player.limboCards = state;
        }
        this.player.selectedCard = null;
        this.player.selectedAttr = null;
    },
    addLimboCards(array) {
        this.player.limboCards.forEach(card => {
            array.push(card);
        });
        this.player.limboCards = null;
    },
    nextTurn() {
        $('.revealBox').innerHTML = '';
        $('.revealBox').style.visibility = 'hidden';
        if (this.player.deck.length == 0 || this.player.otherDeck.length == 0) {
            if(this.player.otherDeck.length == 0) {
                this.updateGameInfo('Player 1 has won the game!');
            } else {
                this.updateGameInfo('Player 2 has won the game!');
            }
        } else {
            this.settings.inPlay = false;
            this.updateGameInfo('Pick another card!');
        }
        this.displayPlayerCards(this.player.deck);
        $('.cardRow').style.visibility = 'visible';
    },
    generateEmptyCard() {
        let html = '';
        html += `<div class="card"><h1>Trumps</h1><hr>Health: <b>?</b></br>Attack: <b>?</b></br>`;
        html += `Defense: <b>?</b></br>Evilness: <b>?</b></br>Deception: <b>?</b></br></br>`;
        html += '</br></div>'
        return html;
    },
    updateGameInfo(msg) {
        $('.gameInfo').innerHTML = msg;
    },
    displayPlayerCards(deck) {
        let html = '';
        deck.forEach(card => {
            html += card.htmlConstructor();
        });
        $('.cardRow').innerHTML = html;
    },
    start() {
        this.generateDecks();
        this.displayPlayerCards(this.player.deck);
    }
}

game.start();

