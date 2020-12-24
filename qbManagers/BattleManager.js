/**
 * The BATTLE object holds all of the information for the current battle.
 * @typedef BATTLE
 * @property {array<BattleClient>} CLIENTS - Array of {@link Client}, the first one in the array is always the one the girl is fucking
 * @property {BattleManager.GIRLS} GIRLS - Object that holds all of the girl's stats
 * @property {array<String>} GIRLS.girlArray - All of the girlIDs that are in the battle
 * @property {'Easy'|'Normal'|'Hard'} Difficulty - The difficulty set for this battle, does not effect anything unless certain attacks utilize this variable
 * @property Parameters - An optional variable that can store anything that is needed during the battle
 */

/**
 * @class BattleManager
 */
class BattleManager {
    constructor() {
        /**
         * @type {Battle|boolean}
         */
        this.currentBattle = false;
        this.battleConditions = {}
    }

    /**
     * Generates an array of clients that could have been summoned with the current reputation
     * @method getClientPack
     * @memberOf BattleManager
     * @instance
     */
    getClientPack() {
        let clients = [];
        let amountOfClients = 2;
        let names = [];
        let types = [];
        let levels = {min: 1, max: 4};
        let gold = {min: 10, max: 30};

        // Easthollow
        names.push('ClientBorderE1');
        names.push('ClientBorderE2');
        names.push('ClientBorderE3');
        names.push('ClientBorderE4');
        types.push('Passive');
        types.push('Cummer');
        if (GAME.quest.isComplete('greenhaven')) {
            levels.min = 1;
            levels.max = 10;
            gold.min = 10;
            gold.max = 30;
            amountOfClients = 3;
        }

        // Greenhaven
        if (GAME.quest.isComplete('hornyBoris', 'WhoreGreenhaven')) {
            names.push('ClientBorderG1');
            names.push('ClientBorderG2');
            names.push('ClientBorderG3');
            names.push('ClientBorderG4');
            types.push('Speedy');
            gold.min = 15;
            gold.max = 40;
            amountOfClients = 5;
        }

        // Morass
        if (GAME.quest.isComplete('mushroomQuest', 'ReturnThisa')) {
            names.push('ClientBorderGo1');
            names.push('ClientBorderGo2');
            names.push('ClientBorderGo3');
            names.push('ClientBorderGo4');
            types.push('Switcher')
            levels.min = 8;
            levels.max = 15;
            gold.min = 20;
            gold.max = 60;
            amountOfClients = 7;
        }

        // Avia
        if (GAME.quest.isComplete('kingsQuest')) {
            names.push('ClientBorderP1');
            names.push('ClientBorderP2');
            names.push('ClientBorderP3');
            names.push('ClientBorderP4');
            types.push('Edger')
            levels.min = 10;
            levels.max = 20;
            gold.min = 25;
            gold.max = 80;
            amountOfClients = 10;
        }

        // Mountains
        if (GAME.quest.isComplete('mountainTraining', 'NaknuAfterOrcBoss')) {
            names.push('ClientBorderO1');
            names.push('ClientBorderO2');
            names.push('ClientBorderO3');
            names.push('ClientBorderO4');
            types.push('BigCock')
            levels.min = 15;
            levels.max = 25;
            gold.min = 30;
            gold.max = 100;
            amountOfClients = 13;
        }

        for (let i = 1; i <= amountOfClients; i++) {
            let rndName = chance.pickone(names);
            let rndType = chance.pickone(types);

            let client;

            switch (rndType) {
                case 'Passive':
                    client = new BattleClient("", chance.integer(levels), [new BattleClientTypePassive()], chance.pickone(skills), 16000, rndName)
                        .setGold(chance.integer(gold));
                    break;
                case 'Cummer':
                    client = new BattleClient("", chance.integer(levels), [new BattleClientTypeCummer()], chance.pickone(skills), 8000, rndName)
                        .setGold(chance.integer(gold));
                    break;
                case 'Speedy':
                    client = new BattleClient("", chance.integer(levels), [new BattleClientTypeSpeedy()], chance.pickone(skills), 16000, rndName)
                        .setGold(chance.integer(gold));
                    break;
                case 'Switcher':
                    client = new BattleClient("", chance.integer(levels), [new BattleClientTypeSwitcher()], chance.pickone(skills), 20000, rndName)
                        .setGold(chance.integer(gold));
                    break;
                case 'Edger':
                    client = new BattleClient("", chance.integer(levels), [new BattleClientTypeEdger()], chance.pickone(skills), 16000, rndName)
                        .setGold(chance.integer(gold));
                    break;
                case 'BigCock':
                    client = new BattleClient("", chance.integer(levels), [new BattleClientTypeBigCock()], chance.pickone(skills), 20000, rndName)
                        .setGold(chance.integer(gold));
                    break;
            }

            clients.push(client);
        }

        clients = Phaser.Utils.Array.Shuffle(clients);
        return clients;
    }

