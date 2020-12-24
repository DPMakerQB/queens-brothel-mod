class Clothes {
    /**
     * @constructor
     * @param {string} id
     * @param {string} girl
     * @param {boolean} [unlockedByDefault=false]
     * @property {string} id
     * @property {string} face
     * @property {string} body
     * @property {boolean} visible
     * @property {Girl} Girl
     * @property {string} name
     * @property {string} description
     * @property {number} level
     * @property {boolean} shop
     * @property {number} cost
     * @property {object} stats
     * @property {object<ClothesStyle>} styles
     * @returns {Clothes}
     * @example
     * let myClothes = new Clothes('myClothes','Queen')
     *      .setVisible(true)
     *      .setName("My Clothes")
     *      .setDescription("These are my mod's clothes")
     *      .setLevel(15)
     *      .setShop(true)
     *      .setCost(3000)
     *      .setStat("Throat", 2)
     *      .setStat("Pussy", 1);
     *
     * // Visible condition example
     * // These clothes will be visible in the shop if Queen is above level 10
     * let myClothes = new Clothes('myClothes2','Queen')
     *      .setVisible(() =>{
     *          return myMod.girl.Queen.getLevel() > 10;
     *      })
     */
    constructor(id, girl, unlockedByDefault) {
        this.id = id;
        this.unlockedByDefault = unlockedByDefault || false;
        this.styles = {};

        this.face = "Default";
        this.body = "Default";
        this.visible = this.unlockedByDefault || false;
        this.Girl = GAME.girl.getGirl(girl);
        this.name = "";
        this.description = "";
        this.level = 0;
        this.shop = false;
        this.cost = 0;
        this.stats = {
            Stamina: 0,
            Recovery: 0,
            Throat: 0,
            Tits: 0,
            Pussy: 0,
            Anal: 0
        };
        this.layerID = false;

        this.addStyle(new ClothesStyle(false, "Default", true));

        return this;
    }

    /**
     * @method setID
     * @memberOf Clothes
     * @instance
     * @param {string} id
     * @returns {Clothes}
     */
    setID(id) {
        this.id = id;
        return this;
    }

    /**
     * @method getID
     * @memberOf Clothes
     * @instance
     * @returns {string}
     */
    getID() {
        return this.id;
    }

    /**
     * @method setLayerID
     * @memberOf Clothes
     * @instance
     * @param {string} id
     * @returns {Clothes}
     */
    setLayerID(id) {
        this.layerID = id;
        return this;
    }

    /**
     * @method getLayerID
     * @memberOf Clothes
     * @instance
     * @returns {boolean|string}
     */
    getLayerID() {
        return this.layerID;
    }

    /**
     * @method isUnlocked
     * @memberOf Clothes
     * @instance
     * @returns {boolean}
     */
    isUnlocked() {
        return gameData.clothes[this.id].Unlocked;
    }

    /**
     * @method unlock
     * @memberOf Clothes
     * @instance
     * @returns {Clothes}
     */
    unlock() {
        gameData.clothes[this.id].Unlocked = true;
        return this;
    }

    /**
     * @method buy
     * @memberOf Clothes
     * @instance
     * @return {Clothes}
     */
    buy() {
        if (this.isUnlocked() === false) {
            GAME.removeGold(this.getCost());
            this.unlock();
            globalEvents.emit('refreshClothes');
        }

        return this;
    }

    /**
     * @method addStyle
     * @member Clothes
     * @instance
     * @param {ClothesStyle} style
     * @returns {Clothes}
     */
    addStyle(style) {
        this.styles[style.id] = style;
        return this;
    }

    /**
     * @method removeStyle
     * @memberOf Clothes
     * @instance
     * @param {string} styleID
     */
    removeStyle(styleID) {
        delete this.styles[styleID];
    }

    /**
     * @method getStyle
     * @memberOf Clothes
     * @instance
     * @param {string} styleID
     * @returns {ClothesStyle}
     */
    getStyle(styleID) {
        return this.styles[styleID];
    }

    /**
     * @method getAllStyles
     * @memberOf Clothes
     * @instance
     * @param {boolean} [visible=true]
     * @returns {object}
     */
    getAllStyles(visible) {
        if (visible === undefined) {
            visible = true;
        }

        if (visible === true) {
            let array = [];

            for (let style in this.styles) {
                if (this.styles[style].isVisible()) {
                    array.push(style);
                }
            }

            return array;
        } else {
            return this.styles;
        }
    }

    /**
     * @method setStyle
     * @memberOf Clothes
     * @instance
     * @param {string|boolean} styleID
     * @returns {Clothes}
     */
    setStyle(styleID) {
        gameData.clothes[this.id].Style = styleID;
        globalEvents.emit('refreshGirls');
        return this;
    }

    /**
     * @method getPlayerStyle
     * @memberOf Clothes
     * @instance
     * @returns {string|boolean}
     */
    getPlayerStyle() {
        let styleID = gameData.clothes[this.id].Style;
        if (styleID === false) {
            return false;
        } else if (this.getStyle(styleID)) {
            return this.getStyle(styleID).id;
        } else {
            this.setStyle(false);
            return false;
        }
    }

    /**
     * @method setFace
     * @memberOf Clothes
     * @instance
     * @param {string} key
     * @returns {Clothes}
     */
    setFace(key) {
        this.face = key;
        return this;
    }

    /**
     * @method getFace
     * @memberOf Clothes
     * @instance
     * @returns {string}
     */
    getFace() {
        return this.face;
    }

    /**
     * @method setBody
     * @memberOf Clothes
     * @instance
     * @param {string} key
     * @returns {Clothes}
     */
    setBody(key) {
        this.body = key;
        return this;
    }

    /**
     * @method getBody
     * @memberOf Clothes
     * @instance
     * @returns {string}
     */
    getBody() {
        return this.body;
    }

    /**
     * @method setVisible
     * @memberOf Clothes
     * @instance
     * @param condition
     * @returns {Clothes}
     */
    setVisible(condition) {
        this.visible = condition;
        return this;
    }

    /**
     * @method isVisible
     * @memberOf Clothes
     * @instance
     * @returns {boolean}
     */
    isVisible() {
        if (typeof this.visible === "boolean") {
            return this.visible;
        } else if (typeof this.visible === "function") {
            return this.visible();
        } else {
            return false;
        }
    }

    /**
     * @method setGirl
     * @memberOf Clothes
     * @instance
     * @param {string} girl
     * @returns {Clothes}
     */
    setGirl(girl) {
        this.Girl = GAME.girl.getGirl(girl);
        return this;
    }

    /**
     * @method getGirl
     * @memberOf Clothes
     * @instance
     * @returns {Girl}
     */
    getGirl() {
        return this.Girl;
    }

    /**
     * @method setName
     * @memberOf Clothes
     * @instance
     * @param {string} name
     * @returns {Clothes}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    getName() {
        return this.name;
    }

    /**
     * @method setDescription
     * @memberOf Clothes
     * @instance
     * @param {string} text
     * @returns {Clothes}
     */
    setDescription(text) {
        this.description = text;
        return this;
    }

    /**
     * @method getDescription
     * @memberOf Clothes
     * @instance
     * @returns {string}
     */
    getDescription() {
        return this.description;
    }

    /**
     * @method setLevel
     * @memberOf Clothes
     * @instance
     * @param {number} number
     * @returns {Clothes}
     */
    setLevel(number) {
        this.level = number;
        return this;
    }

    /**
     * @method getLevel
     * @memberOf Clothes
     * @instance
     * @returns {number}
     */
    getLevel() {
        return this.level;
    }

    /**
     * @method setShop
     * @memberOf Clothes
     * @instance
     * @param {boolean} boolean
     * @returns {Clothes}
     */
    setShop(boolean) {
        this.shop = boolean;
        return this;
    }

    /**
     * @method getShop
     * @memberOf Clothes
     * @instance
     * @returns {boolean}
     */
    getShop() {
        return this.shop;
    }

    /**
     * @method setCost
     * @memberOf Clothes
     * @param {number} amount
     * @returns {Clothes}
     */
    setCost(amount) {
        this.cost = amount;
        return this;
    }

    /**
     * @method getCost
     * @memberOf Clothes
     * @returns {number}
     */
    getCost() {
        return this.cost;
    }

    /**
     * @method setStat
     * @memberOf Clothes
     * @instance
     * @param {string|object} skill
     * @param {number} [amount]
     * @returns {Clothes}
     */
    setStat(skill, amount) {
        if (typeof skill === "object") {
            for (let i in skill) {
                this.stats[i] = skill[i];
            }
        } else {
            this.stats[skill] = amount;
        }
        return this;
    }

    /**
     * @method getStats
     * @memberOf Clothes
     * @instance
     * @param {string} skill
     * @returns {object|number}
     */
    getStats(skill) {
        if (skill) {
            return this.stats[skill];
        } else {
            return this.stats;
        }
    }
}


