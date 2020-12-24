class Boss {
    /**
     * @constructor
     * @param {string} id
     * @param {string} name
     * @param {function|boolean} condition
     * @returns {Boss}
     * @property {string} id
     * @property {object} dialogue
     * @property {string} dialogue.Easy
     * @property {string} dialogue.Normal
     * @property {string} dialogue.Hard
     * @property {object} rewards
     * @property {object} rewards.Easy
     * @property {array} rewards.Easy.Clothes
     * @property {object} rewards.Normal
     * @property {array} rewards.Normal.Clothes
     * @property {object} rewards.Hard
     * @property {array} rewards.Hard.Clothes
     *
     */
    constructor(id, name, condition) {
        this.id = id;
        this.name = name;
        this.condition = condition;

        this.dialogue = {
            Easy: false,
            Normal: false,
            Hard: false
        };
        this.rewards = {
            Easy: {
                Clothes: []
            },
            Normal: {
                Clothes: []
            },
            Hard: {
                Clothes: []
            }
        };

        return this;
    }

    /**
     * @method setID
     * @memberOf Boss
     * @instance
     * @param {string} id
     * @returns {Boss}
     */
    setID(id) {
        this.id = id;
        return this;
    }

    /**
     * @method getID
     * @memberOf Boss
     * @instance
     * @returns {string}
     */
    getID() {
        return this.id;
    }

    /**
     * @method setName
     * @memberOf Boss
     * @instance
     * @param {string} name
     * @returns {Boss}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * @method getName
     * @memberOf Boss
     * @instance
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @method setCondition
     * @memberOf Boss
     * @instance
     * @param {function} condition
     * @returns {Boss}
     */
    setCondition(condition) {
        this.condition = condition;
        return this;
    }

    /**
     * @method getCondition
     * @memberOf Boss
     * @instance
     * @returns {function|boolean}
     */
    getCondition() {
        return this.condition;
    }

    /**
     * @method isAvailable
     * @memberOf Boss
     * @instance
     * @returns {boolean}
     */
    isAvailable() {
        if (typeof this.condition === "boolean") {
            return this.condition;
        } else {
            return this.condition();
        }
    }

    /**
     * All boss battles are just dialogue scenes that have battles that start in them
     * @method setDialogue
     * @memberOf Boss
     * @instance
     * @param {string} difficulty
     * @param {string} dialogueID - Must return a promise that resolves true or false
     * @returns {Boss}
     */
    setDialogue(difficulty, dialogueID) {
        this.dialogue[difficulty] = dialogueID;
        return this;
    }

    /**
     * @method getDialogue
     * @memberOf Boss
     * @instance
     * @param {string} difficulty
     * @returns {string}
     */
    getDialogue(difficulty) {
        return this.dialogue[difficulty];
    }

    /**
     * Adds a clothes reward if the player beats the boss at the specified difficulty
     * @method addClothesReward
     * @memberOf Boss
     * @instance
     * @param {string} difficulty
     * @param {string} clothesID
     * @returns {Boss}
     */
    addClothesReward(difficulty, clothesID) {
        this.rewards[difficulty].Clothes.push(clothesID);
        return this;
    }

    /**
     * @method getRewards
     * @memberOf Boss
     * @instance
     * @param {string} difficulty
     * @returns {object}
     */
    getRewards(difficulty) {
        return this.rewards[difficulty];
    }

    getTimesCompleted(difficulty) {
        return gameData.bosses[this.id][difficulty];
    }
}

class BossManager {
    /**
     * @constructor
     * @property {object<Boss>} Bosses
     */
    constructor() {
        this.Bosses = {};
    }