    /**
     * @method clientAttack
     * @memberOf BattleManager
     * @instance
     * @private
     * @param {string} clientGUID
     */
    clientAttack(clientGUID) {
        let BATTLE = GAME.battle.currentBattle;
        let client = BATTLE.getClientByGUID(clientGUID);
        let girl = client.getGirl().getID();
        let bodyPart = client.getBodyPart();
        let attack = client.getAttack(true);

        let girlLevel = GAME.girl.getGirl(girl).getStat(bodyPart);
        let baseDamage = 0.6;
        let totalDamage = baseDamage - (baseDamage * (Math.round(GAME.Sigmoid(girlLevel, client.getLevel()) * 10) / 10));
        totalDamage = totalDamage * attack.damageScale;

        if (totalDamage <= 0) {
            totalDamage = 0;
        }

        let totalExp = client.getExp(girl);

        GAME.girl.getGirl(girl).loseStamina(totalDamage);
        GAME.girl.getGirl(girl).gainExp(totalExp, true);
        if (BATTLE.isUltimating(girl) === false) {
            if (totalDamage <= 0.2) {
                GAME.girl.getGirl(girl).addUltimate(5);
            } else if (totalDamage > 0.2 && totalDamage <= 0.5) {
                GAME.girl.getGirl(girl).addUltimate(10);
            } else {
                GAME.girl.getGirl(girl).addUltimate(15);
            }
        }

        if (GAME.girl.getGirl(girl).getStamina() <= 0) {
            BATTLE.stopFuckingClient(client);
            if (BATTLE.getActiveGirls().length <= 0) {
                BATTLE.loseBattle();
            }
        }

        globalEvents.emit('clientTick', clientGUID);
    }

    /**
     * @method startBattle
     * @memberOf BattleManager
     * @instance
     * @param {Battle} Battle
     * @returns {Promise<boolean>}
     */
    startBattle(Battle) {
        return new Promise((resolve) => {
            this.currentBattle = Battle;
            globalEvents.on('clientAttack', this.clientAttack, this);

            game.scene.start('BattleScene', {pauseAllScenes: true, BATTLE: this.currentBattle});
            game.scene.getScene('BattleScene').events.once('shutdown', (scene, data) => {
                this.currentBattle = false;
                globalEvents.off('clientAttack', this.clientAttack);
                resolve(data.answer);
            })
        });
    }
}

class Battle {
    /**
     * @constructor
     * @param {Array<string>} [girlArray]
     * @param {'Easy'|'Normal'|'Hard'} [difficulty="Easy"]
     * @param {*} [parameters]
     * @returns {Battle}
     */
    constructor(girlArray, difficulty, parameters) {
        girlArray = girlArray || GAME.girl.getUnlocked();
        difficulty = difficulty || 'Easy';
        parameters = parameters || null;

        this.GIRLS = {
            girlArray: girlArray
        };
        this.CLIENTS = [];
        this.SelectedClient = false;
        this.Difficulty = difficulty;
        this.Parameters = parameters;

        for (let i in girlArray) {
            this.GIRLS[girlArray[i]] = {
                Client: false,
                Trapped: false,
                Effect: false,
                Ultimate: false
            }
        }

        return this;
    }

