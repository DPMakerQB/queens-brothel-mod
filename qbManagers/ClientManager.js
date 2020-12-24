class BattleClientType {
    /**
     * @constructor
     * @param id
     * @param name
     * @param color
     * @returns {BattleClientType}
     */
    constructor(id, name, color) {
        this.id = id;
        this.name = name || "NOT_SET";
        this.color = color || "#FFFFFF";
        this.description = "";

        return this;
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;

        return this;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    getDescription() {
        return this.description
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    getColor() {
        return this.color;
    }

    setColor(integer) {
        this.color = integer;
        return this;
    }

    condition() {
        return false;
    }

    update(attack, client) {
        return attack;
    }

    onAttack(attack, client) {
        return this.update(attack, client);
    }
}

class BattleClientTypePassive extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypePassive}
     */
    constructor() {
        super("Passive", "Passive", "rgb(255,204,150)");
        this.setDescription("This client has no modifiers.")
        return this;
    }
}

class BattleClientTypeSpeedy extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypeSpeedy}
     */
    constructor() {
        super("Speedy", "Speedy", "rgb(150,255,152)");
        this.setDescription("This client loses excitement slowly when they are more excited.")
        return this;
    }

    condition(client) {
        return true;
    }

    update(attack, client) {
        if (client.excitement > 60) {
            attack.excitementTweenScale = attack.excitementTweenScale - 0.5;
        } else {
            attack.excitementTweenScale = attack.excitementTweenScale + 1;
        }
        return attack;
    }
}

class BattleClientTypeCummer extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypeCummer}
     */
    constructor() {
        super("Cummer", "Cummer", "rgb(255,253,150)");
        this.setDescription("This client cums quickly.")
        return this;
    }

    condition() {
        return true;
    }

    update(attack, client) {
        attack.excitementTweenScale = attack.excitementTweenScale + 1;
        attack.cumTweenScale = attack.cumTweenScale + 2;
        return attack;
    }
}

class BattleClientTypeTrapper extends BattleClientType {
    /**
     * @constructor
     * @param trapChance
     * @param lengthMS
     * @param attackMS
     * @param damageScale
     * @param trapUpdate
     * @returns {BattleClientTypeTrapper}
     */
    constructor(trapChance, lengthMS, attackMS, damageScale, trapUpdate) {
        super("Trapper", "Trapper", "rgb(255,0,0)");
        this.setDescription("This client has the ability to trap girls.")
        this.trapChance = trapChance || 5;
        this.lengthMS = lengthMS || 3000;
        this.attackMS = attackMS || 1000;
        this.damageScale = damageScale;
        this.trapUpdate = trapUpdate;
        return this;
    }

    condition(client) {
        if (client.getGirl() !== false) {
            if (GAME.battle.currentBattle.isTrapped(client.getGirl().getID())) {
                return false;
            } else {
                return chance.bool({likelihood: this.trapChance});
            }
        } else {
            return false;
        }
    }

    onAttack(attack, client) {
        let trap = new BattleEffectTrap(client.getGirl().getID(), this.damageScale, this.trapUpdate);
        trap.lengthMS = this.lengthMS;
        trap.attackMS = this.attackMS;
        GAME.battle.currentBattle.trapGirl(client.getGirl().getID(), trap);
        return attack;
    }
}

class BattleClientTypeSwitcher extends BattleClientType {
    /**
     * @constructor
     * @param skillsArray
     * @param {number} chance
     * @returns {BattleClientTypeSwitcher}
     */
    constructor(skillsArray, chance) {
        super("Switcher", "Switcher", "rgb(158,98,255)");
        this.setDescription("This client has a chance to switch body parts when a girl is selected.")
        this.skills = skillsArray || skills;
        this.chance = chance || 30;
        return this;
    }

    setSkills(skillsArray) {
        this.skills = skillsArray;
        return this;
    }

    condition(client) {
        return chance.bool({likelihood: this.chance});
    }