    /**
     * @method _initBossClients
     * @memberOf BossManager
     * @instance
     * @private
     */
    _initBosses() {
        // Greenhaven Boss
        this.add(new Boss('Boris', 'Boris', function () {
            return GAME.quest.isComplete('hornyBoris', 'End')
        }))
            .setDialogue('Easy', "hornyBorisBossEasy")
            .addClothesReward('Easy', 'ForestQueen')
            .addClothesReward('Easy', 'ForestSuki')
            .addClothesReward('Easy', 'ForestEsxea')
            .addClothesReward('Easy', 'ForestScarlett')
            .addClothesReward('Easy', 'ForestArdura')
            .addClothesReward('Easy', 'ForestNatasha');

        // Morass Boss
        this.add(new Boss('Goblins', 'Wild Goblins', function () {
            return GAME.quest.isComplete('mushroomQuest')
        }))
            .setDialogue('Easy', "mushroomQuestBossEasy")
            .addClothesReward('Easy', 'MudQueen')
            .addClothesReward('Easy', 'MudSuki')
            .addClothesReward('Easy', 'MudEsxea')
            .addClothesReward('Easy', 'MudScarlett')
            .addClothesReward('Easy', 'MudArdura')
            .addClothesReward('Easy', 'MudNatasha');

        // King Boss
        this.add(new Boss('KingOfAvia', 'King of Avia', function () {
            return GAME.quest.isComplete('kingsQuest')
        }))
            .setDialogue('Easy', "kingsQuestBossEasy")
            .addClothesReward('Easy', 'PrincessQueen')
            .addClothesReward('Easy', 'PrincessSuki')
            .addClothesReward('Easy', 'PrincessEsxea')
            .addClothesReward('Easy', 'PrincessScarlett')
            .addClothesReward('Easy', 'PrincessArdura')
            .addClothesReward('Easy', 'PrincessNatasha');

        // Orc Boss
        this.add(new Boss('Orcs', 'Orcs', function () {
            return GAME.quest.isComplete('mountainTraining')
        }))
            .setDialogue('Easy', "orcBossEasy")
            .addClothesReward('Easy', 'OrcQueen')
            .addClothesReward('Easy', 'OrcSuki')
            .addClothesReward('Easy', 'OrcEsxea')
            .addClothesReward('Easy', 'OrcScarlett')
            .addClothesReward('Easy', 'OrcArdura')
            .addClothesReward('Easy', 'OrcNatasha');

        // Demon Boss
        this.add(new Boss('Minotaurs', 'Minotaurs', function () {
            return GAME.quest.isComplete('lilithQuest')
        }))
            .setDialogue('Easy', "demonBossEasy")
            .addClothesReward('Easy', 'DemonQueen')
            .addClothesReward('Easy', 'DemonSuki')
            .addClothesReward('Easy', 'DemonEsxea')
            .addClothesReward('Easy', 'DemonScarlett')
            .addClothesReward('Easy', 'DemonArdura')
            .addClothesReward('Easy', 'DemonNatasha');

        // Final Boss
        this.add(new Boss('Nigel', 'Nigel', function () {
            return GAME.quest.isComplete('finalBoss')
        }))
            .setDialogue('Easy', "nigelBossEasy")
            .addClothesReward('Easy', 'WitchQueen')
            .addClothesReward('Easy', 'WitchSuki')
            .addClothesReward('Easy', 'WitchEsxea')
            .addClothesReward('Easy', 'WitchScarlett')
            .addClothesReward('Easy', 'WitchArdura')
            .addClothesReward('Easy', 'WitchNatasha');
    }

    /**
     * @method add
     * @memberOf BossManager
     * @instance
     * @param {Boss} boss
     * @returns {Boss}
     */
    add(boss) {
        if (gameData.bosses.hasOwnProperty(boss.id) === false) {
            gameData.bosses[boss.id] = {"Easy": 0, "Normal": 0, "Hard": 0};
        }
        this.Bosses[boss.id] = boss;
        return this.Bosses[boss.id];
    }

    getBoss(bossID) {
        return this.Bosses[bossID];
    }

    getAvailableBosses() {
        let array = [];

        for (let i in this.Bosses) {
            if (this.Bosses[i].isAvailable()) {
                array.push(this.Bosses[i]);
            }
        }

        return array;
    }

    /**
     * Increases the times the player has beaten this boss
     * @method incrementBossCompleted
     * @memberOf BossManager
     * @instance
     * @param {string} bossID
     * @param {'Easy'|'Normal'|'Hard'} difficulty
     */
    incrementBossCompleted(bossID, difficulty) {
        if (gameData.bosses.hasOwnProperty(bossID) === false) {
            gameData.bosses[bossID] = {};
        }

        if (gameData.bosses[bossID].hasOwnProperty(difficulty) === false) {
            gameData.bosses[bossID][difficulty] = 0;
        }

        gameData.bosses[bossID][difficulty] += 1;
    }

    /**
     * Gives rewards for the boss battle
     * @method giveRewards
     * @memberOf BossManager
     * @instance
     * @param {string} bossID
     * @param {'Easy'|'Normal'|'Hard'} bossDifficulty
     */
    giveRewards(bossID, bossDifficulty) {
        let dropList = [];
        let rewards = this.getBoss(bossID).getRewards(bossDifficulty);

        if (rewards.hasOwnProperty('Clothes')) {
            let clothesArray = [...rewards.Clothes];

            for (let i = clothesArray.length - 1; i >= 0; i--) {
                let clothes = GAME.clothes.getClothes(clothesArray[i]);
                if (clothes.isUnlocked() === true || clothes.Girl.isUnlocked() === false) {
                    clothesArray.splice(i, 1);
                }
            }

            if (clothesArray.length !== 0) {
                let chosenClothes = chance.pickone(clothesArray);
                dropList.push({clothesID: chosenClothes, type: 'Clothes'});
                GAME.clothes.getClothes(chosenClothes).unlock();
                GAME.notify("Boss dropped " + GAME.clothes.getClothes(chosenClothes).getName() + " clothes for " + GAME.clothes.getClothes(chosenClothes).Girl.id);
            }
        }

        GAME.boss.incrementBossCompleted(bossID, bossDifficulty);

        return dropList;
    }

    /**
     * @method startBossBattle
     * @memberOf BossManager
     * @instance
     * @param {string} bossID
     * @param {string} bossDifficulty
     * @returns {Promise<any>}
     */
    startBossBattle(bossID, bossDifficulty) {
        return new Promise((resolve) => {
            let boss = this.getBoss(bossID);
            if (boss.getDialogue(bossDifficulty) !== false) {
                gameData.bossToday = true;

                GAME.dialogue.playDialogue(boss.getDialogue(bossDifficulty)).then((answer) => {
                    resolve(answer);
                });
            } else {
                console.error("Boss " + bossID + ", difficulty " + bossDifficulty + ", not found!");
                resolve(false);
            }
        });
    }
}