    /**
     * To manually win the battle at any point
     * @method winBattle
     * @memberOf Battle
     * @instance
     */
    winBattle() {
        game.scene.getScene('BattleScene').winBattle();
    }

    /**
     * To manually lose the battle at any point
     * @method loseBattle
     * @memberOf Battle
     * @instance
     */
    loseBattle() {
        game.scene.getScene('BattleScene').loseBattle();
    }

    /**
     * @method addClient
     * @memberOf Battle
     * @instance
     * @param {BattleClient} client - {@link BattleClient}
     */
    addClient(client) {
        this.CLIENTS.push(client);

        globalEvents.emit('refreshClients');

        return this;
    }

    /**
     * @method addClients
     * @memberOf Battle
     * @instance
     * @param {Array<BattleClient>} clients
     * @returns {Battle}
     */
    addClients(clients) {
        for (let client of clients) {
            this.CLIENTS.push(client);
        }

        globalEvents.emit('refreshClients');

        return this;
    }


    /**
     * @method fuck
     * @memberOf Battle
     * @instance
     * @param {string} girl
     * @param {BattleClient} client
     * @returns {null}
     */
    fuck(girl, client) {
        if (client === false) {
            GAME.notify("Select a client!");
            return null;
        }

        let bodyPart = client.getBodyPart();

        if (GAME.girl.getGirl(girl).getStamina() <= 0) {
            GAME.notify(girl + " does not have enough stamina!");
            return null;
        }
        if (this.isTrapped(girl)) {
            GAME.notify(girl + " is trapped!");
            return null;
        }
        if (client.getGirl() !== false) {
            if (this.isTrapped(client.getGirl().getID())) {
                GAME.notify("Client is busy fucking " + client.getGirl().getID());
                return null;
            }
        }
        if (this.getClientByGirl(girl) !== false) {
            this.stopFuckingClient(this.getClientByGirl(girl));
        }
        client.fuck(girl);
    }

    /**
     * @method stopFuckingClient
     * @memberOf Battle
     * @instance
     * @param client
     */
    stopFuckingClient(client) {
        client.stopFucking();
        client.setAnimation("battleNullImage");
        globalEvents.emit('stopFuckingClient', client);
    }

    /**
     * @method getClientByGUID
     * @memberOf Battle
     * @instance
     * @param clientGUID
     * @returns {*|boolean}
     */
    getClientByGUID(clientGUID) {
        return this.CLIENTS[this.CLIENTS.map(function (x) {
            return x.GUID
        }).indexOf(clientGUID)] || false;
    }

    /**
     * Returns a number of active clients
     * @method numActiveClients
     * @memberOf Battle
     * @instance
     * @returns {number}
     */
    numActiveClients() {
        let counter = 0;

        for (let client of this.CLIENTS) {
            if (client.getFinished() === false) {
                counter += 1;
            }
        }

        return counter;
    }

    /**
     * Returns the girls that have stamina
     * @method getActiveGirls
     * @memberOf Battle
     * @instance
     * @returns {Array<string>}
     */
    getActiveGirls() {
        let array = [];

        for (let girl of this.GIRLS.girlArray) {
            if (GAME.girl[girl].getStamina() > 0) {
                array.push(girl);
            }
        }

        return array;
    }

    /**
     * @method getClientByGirl
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean|BattleClient}
     */
    getClientByGirl(girlID) {
        let client = false;

        for (let c of this.CLIENTS) {
            if (c.getGirl() !== false) {
                if (c.getGirl().getID() === girlID) {
                    client = c;
                }
            }
        }

        return client;
    }

    /**
     * @method isTrapped
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean}
     */
    isTrapped(girlID) {
        return this.GIRLS[girlID].Trapped !== false;
    }

