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
    }

    htmlConstructor() {
        let html = '';
        html += `<div onclick="game.chooseCard(${this.id})" class="card"><h1>Trumps</h1><hr>Health: <b>${this.health}`;
        html += `</b></br>Attack: <b>${this.attack}</b></br>Defense: <b>${this.defense}</b></br>`;
        html += `Evilness: <b>${this.evilness}</b></br>Deception: <b>${this.deception}</b>`;
        html += '</br></div>'
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
        deck: [],
        otherDeck: [],
        selectedCard: null,
        selectedAttr: null
    },
    choiceCardDeck: [],
    settings: {
        twoPlayerMode: false,
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
            attack: this.randomNumber(),
            defense: this.randomNumber(),
            evilness: this.randomNumber(10),
            deception: this.randomNumber(5)
        })
    },
    getCardById(id) {
        if (!this.twoPlayerMode) {
            let correctCard = null;
            this.player.deck.forEach(card => {
                if (card.id == id) {
                    correctCard = card;
                }
            });
            return correctCard;
        }
    },
    chooseCard(id) {
        if (!this.settings.inPlay) {
            this.player.selectedCard = this.getCardById(id);
            $('.cardRow').style.visibility = 'hidden';
            $('.pickAtt').style.visibility = 'visible';
            this.updateGameInfo('Pick an attribute to compare!');
        }
    },
    chooseAttribute(attr) {
        game.player.selectedAttr = attr;
        $('.pickAtt').style.visibility = 'hidden';
        this.updateGameInfo('Click reveal to see who won!');
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
        let otherCard = this.player.otherDeck[this.randomNumber(this.player.otherDeck.length - 1)];
        $('.revealBox').innerHTML = this.player.selectedCard.htmlConstructor() + otherCard.htmlConstructor();
        let state = this.player.selectedCard.compare(otherCard);
        if (state === true) {
            $('.gameInfo').innerHTML = 'Player 1 won this turn!';
        } else if (state === false) {
            $('.gameInfo').innerHTML = 'Player 2 won this turn!';
        } else {
            // Limbo state
        }
    },
    generateEmptyCard() {
        let html = '';
        html += `<div class="card"><h1>Trumps</h1><hr>Health: <b>?</b></br>Attack: <b>?</b></br>`;
        html += `Defense: <b>?</b></br>Evilness: <b>?</b></br>Deception: <b>?</b>`;
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

