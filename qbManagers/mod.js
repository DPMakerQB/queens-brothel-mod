/**
 * config.json should be in the root folder of your .zip file
 * @typedef {object} config
 * @property {string} id - id of your mod
 * @property {string} name - name of your mod
 * @property {string} description - description of your mod
 * @property {string} version - version of your mod
 * @property {string} compatible - what minimum version of Queen's Brothel does this mod need
 * @example
 * {
 *     "id": "modID",
 *     "name": "My mod",
 *     "description": "A description of my mod.",
 *     "version": "1.0.0",
 *     "compatible": "0.8.2"
 * }
 */

/**
 * The mod class will let you handle everything you need to do.
 * @class Mod
 * @param {string} id
 */
class Mod {
    constructor(id) {
        this.id = id;
        this.name = id;
        this.silent = false;
        this.assets = [];
        MODS[id] = this;

        /**
         * @name Mod#menu
         * @type {MenuManager}
         */
        this.menu = Gameplay.prototype.menu;
        /**
         * @name Mod#quest
         * @type {QuestManager}
         */
        this.quest = Gameplay.prototype.quest;
        /**
         * @name Mod#girl
         * @type {GirlManager}
         */
        this.girl = Gameplay.prototype.girl;
        /**
         * @name Mod#dialogue
         * @type {DialogueManager}
         */
        this.dialogue = Gameplay.prototype.dialogue;
        /**
         * @name Mod#map
         * @type {MapManager}
         */
        this.map = Gameplay.prototype.map;
        /**
         * @name Mod#clothes
         * @type {ClothesManager}
         */
        this.clothes = Gameplay.prototype.clothes;
        /**
         * @name Mod#animation
         * @type {AnimationManager}
         */
        this.animation = Gameplay.prototype.animation;
        /**
         * @name Mod#battle
         * @type {BattleManager}
         */
        this.battle = Gameplay.prototype.battle;
        /**
         * @name Mod#boss
         * @type {BossManager}
         */
        this.boss = Gameplay.prototype.boss;
        /**
         * @name Mod#QBsound
         * @type {SoundManager}
         */
        this.QBsound = Gameplay.prototype.sound;
        /**
         * @name Mod#BattleClient
         * @type {BattleClient}
         */
        this.BattleClient = BattleClient;
        /**
         * @name Mod#Battle
         * @type {Battle}
         */
        this.Battle = Battle;

        /**
         * Fades the game to black and then returns back to game back to normal and resolves the Promise at the same time
         * @method fade
         * @memberOf Mod
         * @instance
         * @param {number} [delay=1000]
         * @returns Promise
         * @example
         * myMod.fade().then(() => {console.log("After done fading.");});
         */
        this.fade = Gameplay.prototype.fade;

        /**
         * Flashes the screen and returns back to normal
         * @method cumFlash
         * @memberOf Mod
         * @instance
         */
        this.cumFlash = Gameplay.prototype.cumFlash;

        /**
         * Returns the amount of gold the player has
         * @method getGold
         * @memberOf Mod
         * @instance
         * @returns {number}
         */
        this.getGold = Gameplay.prototype.getGold;

        /**
         * Gives gold to the player
         * @method addGold
         * @memberOf Mod
         * @instance
         * @param {number} amount
         * @example
         * myMod.addGold(1000);
         */
        this.addGold = Gameplay.prototype.addGold;

        /**
         * Removes gold from the player
         * @method removeGold
         * @memberOf Mod
         * @instance
         * @param {number} amount
         * @example
         * myMod.removeGold(1000);
         */
        this.removeGold = Gameplay.prototype.removeGold;

        /**
         * Saves the game
         * @method save
         * @memberOf Mod
         * @instance
         */
        this.save = Gameplay.prototype.save;

        /**
         * Displays a notification pop-up in the top left corner of the game and also puts it in the notifications menu
         * @method notify
         * @memberOf Mod
         * @instance
         * @param {string} text - The text to send to the notifications
         * @example
         * myMod.notify("Hello!");
         */
        this.notify = Gameplay.prototype.notify;

        /**
         * Returns the current day as a number
         * @method getDay
         * @memberOf Mod
         * @instance
         * @returns {number}
         */
        this.getDay = Gameplay.prototype.getDay;

        /**
         * A Sigmoid function
         * @method Sigmoid
         * @memberOf Mod
         * @instance
         * @param {number} skill
         * @param {number} difficulty
         * @param {number} [steepness=-10]
         * @param {number} [offset=5]
         * @returns {number}
         */
        this.Sigmoid = Gameplay.prototype.Sigmoid;
    }

    /**
     * @method setName
     * @memberOf Mod
     * @instance
     * @param {string} name
     * @returns {Mod}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * @method
     * @memberOf Mod
     * @instance
     * @returns {String}
     */
    getName() {
        return this.name;
    }

    /**
     * This method is called when the mods are done loading the player is ready to play
     * @method boot
     * @memberOf Mod
     * @instance
     */
    boot() {

    }

    /**
     * This method is called after a save file is selected and before {@link Mod#boot}. It should be used to create any quests/clothes/stuff needed to initialize the mod
     * @method init
     * @memberOf Mod
     * @instance
     */
    init() {

    }

    /**
     * This method is called whenever the player goes to sleep. It is called after the game's default newDay function
     * @method newDay
     * @memberOf Mod
     * @instance
     */
    newDay() {

    }

    /**
     * Returns the given mod's class
     * @method getOtherMod
     * @memberOf Mod
     * @instance
     * @param {string} modID
     * @return {*}
     */
    getOtherMod(modID) {
        if (MODS.hasOwnProperty(modID)) {
            return MODS[modID];
        } else {
            throw "Mod " + modID + " is not booted or does not exist."
        }
    }

    /**
     * Loads an image
     * @method loadImage
     * @memberOf Mod
     * @instance
     * @param {string} key
     * @param {string} location
     * @example
     * let myMod = new Mod("MyMod");
     * myMod.loadImage("myImage", "assets/myImage.png");
     */
    loadImage(key, location) {
        this.assets.push({
            key: key,
            location: location
        })
    }
}