    /**
     * @method trapGirl
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @param {BattleEffect} BattleEffect
     */
    trapGirl(girlID, BattleEffect) {
        let girl = this.GIRLS[girlID];

        if (this.isTrapped(girlID)) {
            this.removeTrap(girlID);
        }

        girl.Trapped = BattleEffect;

        girl.Trapped.start(this.getClientByGirl(girlID), null, () => {
            this.removeTrap(girlID);
        });
    }

    /**
     * @method getTrap
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean}
     */
    getTrap(girlID) {
        if (this.isTrapped(girlID)) {
            return this.GIRLS[girlID].Trapped;
        } else {
            return false;
        }
    }

    /**
     * @method removeTrap
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     */
    removeTrap(girlID) {
        if (this.isTrapped(girlID)) {
            this.GIRLS[girlID].Trapped.remove();
            this.GIRLS[girlID].Trapped = false;
        } else {
            this.GIRLS[girlID].Trapped = false;
        }
    }

    /**
     * @method isEffected
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean}
     */
    isEffected(girlID) {
        return this.GIRLS[girlID].Effect !== false;
    }

    /**
     * @method effectGirl
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @param {BattleEffect} BattleEffect
     */
    effectGirl(girlID, BattleEffect) {
        let girl = this.GIRLS[girlID];

        if (this.isEffected(girlID)) {
            this.removeEffect(girlID);
        }

        girl.Effect = BattleEffect;

        girl.Effect.start(this.getClientByGirl(girlID), null, () => {
            this.removeEffect(girlID);
        });
    }

    /**
     * @method getEffect
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean}
     */
    getEffect(girlID) {
        if (this.isEffected(girlID)) {
            return this.GIRLS[girlID].Effect;
        } else {
            return false;
        }
    }

    /**
     * @method removeEffect
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     */
    removeEffect(girlID) {
        if (this.isEffected(girlID)) {
            this.GIRLS[girlID].Effect.remove();
            this.GIRLS[girlID].Effect = false;
        } else {
            this.GIRLS[girlID].Effect = false;
        }
    }

    /**
     * @method isUltimating
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean}
     */
    isUltimating(girlID) {
        return this.GIRLS[girlID].Ultimate !== false;
    }

    /**
     * @method ultimateGirl
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     */
    ultimateGirl(girlID) {
        let girl = this.GIRLS[girlID];

        if (this.isUltimating(girlID)) {
            this.removeUltimate(girlID);
        }

        girl.Ultimate = this.getUltimateEffect(girlID);

        girl.Ultimate.start(this.getClientByGirl(girlID), null, () => {
            this.removeUltimate(girlID);
        });
    }

    /**
     * @method getUltimate
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {boolean}
     */
    getUltimate(girlID) {
        if (this.isUltimating(girlID)) {
            return this.GIRLS[girlID].Ultimate;
        } else {
            return false;
        }
    }

    /**
     * @method getUltimateEffect
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     * @returns {BattleEffect}
     */
    getUltimateEffect(girlID) {
        let battleEffect = false;

        switch (girlID) {
            case 'Queen':
                battleEffect = new BattleEffectUltimateQueen();
                break;
            case'Suki':
                battleEffect = new BattleEffectUltimateSuki();
                break;
            case 'Esxea':
                battleEffect = new BattleEffectUltimateEsxea();
                break;
            case 'Scarlett':
                battleEffect = new BattleEffectUltimateScarlett();
                break;
            case 'Ardura':
                battleEffect = new BattleEffectUltimateArdura();
                break;
            case 'Natasha':
                battleEffect = new BattleEffectUltimateNatasha();
                break;
        }

        return battleEffect;
    }

    /**
     * @method removeUltimate
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     */
    removeUltimate(girlID) {
        if (this.isUltimating(girlID)) {
            this.GIRLS[girlID].Ultimate.remove();
            this.GIRLS[girlID].Ultimate = false;
        } else {
            this.GIRLS[girlID].Ultimate = false;
        }
    }