class ClothesManager {
    /**
     * @constructor
     * @property {object<Clothes>} Clothes
     */
    constructor() {
        this.Clothes = {};
    }

    _initClothes() {
        // Queen
        this.add(new Clothes('WitchQueen', 'Queen', false))
            .setName("WitchQueen")
            .setBody('Witch')
            .setFace('Witch')
            .setDescription("")
            .setLevel(25)
            .setStat({Throat: 5, Tits: 5});
        this.add(new Clothes('DemonQueen', 'Queen', false))
            .setName("DemonQueen")
            .setDescription("")
            .setLevel(22)
            .setStat({Throat: 2, Tits: 2, Pussy: 3});
        this.add(new Clothes('OrcQueen', 'Queen', false))
            .setName("Orc")
            .setDescription("Clothes used during battle.")
            .setLevel(18)
            .setStat({Throat: 2, Pussy: 1, Anal: 4});
        this.add(new Clothes('PrincessQueen', 'Queen', false))
            .setName("Princess")
            .setDescription("A dress a princess would wear.")
            .setLevel(14)
            .setStat({Tits: 3, Pussy: 2});
        this.add(new Clothes('MudQueen', 'Queen', false))
            .setName('Mud')
            .setDescription('Not really clothes, just mud slathered onto her body.')
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2, Pussy: 2});
        this.add(new Clothes('ForestQueen', 'Queen', false))
            .setName('Greenhaven')
            .setDescription("The women of Greenhaven don't seem to wear much clothing.")
            .setLevel(6)
            .setStat({Throat: 1, Pussy: 1});
        this.add(new Clothes('SchoolgirlQueen', 'Queen', false))
            .setName('School Uniform')
            .setDescription("A uniform for school.")
            .setLevel(5)
            .setStat({Pussy: 2})
            .setShop(true)
            .setCost(200)
            .setVisible(true);
        this.add(new Clothes('DefaultQueen', 'Queen', true))
            .setLevel(0)
            .addStyle(new ClothesStyle('AlphaBlack', "Transparent Black", function () {
                return GAME.quest.isComplete('alphaBlack', 'Start');
            }));
        this.add(new Clothes('Halloween2020Queen', 'Queen', false))
            .setName('Halloween2020Queen')
            .setDescription('Halloween2020Queen')
            .setLevel(0)
            .setStat({Throat: 5});
        this.add(new Clothes('Valentines2020Queen', 'Queen', false)
            .setName('Lingerie')
            .setDescription('Valentines 2020 Event')
            .setLevel(20)
            .setStat({Throat: 1, Tits: 1, Pussy: 1, Anal: 1}))
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('mushroomQuest');
            });
        this.add(new Clothes('Halloween2019Queen', 'Queen', false))
            .setName('Succubus')
            .setDescription("Halloween 2019 Event")
            .setLevel(20)
            .setStat({Throat: 2, Tits: 2, Pussy: 2})
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('hornyBoris');
            });

        // Suki
        this.add(new Clothes('WitchSuki', 'Suki', false))
            .setName("WitchSuki")
            .setBody('Witch')
            .setFace('Witch')
            .setDescription("")
            .setLevel(25)
            .setStat({Throat: 1, Tits: 1, Pussy: 4, Anal: 4});
        this.add(new Clothes('DemonSuki', 'Suki', false))
            .setName("DemonSuki")
            .setDescription("Clothes to make Suki look like an elf.")
            .setLevel(22)
            .setStat({Throat: 4, Tits: 1, Pussy: 4});
        this.add(new Clothes('ElfSuki', 'Suki', false))
            .setName("Elf")
            .setBody('Elf')
            .setDescription("Clothes to make Suki look like an elf.")
            .setLevel(0);
        this.add(new Clothes('OrcSuki', 'Suki', false))
            .setName("Orc")
            .setDescription("Clothes used during battle.")
            .setLevel(18)
            .setStat({Throat: 2, Pussy: 1, Anal: 4});
        this.add(new Clothes('PrincessSuki', 'Suki', false))
            .setName("Princess")
            .setDescription("A dress a princess would wear.")
            .setLevel(14)
            .setStat({Tits: 3, Pussy: 2});
        this.add(new Clothes('SweaterSuki', 'Suki', false))
            .setName("Sweater")
            .setDescription("A sweater that doesn't cover much.")
            .setLevel(15)
            .setStat({Tits: 5})
            .setShop(true)
            .setCost(900)
            .setVisible(function () {
                return GAME.quest.isComplete('mushroomQuest');
            });
        this.add(new Clothes('MudSuki', 'Suki', false))
            .setName('Mud')
            .setDescription('Not really clothes, just mud slathered onto her body.')
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2, Pussy: 2});
        this.add(new Clothes('LeotardSuki', 'Suki', false))
            .setName('Leotard')
            .setDescription("Skin tight leotard. Careful, tears easily.")
            .setLevel(11)
            .setStat({Pussy: 2, Tits: 2})
            .setShop(true)
            .setCost(600)
            .setVisible(function () {
                return GAME.quest.isComplete('principalFeetQuest', 'Start');
            });
        this.add(new Clothes('ForestSuki', 'Suki', false))
            .setName('Greenhaven')
            .setDescription("The women of Greenhaven don't seem to wear much clothing.")
            .setLevel(6)
            .setStat({Throat: 1, Pussy: 1});
        this.add(new Clothes('GenieSuki', 'Suki', false))
            .setName('Genie')
            .setDescription("A cute genie outfit!")
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2})
            .setShop(true)
            .setCost(500)
            .setVisible(true);
        this.add(new Clothes('DefaultSuki', 'Suki', true))
            .setLevel(0)
            .setStat({Pussy: 3});
        this.add(new Clothes('SukibusSuki', 'Suki', false))
            .setLevel(0)
            .setFace('Sukibus')
            .setBody('Sukibus')
            .setLayerID('Sukibus')
            .setStat({Throat: 2, Tits: 2, Pussy: 6, Anal: 2});
        this.add(new Clothes('Halloween2020Suki', 'Suki', false))
            .setName('Halloween2020Suki')
            .setDescription('Halloween2020Suki')
            .setLevel(0)
            .setStat({Throat: 3, Tits: 2});
        this.add(new Clothes('Valentines2020Suki', 'Suki', false)
            .setName('Lingerie')
            .setDescription('Valentines 2020 Event')
            .setLevel(20)
            .setStat({Throat: 1, Tits: 1, Pussy: 1, Anal: 1}))
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('mushroomQuest');
            });
        this.add(new Clothes('Halloween2019Suki', 'Suki', false))
            .setName('Nurse')
            .setDescription("Halloween 2019 Event")
            .setLevel(20)
            .setStat({Throat: 2, Tits: 2})
            .setShop(true)
            .setCost(1000)
            .setFace('Halloween2019')
            .setVisible(() => {
                return GAME.quest.isComplete('hornyBoris');
            });


        // Esxea
        this.add(new Clothes('WitchEsxea', 'Esxea', false))
            .setName("WitchEsxea")
            .setBody('Witch')
            .setFace('Witch')
            .setDescription("")
            .setLevel(25)
            .setStat({Throat: 4, Tits: 4});
        this.add(new Clothes('DemonEsxea', 'Esxea', false))
            .setName("DemonEsxea")
            .setDescription("")
            .setLevel(22)
            .setStat({Throat: 2, Tits: 4, Pussy: 2});
        this.add(new Clothes('OrcEsxea', 'Esxea', false))
            .setName("Orc")
            .setDescription("Clothes used during battle.")
            .setLevel(18)
            .setStat({Throat: 2, Pussy: 1, Anal: 4});
        this.add(new Clothes('PrincessEsxea', 'Esxea', false))
            .setName("Princess")
            .setDescription("A dress a princess would wear.")
            .setLevel(14)
            .setStat({Tits: 3, Pussy: 2});
        this.add(new Clothes('MudEsxea', 'Esxea', false))
            .setName('Mud')
            .setDescription('Not really clothes, just mud slathered onto her body.')
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2, Pussy: 2});
        this.add(new Clothes('ForestEsxea', 'Esxea', false))
            .setName('Greenhaven')
            .setDescription("The women of Greenhaven don't seem to wear much clothing.")
            .setLevel(6)
            .setStat({Throat: 1, Pussy: 1});
        this.add(new Clothes('DefaultEsxea', 'Esxea', true))
            .setLevel(0)
            .setStat({Tits: 1, Pussy: 1});
        this.add(new Clothes('Halloween2020Esxea', 'Esxea', false))
            .setName('Halloween2020Esxea')
            .setDescription('Halloween2020Esxea')
            .setLevel(0)
            .setStat({Pussy: 3, Anal: 3});
        this.add(new Clothes('Valentines2020Esxea', 'Esxea', false)
            .setName('Lingerie')
            .setDescription('Valentines 2020 Event')
            .setLevel(20)
            .setStat({Throat: 1, Tits: 1, Pussy: 1, Anal: 1}))
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('mushroomQuest');
            });
        this.add(new Clothes('Halloween2019Esxea', 'Esxea', false))
            .setName('Super Hero')
            .setDescription("Halloween 2019 Event")
            .setLevel(20)
            .setStat({Throat: 2})
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('hornyBoris');
            });
        this.add(new Clothes('JanitorEsxea', 'Esxea', false)
            .setName('JanitorEsxea')
            .setDescription('')
            .setLevel(0)
            .setShop(false));

        // Scarlett
        this.add(new Clothes('WitchScarlett', 'Scarlett', false))
            .setName("WitchScarlett")
            .setBody('Witch')
            .setFace('Witch')
            .setDescription("")
            .setLevel(25)
            .setStat({Throat: 2, Tits: 6});
        this.add(new Clothes('DemonScarlett', 'Scarlett', false))
            .setName("DemonScarlett")
            .setDescription("")
            .setLevel(22)
            .setStat({Throat: 4, Pussy: 1, Anal: 4});
        this.add(new Clothes('OrcScarlett', 'Scarlett', false))
            .setName("Orc")
            .setDescription("Clothes used during battle.")
            .setLevel(18)
            .setStat({Throat: 2, Pussy: 1, Anal: 4});
        this.add(new Clothes('HucowScarlett', 'Scarlett', false))
            .setName("Hucow")
            .setDescription("An outfit made for a human cow.")
            .setLevel(17)
            .setStat({Tits: 7})
            .addStyle(new ClothesStyle('Harness', "Tit Harness", false))
            .addStyle(new ClothesStyle('NoTop', "No Top", false));
        this.add(new Clothes('RabbitDressScarlett', 'Scarlett', false))
            .setName("Seductive Dress")
            .setDescription("A dress to torment men with.")
            .setLevel(17)
            .setStat({Throat: 3, Tits: 3, Pussy: 3, Anal: 3});
        this.add(new Clothes('PrincessScarlett', 'Scarlett', false))
            .setName("Princess")
            .setDescription("A dress a princess would wear.")
            .setLevel(14)
            .setStat({Tits: 3, Pussy: 2});
        this.add(new Clothes('MudScarlett', 'Scarlett', false))
            .setName('Mud')
            .setDescription('Not really clothes, just mud slathered onto her body.')
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2, Pussy: 2});
        this.add(new Clothes('ForestScarlett', 'Scarlett', false))
            .setName('Greenhaven')
            .setDescription("The women of Greenhaven don't seem to wear much clothing.")
            .setLevel(6)
            .setStat({Throat: 1, Pussy: 1});
        this.add(new Clothes('DefaultScarlett', 'Scarlett', true))
            .setLevel(0)
            .setStat({Tits: 3});
        this.add(new Clothes('Halloween2020Scarlett', 'Scarlett', false))
            .setName('Halloween2020Scarlett')
            .setDescription('Halloween2020Scarlett')
            .setLevel(0)
            .setStat({Throat: 3, Anal: 3});
        this.add(new Clothes('Valentines2020Scarlett', 'Scarlett', false)
            .setName('Lingerie')
            .setDescription('Valentines 2020 Event')
            .setLevel(20)
            .setStat({Throat: 1, Tits: 1, Pussy: 1, Anal: 1}))
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('mushroomQuest');
            });
        this.add(new Clothes('Halloween2019Scarlett', 'Scarlett', false))
            .setName('Mummy')
            .setDescription("Halloween 2019 Event")
            .setLevel(20)
            .setStat({Tits: 2, Pussy: 2})
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('hornyBoris');
            });

        // Ardura
        this.add(new Clothes('WitchArdura', 'Ardura', false))
            .setName("WitchArdura")
            .setBody('Witch')
            .setFace('Witch')
            .setDescription("")
            .setLevel(25)
            .setStat({Throat: 4, Pussy: 2, Anal: 3});
        this.add(new Clothes('DemonArdura', 'Ardura', false))
            .setName("DemonArdura")
            .setDescription("")
            .setLevel(22)
            .setStat({Throat: 2, Tits: 3, Anal: 2});
        this.add(new Clothes('OrcArdura', 'Ardura', false))
            .setName("Orc")
            .setDescription("Clothes used during battle.")
            .setLevel(18)
            .setStat({Throat: 2, Pussy: 1, Anal: 4});
        this.add(new Clothes('PrincessArdura', 'Ardura', false))
            .setName("Princess")
            .setDescription("A dress a princess would wear.")
            .setLevel(14)
            .setStat({Anal: 2, Pussy: 3});
        this.add(new Clothes('MudArdura', 'Ardura', false))
            .setName('Mud')
            .setDescription('Not really clothes, just mud slathered onto her body.')
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2, Pussy: 2});
        this.add(new Clothes('ForestArdura', 'Ardura', false))
            .setName('Greenhaven')
            .setDescription("The women of Greenhaven don't seem to wear much clothing.")
            .setLevel(6)
            .setStat({Throat: 1, Pussy: 1});
        this.add(new Clothes('DefaultArdura', 'Ardura', true))
            .setLevel(0)
            .setStat({Anal: 2});
        this.add(new Clothes('Halloween2020Ardura', 'Ardura', false))
            .setName('Halloween2020Ardura')
            .setDescription('Halloween2020Ardura')
            .setLevel(0)
            .setStat({Pussy: 3, Anal: 3});
        this.add(new Clothes('Valentines2020Ardura', 'Ardura', false)
            .setName('Lingerie')
            .setDescription('Valentines 2020 Event')
            .setLevel(20)
            .setStat({Throat: 1, Tits: 1, Pussy: 1, Anal: 1}))
            .setShop(true)
            .setCost(1000)
            .setVisible(() => {
                return GAME.quest.isComplete('mushroomQuest');
            });

        // Natasha
        this.add(new Clothes('WitchNatasha', 'Natasha', false))
            .setName("WitchNatasha")
            .setBody('Witch')
            .setFace('Witch')
            .setDescription("")
            .setLevel(25)
            .setStat({Throat: 5, Pussy: 5, Anal: 3});
        this.add(new Clothes('DemonNatasha', 'Natasha', false))
            .setName("DemonNatasha")
            .setDescription("")
            .setLevel(22)
            .setStat({Throat: 4, Tits: 4});
        this.add(new Clothes('OrcNatasha', 'Natasha', false))
            .setName("Orc")
            .setDescription("Clothes used during battle.")
            .setLevel(18)
            .setStat({Throat: 2, Pussy: 1, Anal: 4});
        this.add(new Clothes('PrincessNatasha', 'Natasha', false))
            .setName("Princess")
            .setDescription("A dress a princess would wear.")
            .setLevel(14)
            .setStat({Throat: 3, Pussy: 2});
        this.add(new Clothes('MudNatasha', 'Natasha', false))
            .setName('Mud')
            .setDescription('Not really clothes, just mud slathered onto her body.')
            .setLevel(10)
            .setStat({Throat: 2, Tits: 2, Pussy: 2});
        this.add(new Clothes('ForestNatasha', 'Natasha', false))
            .setName('Greenhaven')
            .setDescription("The women of Greenhaven don't seem to wear much clothing.")
            .setLevel(6)
            .setStat({Throat: 1, Pussy: 1});
        this.add(new Clothes('DefaultNatasha', 'Natasha', true))
            .setLevel(0);
        this.add(new Clothes('Halloween2020Natasha', 'Natasha', false))
            .setName('Halloween2020Natasha')
            .setDescription('Halloween2020Natasha')
            .setBody('Boy')
            .setLevel(0)
            .setStat({Throat: 3, Pussy: 3});
        this.add(new Clothes('CrossDressNatasha', 'Natasha', false)
            .setName('CrossDress')
            .setBody('Boy')
            .setDescription('')
            .setLevel(0)
            .setShop(false))
            .addStyle(new ClothesStyle('NoPants', "No Pants", false))
            .addStyle(new ClothesStyle('NoPantsFuta', "No Pants Futa", false));

    }

    _initClothesMapConditions() {
    }

    /**
     * @method add
     * @memberOf ClothesManager
     * @instance
     * @param {Clothes} clothes
     * @returns {Clothes}
     */
    add(clothes) {
        this.Clothes[clothes.id] = clothes;

        if (gameData.clothes.hasOwnProperty(clothes.id) === false) {
            gameData.clothes[clothes.id] = {
                "Unlocked": clothes.unlockedByDefault,
                "Style": false
            }
        }

        return this.Clothes[clothes.id];
    }

    /**
     * @method remove
     * @memberOf ClothesManager
     * @instance
     * @param {string} clothesID
     * @returns {ClothesManager}
     */
    remove(clothesID) {
        delete this.Clothes[clothesID];
        return this;
    }

    /**
     * @method getClothes
     * @memberOf ClothesManager
     * @instance
     * @param {string} clothID
     * @returns {Clothes}
     */
    getClothes(clothID) {
        if (this.Clothes[clothID]) {
            return this.Clothes[clothID]
        } else {
            return false;
        }
    }

    /**
     * Returns an object of all the clothes, or an array of clothes for a specific girl
     * @method getAllClothes
     * @memberOf ClothesManager
     * @instance
     * @param {string} [girlID]
     * @returns {Object|Array<Clothes>}
     * */
    getAllClothes(girlID) {
        if (girlID) {
            let array = [];
            let girlClothesIDs = Object.keys(this.Clothes).filter((clothesID) => {
                return this.Clothes[clothesID].Girl.id === girlID;
            });
            for (let id of girlClothesIDs) {
                array.push(this.getClothes(id));
            }
            return array;
        } else {
            return this.Clothes;
        }
    }
}