    onAttack(attack, client) {
        client.setBodyPart(chance.pickone(this.skills));
        return attack;
    }
}

class BattleClientTypeEdger extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypeEdger}
     */
    constructor() {
        super("Edger", "Edger", "rgb(255,116,116)");
        this.setDescription("This client loses excitement quicker the closer they are to cumming.")
        return this;
    }

    condition(client) {
        return client.cum > 50;
    }

    update(attack, client) {
        if (client.cum > 80) {
            attack.excitementTweenScale = attack.excitementTweenScale + 3;
        } else {
            attack.excitementTweenScale = attack.excitementTweenScale + 2;
        }
        return attack;
    }
}

class BattleClientTypeBigCock extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypeBigCock}
     */
    constructor() {
        super("BigCock", "Big Cock", "rgb(150,185,255)");
        this.setDescription("This client takes more stamina to please the more excited they are.")
        return this;
    }

    condition(client) {
        return client.excitement > 50;
    }

    update(attack, client) {
        attack.damageScale = attack.damageScale + 1;
        return attack;
    }
}

class BattleClientTypeSummoner extends BattleClientType {
    /**
     * @constructor
     * @param clientArray
     * @param summonChance
     * @returns {BattleClientTypeSummoner}
     */
    constructor(clientArray, summonChance) {
        super("Summoner", "Summoner", "rgb(255,98,239)");
        this.setDescription("This client has a chance to summon another client when a girl is selected.")
        this.clientArray = clientArray || [];
        this.summonChance = summonChance || 5;
        return this;
    }

    addClient(client) {
        this.clientArray.push(client);
        return this;
    }

    condition(client) {
        return chance.bool({likelihood: this.summonChance});
    }

    onAttack(attack, client) {
        let pop = this.clientArray.pop();
        if (pop) {
            GAME.battle.currentBattle.addClient(pop)
        }
        return attack;
    }
}

class BattleClientTypeMudder extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypeMudder}
     */
    constructor() {
        super("Mudder", "Mudder", "rgb(134,68,41)");
        this.setDescription("This client adds stacks of mud to girls when fucked. Mud slows down the client's excitement and cum meter.");
        this.mudStack = 0;
        return this;
    }

    condition() {
        return true;
    }

    onAttack(attack, client) {
        this.mudStack += 2;
        let effect = new BattleEffectMud(this.mudStack);
        effect.onComplete = (client) => {
            this.mudStack = 0;
        }
        GAME.battle.currentBattle.effectGirl(client.getGirl().getID(), effect);

        return attack;
    }
}

class BattleClientTypeLactater extends BattleClientType {
    /**
     * @constructor
     * @param lactateChance
     * @returns {BattleClientTypeLactater}
     */
    constructor(lactateChance) {
        super("Lactater", "Lactater", "rgb(255,255,255)");
        this.setDescription("This client has a chance to make the girl lactate, causing the girl to lose more stamina.");
        this.lactateChance = lactateChance || 10;
        return this;
    }

    condition(client) {
        if (client.getGirl() !== false) {
            if (GAME.battle.currentBattle.isEffected(client.getGirl().getID())) {
                return false;
            } else {
                return chance.bool({likelihood: this.lactateChance});
            }
        } else {
            return false;
        }
    }

    onAttack(attack, client) {
        let effect = new BattleEffectLactate(client.getGirl().getID(), 10000);

        GAME.battle.currentBattle.effectGirl(client.getGirl().getID(), effect);

        return attack;
    }
}

class BattleClientTypeBreaker extends BattleClientType {
    /**
     * @constructor
     * @param inflictChance
     * @param breakChance
     * @param damage
     * @returns {BattleClientTypeBreaker}
     */
    constructor(inflictChance, breakChance, damage) {
        super("Breaker", "Breaker", "rgb(255,0,0)");
        this.setDescription("This client has a chance to inflict 'Break', causing a chance for the girl's to stop fucking the client.");
        this.breakChance = breakChance || 50;
        this.inflictChance = inflictChance || 25;
        this.damage = damage || 0.4;
        return this;
    }