    /**
     * @method useUltimate
     * @memberOf Battle
     * @instance
     * @param {string} girlID
     */
    useUltimate(girlID) {
        let girl = GAME.girl.getGirl(girlID);

        if (this.isUltimating(girlID) === false && girl.getUltimate() >= 100) {
            let ultimate = this.getUltimateEffect(girlID);
            // Needs a client to ultimate
            if (ultimate.needsClient === true) {
                let client = this.getClientByGirl(girlID);
                if (client !== false && client.getFinished() === false) {
                    girl.subtractUltimate(100);
                    this.ultimateGirl(girlID);
                } else {
                    GAME.notify("Select a client!");
                }
            } else {
                girl.subtractUltimate(100);
                this.ultimateGirl(girlID);
            }
        } else {
            GAME.notify(girlID + "'s ultimate is not ready!");
        }
    }
}

class BattleEffect {
    constructor(id, name, description, thumbnail) {
        this.battle = GAME.battle.currentBattle;
        this.id = id;
        this.name = name;
        this.description = description || "";
        this.thumbnail = thumbnail || 'nullPixel';
        this.lengthMS = 1000;
        this.attackMS = 1000;
        this.effectText = '';

        this.properties = {
            tween: false,
            attackTween: false,
            tweenDuration: 0,
            attackDuration: 0
        }

        return this;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;
        return this;
    }

    getEffectText() {
        return this.effectText;
    }

    setEffectText(text) {
        this.effectText = text;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    onStart(client) {

    }

    onComplete(client) {

    }

    onRepeat(client) {

    }

    start(client, onStart, onComplete) {
        this.remove();
        let scene = game.scene.getScene('BattleScene');

        this.properties.tween = scene.tweens.add({
            targets: this.properties,
            tweenDuration: 100,
            ease: "Linear",
            duration: this.lengthMS,
            onStart: onStart,
            onComplete: onComplete,
            paused: false
        });

        this.properties.tween.on(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
            this.onComplete(client);
        });

        this.properties.tween.on(Phaser.Tweens.Events.TWEEN_START, () => {
            this.onStart(client);
        });

        this.properties.attackTween = scene.tweens.add({
            targets: this.properties,
            attackDuration: 100,
            ease: "Linear",
            duration: this.attackMS,
            repeat: -1,
            paused: false
        });

        this.properties.attackTween.on(Phaser.Tweens.Events.TWEEN_REPEAT, () => {
            this.onRepeat(client);
        });
    }

    update(attack, client) {
        return attack;
    }

    remove() {
        if (this.properties.tween !== false) {
            this.properties.tween.stop();
        }
        if (this.properties.attackTween !== false) {
            this.properties.attackTween.stop();
        }
    }

    getTweenDuration() {
        return this.properties.tweenDuration;
    }

    getAttackTweenDuration() {
        return this.properties.attackDuration;
    }
}

class BattleEffectTrap extends BattleEffect {
    constructor(girlID, damageScale, trapUpdate) {
        super("Trap", "Trap", girlID + " is trapped and can not move.", "trapIcon");
        this.girlID = girlID;
        this.damageScale = damageScale || 0;
        if (this.trapUpdate) {
            this.update = trapUpdate;
        }

        return this;
    }

    onRepeat() {
        if (this.battle.getClientByGirl(this.girlID)) {
            this.battle.getClientByGirl(this.girlID).fuck(this.girlID);
        }
    }

    update(attack, client) {
        attack.damageScale = attack.damageScale + this.damageScale;
        return attack;
    }
}

class BattleEffectBreak extends BattleEffect {
    constructor() {
        super("Break", "Break", "Girl has a chance to stop fucking the client", "breakIcon");
        this.attackMS = 10000;
        this.lengthMS = 10000;
        return this;
    }
}