class ClothesStyle {
    /**
     * @constructor
     * @param {string|boolean} id
     * @param {string} name
     * @param {function|boolean} condition
     */
    constructor(id, name, condition) {
        this.id = id;
        this.name = name;
        this.condition = condition;
    }

    /**
     * @method setID
     * @memberOf ClothesStyle
     * @instance
     * @param id
     * @returns {ClothesStyle}
     */
    setID(id) {
        this.id = id;
        return this;
    }

    /**
     * @method getID
     * @memberOf ClothesStyle
     * @instance
     * @returns {string}
     */
    getID() {
        return this.id;
    }

    /**
     * @method setName
     * @memberOf ClothesStyle
     * @instance
     * @param {string} name
     * @returns {ClothesStyle}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * @method getName
     * @memberOf ClothesStyle
     * @instance
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @method setCondition
     * @memberOf ClothesStyle
     * @instance
     * @param {function|boolean} condition
     * @returns {ClothesStyle}
     */
    setCondition(condition) {
        this.condition = condition;
        return this;
    }

    /**
     * @method getCondition
     * @memberOf ClothesStyle
     * @instance
     * @returns {function|boolean}
     */
    getCondition() {
        return this.condition;
    }

    /**
     * @method isVisible
     * @memberOf ClothesStyle
     * @instance
     * @returns {boolean}
     */
    isVisible() {
        if (typeof this.getCondition() === "boolean") {
            return this.getCondition();
        } else {
            return this.getCondition()();
        }
    }
}