    condition(client) {
        if (client.getGirl() !== false) {
            if (GAME.battle.currentBattle.isEffected(client.getGirl().getID())) {
                let effect = GAME.battle.currentBattle.getEffect(client.getGirl().getID())
                if (effect.getID() === "Break") {
                    return chance.bool({likelihood: this.breakChance});
                } else {
                    return false;
                }
            } else {
                return chance.bool({likelihood: this.inflictChance});
            }
        } else {
            return false;
        }
    }

    onAttack(attack, client) {
        if (GAME.battle.currentBattle.isEffected(client.getGirl().getID())) {
            client.getGirl().loseStamina(this.damage);
            GAME.battle.currentBattle.removeEffect(client.getGirl().getID());
            GAME.battle.currentBattle.stopFuckingClient(client);

        } else {
            let effect = new BattleEffectBreak();

            GAME.battle.currentBattle.effectGirl(client.getGirl().getID(), effect);
        }


        return attack;
    }
}

class BattleClientTypeSubmissive extends BattleClientType {
    /**
     * @constructor
     * @returns {BattleClientTypeSubmissive}
     */
    constructor() {
        super("Submissive", "Submissive", "rgb(186,238,234)");
        this.setDescription("This client is submissive. Fucking him will raise your stamina.");
        this.timesFucked = 0;
        return this;
    }

    condition() {
        return true;
    }

    onAttack(attack, client) {
        attack.damageScale -= 0.5;
        client.getGirl().gainStamina(0.2, false);
        this.timesFucked += 1;

        return attack;
    }

    update(attack) {
        attack.cumTweenScale += this.timesFucked * 0.5;
        return attack;
    }
}

class BattleClientTypeSubordinate extends BattleClientType {
    /**
     * @constructor
     * @param [levelDecrease=10] - How many levels to decrease once client becomes submissive
     * @returns {BattleClientTypeSubordinate}
     */
    constructor(levelDecrease) {
        super("Subordinate", "Subordinate", "rgb(255,204,150)");
        this.setDescription("This client will become submissive and have their level reduced if you fuck them rapidly.");
        this.timesFucked = 1;
        this.timer = false;
        this.levelDecrease = levelDecrease || 10;
        return this;
    }

    condition() {
        return true;
    }

    onAttack(attack, client) {
        if (!this.timer) {
            this.timer = game.scene.getScene('BattleScene').time.addEvent({
                delay: 3000,
                callback: () => {
                    this.timesFucked = 1;
                    this.timer = false;
                }
            })
        }
        this.timesFucked += 1;
        return attack;
    }

    update(attack, client) {
        if (this.timesFucked >= 5 && !client.getAllTypes().some((element) => element.id === "Submissive")) {
            let newLevel = client.getLevel() - this.levelDecrease;
            if (newLevel <= 0) {
                newLevel = 1;
            }
            client.setLevel(newLevel);
            client.addType(new BattleClientTypeSubmissive())
            client.removeType('Subordinate')
        }
        return attack;
    }
}

class BattleClient {
    /**
     * @constructor
     * @param {string} name
     * @param {number} level
     * @param {Array<BattleClientType>|BattleClientType} types
     * @param {GirlManager.bodyPart} [bodyPart]
     * @param {number} [timeToCum]
     * @param {string} [thumbnail]
     * @returns {BattleClient}
     */
    constructor(name, level, types, bodyPart, timeToCum, thumbnail) {
        this.bodyPart = bodyPart || chance.pickone(skills);

        this.GUID = chance.guid();
        this._TYPES = [];
        this.name = name || "";
        this.finished = false;
        this.level = level || 1;
        this.gold = 0;
        this.cum = 0;
        this.excitement = 0;
        this.animation = 'nullImage';
        this.girl = false;
        this.lastGirl = false;
        this.thumbnail = thumbnail || "ClientBorder";

        this.level = level || 1;
        this.damageScale = 1;

        this.timeToCum = timeToCum || 20000;
        this.cumTweenScale = 1;

        this.cumDownTweenScale = 1;

        this.excitementTime = 20000;
        this.excitementTweenScale = 1;

        if (types) {
            this._TYPES = types;
        } else {
            this._TYPES.push(new BattleClientTypePassive());
        }

        // Default scales for attacking
        this.attack = {
            cumTweenScale: 1,
            cumDownTweenScale: 1,
            excitementTweenScale: 1,
            damageScale: 1
        }

        return this;
    }