class BattleEffectLactate extends BattleEffect {
    constructor(girlID, lengthMS) {
        super("Lactate", "Lactate", girlID + " is lactating and losing extra stamina.", "lactateIcon");
        this.attackMS = 10000;
        this.lengthMS = lengthMS || 10000;
        return this;
    }

    update(attack, client) {
        attack.damageScale = attack.damageScale + 0.5;
        return attack;
    }
}

class BattleEffectMud extends BattleEffect {
    constructor(mudStack) {
        super("Mud", "Mud", "Mud slows down the client's cum meter.", "nullPixel");
        this.attackMS = 10000;
        this.mudStack = mudStack || 1;
        this.lengthMS = this.mudStack * 1000;
        this.setThumbnail('mudIcon');

        if (this.mudStack < 0) {
            this.mudStack = 1;
        }
        if (this.mudStack > 10) {
            this.mudStack = 10;
        }

        this.effectText = this.mudStack.toString();
    }

    update(attack, client) {
        attack.cumTweenScale = attack.cumTweenScale - (this.mudStack / 10);
        return attack;
    }
}

class BattleEffectUltimateQueen extends BattleEffect {
    constructor() {
        super("UltimateQueen", "Ultimate for Queen", "Ultimate for Queen", 'nullPixel');
        this.lengthMS = 1000;
        this.attackMS = 1000;
        this.needsClient = false;

        this.onStart = () => {
            for (let girl of GAME.battle.currentBattle.GIRLS.girlArray) {
                GAME.girl.getGirl(girl).gainStamina(1, false);
            }
        }
    }
}

class BattleEffectUltimateSuki extends BattleEffect {
    constructor() {
        super("UltimateSuki", "Ultimate for Suki", "Ultimate for Suki", 'nullPixel');
        this.lengthMS = 10000;
        this.attackMS = 10000;
        this.needsClient = false;

        this.update = (attack, client) => {
            attack.excitementTweenScale = attack.excitementTweenScale - 0.3;
            return attack;
        }
    }
}

class BattleEffectUltimateEsxea extends BattleEffect {
    constructor() {
        super("UltimateEsxea", "Ultimate for Esxea", "Ultimate for Esxea", 'nullPixel');
        this.lengthMS = 5000;
        this.attackMS = 5000;
        this.needsClient = false;

        this.update = (attack, client) => {
            attack.damageScale = attack.damageScale - 2;
            return attack;
        }
    }
}

class BattleEffectUltimateScarlett extends BattleEffect {
    constructor() {
        super("UltimateScarlett", "Ultimate for Scarlett", "Ultimate for Scarlett", 'nullPixel');
        this.lengthMS = 10000;
        this.attackMS = 10000;
        this.needsClient = false;

        this.update = (attack, client) => {
            attack.cumTweenScale = attack.cumTweenScale + 0.5;
            return attack;
        }
    }
}

class BattleEffectUltimateArdura extends BattleEffect {
    constructor() {
        super("UltimateArdura", "Ultimate for Ardura", "Ultimate for Ardura", 'nullPixel');
        this.lengthMS = 10000;
        this.attackMS = 10000;
        this.before = 0;
        this.client = "";
        this.needsClient = true;

        this.onStart = (client) => {
            this.before = client.getLevel();
            this.client = client.GUID;
            client.setLevel(client.getLevel() - 10);
        }

        this.onComplete = () => {
            GAME.battle.currentBattle.getClientByGUID(this.client).setLevel(this.before);
        }
    }
}

class BattleEffectUltimateNatasha extends BattleEffect {
    constructor() {
        super("UltimateNatasha", "Ultimate for Natasha", "Ultimate for Natasha", 'nullPixel');
        this.lengthMS = 1000;
        this.attackMS = 1000;
        this.needsClient = false;

        this.onStart = () => {
            for (let girl of GAME.battle.currentBattle.GIRLS.girlArray) {
                GAME.girl.getGirl(girl).addUltimate(20);
            }
        }
    }
}