    /**
     * @method startCumTween
     * @memberOf BattleClient
     * @instance
     */
    startCumTween() {
        this.stopCumTween();
        let duration = this.timeToCum - (this.timeToCum * (this.cum / 100))
        this.cumTween = game.scene.getScene('BattleScene').tweens.add({
            targets: this,
            cum: 100,
            ease: 'Linear',
            duration: duration,
            onComplete: () => {
                this.clientCum();
            },
            paused: false
        })
        this.setCumTweenScale(this.cumTweenScale);
        this.cumTween.on(Phaser.Tweens.Events.TWEEN_UPDATE, () => {
            if (this.getGirl() === false) {
                let slowDown = this.cumTweenScale - 0.5;
                if (slowDown <= 0) {
                    slowDown = 0.1;
                }
                this.cumTween.setTimeScale(slowDown);
            }
        });
    }

    /**
     * @method stopCumTween
     * @memberOf BattleClient
     * @instance
     */
    stopCumTween() {
        if (this.cumTween) {
            this.cumTween.stop();
        }
    }

    /**
     * @method startCumDownTween
     * @memberOf BattleClient
     * @instance
     */
    startCumDownTween() {
        this.stopCumDownTween();
        this.stopCumTween();
        this.setAnimation('nullImage');
        let duration = ((this.timeToCum * 1.5) * (this.cum / 100))
        this.cumDownTween = game.scene.getScene('BattleScene').tweens.add({
            targets: this,
            cum: 0,
            ease: 'Sine.easeIn',
            duration: duration,
            paused: false
        });
        this.setCumDownTweenScale(this.cumDownTweenScale);
    }

    /**
     * @method stopCumDownTween
     * @memberOf BattleClient
     * @instance
     */
    stopCumDownTween() {
        if (this.cumDownTween) {
            this.cumDownTween.stop();
        }
    }

    /**
     * @method startExcitementTween
     * @memberOf BattleClient
     * @instance
     */
    startExcitementTween() {
        this.stopExcitementTween();
        this.stopCumDownTween();
        this.startCumTween();
        let duration = this.excitementTime * (this.excitement / 100)
        this.excitementTween = game.scene.getScene('BattleScene').tweens.add({
            targets: this,
            excitement: 0,
            ease: 'Sine.easeInOut',
            duration: duration,
            paused: false,
            onComplete: () => {
                this.startCumDownTween();
            }
        });
        this.setExcitementTweenScale(this.excitementTweenScale);
        this.excitementTween.on(Phaser.Tweens.Events.TWEEN_UPDATE, () => {
            if (this.getGirl() === false) {
                this.excitementTween.setTimeScale(this.excitementTweenScale + 2);
            } else {
                this.getAttack();
            }
        });
    }

    /**
     * @method stopExcitementTween
     * @memberOf BattleClient
     * @instance
     */
    stopExcitementTween() {
        if (this.excitementTween) {
            this.excitementTween.stop();
        }
    }

    /**
     * @method pushExcitement
     * @memberOf BattleClient
     * @instance
     */
    pushExcitement(amount) {
        amount = amount || 30;
        this.excitement += amount;
        if (this.excitement > 100) {
            this.excitement = 100;
        }
        if (this.excitement < 0) {
            this.excitement = 0;
        }

        if (this.excitement > 0) {
            this.startExcitementTween();
        }
    }

    /**
     * @method setCumDownTweenScale
     * @memberOf BattleClient
     * @instance
     * @param {number} scale
     * @returns BattleClient
     */
    setCumDownTweenScale(scale) {
        if (scale < 0.1) {
            scale = 0.1;
        }
        this.cumDownTweenScale = scale;
        if (this.cumDownTween) {
            this.cumDownTween.setTimeScale(scale);
        }
        return this;
    }

    /**
     * @method setCumTweenScale
     * @memberOf BattleClient
     * @instance
     * @param {number} scale
     * @returns BattleClient
     */
    setCumTweenScale(scale) {
        if (scale < 0.1) {
            scale = 0.1;
        }
        this.cumTweenScale = scale;
        if (this.cumTween) {
            this.cumTween.setTimeScale(scale);
        }
        return this;
    }

    /**
     * @method setExcitementTweenScale
     * @memberOf BattleClient
     * @instance
     * @param {number} scale
     * @returns BattleClient
     */
    setExcitementTweenScale(scale) {
        if (scale < 0.1) {
            scale = 0.1;
        }
        this.excitementTweenScale = scale;
        if (this.excitementTween) {
            this.excitementTween.setTimeScale(scale);
        }
        return this;
    }

    /**
     * @method getTimeToCum
     * @memberOf BattleClient
     * @instance
     * @returns {number}
     */
    getTimeToCum() {
        return this.timeToCum;
    }

    /**
     * @method setTimeToCum
     * @memberOf BattleClient
     * @instance
     * @returns {BattleClient}
     */
    setTimeToCum(timeToCum) {
        this.timeToCum = timeToCum;
        return this;
    }

    /**
     * @method setDamageScale
     * @memberOf BattleClient
     * @instance
     * @param {number} scale
     * @returns {BattleClient}
     */
    setDamageScale(scale) {
        if (scale < 0.1) {
            scale = 0.1;
        }
        this.damageScale = scale;
        return this;
    }

    /**
     * @method fuck
     * @memberOf BattleClient
     * @instance
     * @param {string} girlID
     * @returns {BattleClient}
     */
    fuck(girlID) {
        if (this.getGirl() !== false) {
            if (this.getGirl().getID() === girlID) {
                this.pushExcitement(30);
            } else {
                this.setGirl(girlID);
                this.setLastGirl(girlID);
                if (this.getExcitement() <= 0) {
                    this.pushExcitement(20);
                } else {
                    this.pushExcitement(-10);
                }
            }
        } else if (this.getGirl() === false && this.getLastGirl() !== false) {
            if (this.getLastGirl().getID() === girlID) {
                this.setGirl(girlID);
                this.setLastGirl(girlID);
                this.pushExcitement(30);
            } else {
                this.setGirl(girlID);
                this.setLastGirl(girlID);
                if (this.getExcitement() <= 0) {
                    this.pushExcitement(20);
                } else {
                    this.pushExcitement(-10);
                }
                globalEvents.emit('startFuckingClient', this.GUID);
            }
        } else {
            this.setGirl(girlID);
            this.setLastGirl(girlID);
            this.pushExcitement(40);
            globalEvents.emit('startFuckingClient', this.GUID);
        }

        globalEvents.emit('clientAttack', this.GUID);
        return this;
    }

    /**
     * @method stopFucking
     * @memberOf BattleClient
     * @instance
     * @returns {BattleClient}
     */
    stopFucking() {
        this.setGirl(false);
        this.setAnimation('nullImage');

        if (this.getFinished() === false) {
            this.pushExcitement(-10);
        }

        globalEvents.emit('stopFuckingClient', this.GUID);
        return this;
    }

    destroy() {
        this.stopCumTween();
        this.stopCumDownTween();
        this.stopExcitementTween();
        return this;
    }

    clientCum() {
        this.destroy();
        this.finished = true;
        if (this.getGirl()) {
            if (GAME.battle.currentBattle.numActiveClients() > 0 && chance.bool({likelihood: 20})) {
                GAME.QBsound.playUnique(this.getGirl().getID(), this.getBodyPart());
            }

            if (GAME.battle.currentBattle.isTrapped(this.getGirl().getID())) {
                GAME.battle.currentBattle.removeTrap(this.getGirl().getID());
            }

            if (this.getExcitement() > 0) {
                let clientExcitement = (Math.round(this.getExcitement() / 3) / 100)
                this.getGirl().gainStamina(1 + clientExcitement, false);
            } else {
                this.getGirl().gainStamina(1, false);
            }

            this.getGirl().cumOn(this.getBodyPart(), 1);
            this.getGirl().fuckGuys(1);
        }
        if (this.getGold(this.getLastGirl().getID()) > 0) {
            GAME.addGold(this.getGold(this.getLastGirl().getID()));
        }

        this.setAnimation('nullImage');
        globalEvents.emit('clientCum', this.GUID);
        return this;
    }

    getAttack(attackOnly) {
        attackOnly = attackOnly || false;

        let attack = {
            cumTweenScale: this.attack.cumTweenScale,
            cumDownTweenScale: this.attack.cumDownTweenScale,
            excitementTweenScale: this.attack.excitementTweenScale,
            damageScale: this.attack.damageScale
        }

        let types = this.getAllTypes();

        for (let type of types) {
            if (type.condition(this) === true) {
                if (attackOnly) {
                    attack = type.onAttack(attack, this);
                } else {
                    attack = type.update(attack, this);
                }
            }
        }

        if (this.getGirl() !== false) {
            let girlLevel = this.getGirl().getStat(this.getBodyPart());
            attack.excitementTweenScale = attack.excitementTweenScale - GAME.Sigmoid(girlLevel, this.getLevel(), -8, 6)
            let cumTweenSigmoid = GAME.Sigmoid(girlLevel, this.getLevel(), -8, 6);
            if (cumTweenSigmoid > 0.15) {
                attack.cumTweenScale = attack.cumTweenScale + cumTweenSigmoid;
            }

            if (GAME.battle.currentBattle.isTrapped(this.getGirl().getID())) {
                attack = GAME.battle.currentBattle.getTrap(this.getGirl().getID()).update(attack, this);
            }

            if (GAME.battle.currentBattle.isEffected(this.getGirl().getID())) {
                attack = GAME.battle.currentBattle.getEffect(this.getGirl().getID()).update(attack, this);
            }

            if (GAME.battle.currentBattle.isUltimating(this.getGirl().getID())) {
                attack = GAME.battle.currentBattle.getUltimate(this.getGirl().getID()).update(attack, this);
            }
            this.setAnimation(this.getGirl().getID() + this.getBodyPart() + "default");
        }

        this.updateTweens(attack);

        return attack;
    }

    updateTweens(attack) {
        this.setCumTweenScale(attack.cumTweenScale);
        this.setCumDownTweenScale(attack.cumDownTweenScale);
        this.setExcitementTweenScale(attack.excitementTweenScale);
        this.setDamageScale(attack.damageScale);
    }

    getThumbnail() {
        return this.thumbnail;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    /**
     * @method getGirl
     * @memberOf BattleClient
     * @instance
     * @returns {boolean|Girl}
     */
    getGirl() {
        if (this.girl !== false) {
            return GAME.girl.getGirl(this.girl);
        } else {
            return false;
        }
    }

    getLastGirl() {
        if (this.lastGirl !== false) {
            return GAME.girl.getGirl(this.lastGirl);
        } else {
            return false;
        }
    }

    setGirl(girlID) {
        this.girl = girlID;
        return this;
    }

    setLastGirl(girlID) {
        this.lastGirl = girlID;
        return this;
    }

    addType(type) {
        this._TYPES.push(type);

        globalEvents.emit("addType", this.GUID, type.getID());

        return this;
    }

    removeType(typeID) {
        let index = this._TYPES.findIndex((element) => element.id === typeID);

        if (index !== -1) {
            Phaser.Utils.Array.RemoveAt(this._TYPES, index);
            globalEvents.emit("removeType", this.GUID, typeID);
        } else {
            console.warn(typeID + " not found in array");
        }

        return this;
    }

    getAllTypes() {
        return this._TYPES;
    }

    getType(typeID) {
        return this._TYPES.find((element) => element.id === typeID);
    }

    /**
     * @method
     * @memberOf BattleClient
     * @instance
     * @param {string} name
     * @returns {BattleClient}
     */
    setName(name) {
        this.name = name;

        return this;
    }

    /**
     * @method getID
     * @memberOf BattleClient
     * @instance
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @method setLevel
     * @memberOf BattleClient
     * @instance
     * @param {number} number
     * @returns {BattleClient}
     */
    setLevel(number) {
        this.level = number;

        return this;
    }

    /**
     * @method getLevel
     * @memberOf BattleClient
     * @instance
     * @returns {number}
     */
    getLevel() {
        return this.level;
    }

    /**
     * @method setGold
     * @memberOf BattleClient
     * @instance
     * @param {number} number
     * @returns {BattleClient}
     */
    setGold(number) {
        this.gold = number;

        return this;
    }

    /**
     * @method getGold
     * @memberOf BattleClient
     * @instance
     * @param {string} girl
     * @returns {number}
     */
    getGold(girl) {
        girl = girl || false;
        let gold = this.gold;

        if (girl !== false) {
            let morals = GAME.girl.getGirl(girl).getMorals();

            if (morals > 0) {
                gold = gold + (gold * (Math.abs(morals) / 5))
            }
        }

        return Math.ceil(gold);
    }

    /**
     * @method getExp
     * @memberOf BattleClient
     * @instance
     * @param {string} girl
     * @returns {number}
     */
    getExp(girl) {
        let girlLevel = GAME.girl.getGirl(girl).getStat(this.getBodyPart());
        let morals = GAME.girl.getGirl(girl).getMorals();

        let baseEXP = Math.ceil(10 - (10 * GAME.Sigmoid(girlLevel, this.getLevel())));

        if (morals < 0) {
            baseEXP = baseEXP + (baseEXP * (Math.abs(morals) / 5));
        }

        return Math.ceil(baseEXP);
    }

    /**
     * @method setCum
     * @memberOf BattleClient
     * @instance
     * @param {number} number
     * @returns {number}
     */
    setCum(number) {
        this.cum = number;

        return this.cum;
    }

    /**
     * @method getCum
     * @memberOf BattleClient
     * @instance
     * @returns {number}
     */
    getCum() {
        return this.cum;
    }

    getExcitement() {
        return this.excitement;
    }

    /**
     * @method setFinished
     * @memberOf BattleClient
     * @instance
     * @param {boolean} boolean
     * @returns {BattleClient}
     */
    setFinished(boolean) {
        this.finished = boolean;

        return this;
    }

    /**
     * @method getFinished
     * @memberOf BattleClient
     * @instance
     * @returns {boolean}
     */
    getFinished() {
        return this.finished;
    }

    /**
     * @method setAnimation
     * @memberOf BattleClient
     * @instance
     * @param {string} animationID
     * @returns {BattleClient}
     */
    setAnimation(animationID) {
        animationID = animationID || "nullImage";

        this.animation = animationID;

        return this;
    }

    /**
     * @method getAnimation
     * @memberOf BattleClient
     * @instance
     * @returns {string}
     */
    getAnimation() {
        return this.animation;
    }

    /**
     * Automatically calculates the animation's fps using the client's attack tween scale
     * @method getAnimationFPS
     * @memberOf BattleClient
     * @instance
     * @returns {number}
     */
    getAnimationFPS() {
        let fps = 24;
        let excitement = this.getExcitement();
        if (excitement > 0 && excitement <= 70) {
            fps = 24;
        } else if (excitement > 70 && excitement <= 100) {
            fps = 36;
        }
        if (this.getAnimation() === 'nullImage') {
            fps = 1;
        }
        return fps;
    }

    getBodyPart() {
        return this.bodyPart;
    }

    setBodyPart(bodyPart) {
        this.bodyPart = bodyPart;
        globalEvents.emit('updateClients');

        return this;
    }
}