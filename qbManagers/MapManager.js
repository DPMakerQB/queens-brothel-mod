/**
 * @typedef {object} MapManager.map
 * @property {string} name - the name of hte map
 * @property {boolean|string} north - id of the map north of this map or false
 * @property {boolean|string} south - id of the map south of this map or false
 * @property {boolean|string} east - id of the map eest of this map or false
 * @property {boolean|string} west - id of the map west of this map or false
 * @example
 * {
 *     "name": "Easthollow",
 *     "north": false,
 *     "south": false,
 *     "east": "Greenhaven",
 *     "west": false
 * }
 */

/**
 * @typedef {object} MapManager.building
 * @property {string} key - texture key of the building
 * @property {number} x - x location of the building
 * @property {number} y - y location of the building
 * @property {function} callback - function called when clicking the building
 * @property {function|boolean} [visible] - If you want to display this building only when a condition is met. The function should return true or false. It is called each time the map is created.
 * @example
 * {
 *     key: "House",
 *     x: 375,
 *     y: 486,
 *     callback: () => {
 *          GAME.menu.openMenu('house');
 *     }
 * }
 * @example
 * {
 *     key: "Brothel",
 *     x: 375,
 *     y: 486,
 *     callback: () => {
 *          GAME.menu.openMenu('brothel');
 *     },
 *     visible: () => {
 *          // This building will only be visible if the townFuckQuest 'Complete' subquest is true
 *          return GAME.quest.isComplete('townFuckQuest','Completed');
 *     }
 * }
 */

/**
 * Use this to manage the map
 * @class MapManager
 */
class MapManager {
    constructor() {
        this._queue = [];
        this._map = {
            "Easthollow": {
                "name": "Easthollow",
                "north": 'Mountains',
                "south": false,
                "east": 'Greenhaven',
                "west": false
            },
            "Town": {
                "name": "Easthollow Town",
                "north": false,
                "south": false,
                "east": false,
                "west": false
            },
            "School": {
                "name": "Easthollow School",
                "north": false,
                "south": false,
                "east": false,
                "west": false
            },
            "Greenhaven": {
                "name": "Greenhaven",
                "north": false,
                "south": 'MoaningMorass',
                "east": false,
                "west": 'Easthollow'
            },
            "MoaningMorass": {
                "name": "Morass",
                "north": 'Greenhaven',
                "south": 'Crossroad',
                "east": false,
                "west": false
            },
            "Crossroad": {
                "name": "Crossroads",
                "north": "MoaningMorass",
                "south": false,
                "east": "Avia",
                "west": "ScaryMansCastle"
            },
            "Avia": {
                "name": "Avia",
                "north": false,
                "south": false,
                "east": false,
                "west": "Crossroad"
            },
            "Mountains": {
                "name": "Mountains",
                "north": false,
                "south": "Easthollow",
                "east": false,
                "west": "Trasonia"
            },
            "Trasonia": {
                "name": "Trasonia",
                "north": false,
                "south": false,
                "east": "Mountains",
                "west": false
            },
            "ScaryMansCastle": {
                "name": "Scary Man's Castle",
                "north": false,
                "south": false,
                "east": "Crossroad",
                "west": false
            }
        };
        this._mapConditions = {};
        this._buildings = {
            "Easthollow": {
                "House1": {
                    key: "House1",
                    name: "House",
                    x: 0,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('house')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 1;
                    }
                },
                "Brothel1": {
                    key: "Brothel1",
                    name: "Brothel",
                    x: 350,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('brothel')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 1;
                    }
                },
                "House2": {
                    key: "House2",
                    name: "House",
                    x: 0,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('house')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 2;
                    }
                },
                "Brothel2": {
                    key: "Brothel2",
                    name: "Brothel",
                    x: 350,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('brothel')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 2;
                    }
                },
                "House3": {
                    key: "House3",
                    name: "House",
                    x: 0,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('house')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 3;
                    }
                },
                "Brothel3": {
                    key: "Brothel3",
                    name: "Brothel",
                    x: 350,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('brothel')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 3;
                    }
                },
                "House4": {
                    key: "House4",
                    name: "House",
                    x: 0,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('house')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 4;
                    }
                },
                "Brothel4": {
                    key: "Brothel4",
                    name: "Brothel",
                    x: 350,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('brothel')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 4;
                    }
                },
                "House5": {
                    key: "House5",
                    name: "House",
                    x: 0,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('house')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 5;
                    }
                },
                "Brothel5": {
                    key: "Brothel5",
                    name: "Brothel",
                    x: 350,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('brothel')
                    },
                    visible: () => {
                        return gameData.houseCapacity === 5;
                    }
                },
                "House6": {
                    key: "House6",
                    name: "House",
                    x: 0,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('house')
                    },
                    visible: () => {
                        return gameData.houseCapacity >= 6;
                    }
                },
                "Brothel6": {
                    key: "Brothel6",
                    name: "Brothel",
                    x: 350,
                    y: 265,
                    callback: () => {
                        GAME.menu.openMenu('brothel')
                    },
                    visible: () => {
                        return gameData.houseCapacity >= 6;
                    }
                },
                "Town": {
                    key: "Town",
                    name: "Town",
                    x: 923,
                    y: 188,
                    callback: () => {
                        GAME.map.switchMap('Town');
                    }
                },
                "HellPortal": {
                    key: "HellPortal",
                    name: "Portal",
                    x: 740,
                    y: 484,
                    callback: () => {
                        GAME.map.switchMap('Hell');
                    },
                    visible: () => {
                        return (GAME.quest.isComplete('getBooks') && !GAME.quest.isComplete('lilithQuest')) || GAME.quest.isComplete('finalBoss');
                    }
                }
            },
            "Town": {
                "TownSquare": {
                    key: "TownSquare",
                    name: "Town Square",
                    x: 519,
                    y: 567,
                    callback: () => {
                        GAME.dialogue.playDialogue('TownSquare');
                    }
                },
                "ClothesShop": {
                    key: "TownClothesShop",
                    name: "Clothes Shop",
                    x: 729,
                    y: 142,
                    callback: () => {
                        GAME.dialogue.playDialogue('ClothesShop').then((answer) => {
                            if (answer === "openClothesShop") {
                                GAME.menu.openMenu('townClothesShop');
                            }
                        });
                    }
                },
                "School": {
                    key: "school",
                    name: "School",
                    x: 1385,
                    y: 0,
                    callback: () => {
                        GAME.map.switchMap('School');
                    }
                },
                "Geoff": {
                    key: "TownGeoff",
                    name: "Geoff's Shop",
                    x: 0,
                    y: 48,
                    callback: () => {
                        GAME.dialogue.playDialogue('Geoff');
                    }
                },
                "Mayor": {
                    key: "TownMayor",
                    name: "Mayor's Office",
                    x: 1118,
                    y: 259,
                    callback: () => {
                        GAME.dialogue.playDialogue('TownMayor');
                    }
                },
                "Exit": {
                    key: 'exit',
                    name: "Exit",
                    x: 600,
                    y: 963,
                    callback: () => {
                        GAME.map.switchMap('Easthollow');
                    }
                }
            },
            "School": {
                "Cafeteria": {
                    key: "CafeteriaButton",
                    name: "Cafeteria",
                    x: 1200,
                    y: 150,
                    callback: () => {
                        GAME.dialogue.playDialogue('SchoolCafeteria');
                    }
                },
                "Janitors": {
                    key: "JanitorsClosetButton",
                    name: "Janitor's Closet",
                    x: 1400,
                    y: 720,
                    callback: () => {
                        GAME.dialogue.playDialogue('janitorsCloset');
                    }
                },
                "Principals": {
                    key: "PrincipalsOfficeButton",
                    name: "Principal's Office",
                    x: 800,
                    y: 730,
                    callback: () => {
                        GAME.dialogue.playDialogue('principalsOffice');
                    }
                },
                "Classroom": {
                    key: "ClassroomButton",
                    name: "Classroom",
                    x: 250,
                    y: 300,
                    callback: () => {
                        GAME.dialogue.playDialogue('AbigailClassroom');
                    }
                },
                "Exit": {
                    key: 'exit',
                    name: "Exit",
                    x: 20,
                    y: 963,
                    callback: () => {
                        GAME.map.switchMap('Town');
                    }
                }
            },
            "Greenhaven": {
                "Nirvokk": {
                    key: "NirvokkHut",
                    name: "Nirvokk's Hut",
                    x: 311,
                    y: 150,
                    callback: () => {
                        GAME.dialogue.playDialogue('Nirvokk');
                    }
                },
                "Darrak": {
                    key: "DarrakHut",
                    name: "Darrak's Hut",
                    x: 1129,
                    y: 213,
                    callback: () => {
                        GAME.dialogue.playDialogue('Darrak');
                    }
                },
                "Boris": {
                    key: "BorisHut",
                    name: "Boris's Hut",
                    x: 1403,
                    y: 242,
                    callback: () => {
                        GAME.dialogue.playDialogue('Boris');
                    }
                },
                "Hangout": {
                    key: "VillageHangout",
                    name: "Village Hangout",
                    x: 405,
                    y: 0,
                    callback: () => {
                        GAME.dialogue.playDialogue('VillageHangout');
                    }
                }
            },
            "MoaningMorass": {
                "Inn": {
                    key: "Inn",
                    name: "Inn",
                    x: 1154,
                    y: 39,
                    callback: () => {
                        GAME.dialogue.playDialogue('MorassInn');
                    }
                },
                "Pond": {
                    key: "Pond",
                    name: "Pond",
                    x: 309,
                    y: 555,
                    callback: () => {
                        GAME.dialogue.playDialogue('MorassPond');
                    }
                },
                "EsxeaHouse": {
                    key: "EsxeaHouse",
                    name: "Esxea's House",
                    x: 717,
                    y: 147,
                    callback: () => {
                        GAME.dialogue.playDialogue('EsxeaHouse');
                    }
                }
            },
            "Crossroad": {},
            "Avia": {
                "Castle": {
                    key: "AviaCastleKeep",
                    name: "Castle",
                    x: 166,
                    y: 312,
                    callback: () => {
                        GAME.dialogue.playDialogue('AviaCastleKeep');
                    }
                },
                "Slums": {
                    key: "AviaSlums",
                    name: "Slums",
                    x: 527,
                    y: 196,
                    callback: () => {
                        GAME.dialogue.playDialogue('AviaSlums');
                    }
                }
            },
            "Mountains": {
                "CampSite": {
                    key: "CampSite",
                    name: "Camp Site",
                    x: 316,
                    y: 43,
                    callback: () => {
                        GAME.dialogue.playDialogue('CampSite');
                    },
                    visible: () => {
                        return GAME.quest.isComplete('battleOrcs');
                    }
                }
            },
            "Trasonia": {
                "TrasoniaGroundFloor": {
                    key: "TrasoniaGroundFloor",
                    name: "Ground Floor",
                    x: 843,
                    y: 720,
                    callback: () => {
                        GAME.dialogue.playDialogue('TrasoniaGroundFloor');
                    }
                },
                "TrasoniaHallway": {
                    key: "TrasoniaHallway",
                    name: "Hallway",
                    x: 254,
                    y: 575,
                    callback: () => {
                        GAME.dialogue.playDialogue('TrasoniaHallway');
                    }
                },
                "TrasoniaDorms": {
                    key: "TrasoniaDorms",
                    name: "Dorms",
                    x: 1209,
                    y: 344,
                    callback: () => {
                        GAME.dialogue.playDialogue('TrasoniaDorms');
                    }
                },
                "TrasoniaLibrary": {
                    key: "TrasoniaLibrary",
                    name: "Library",
                    x: 500,
                    y: 250,
                    callback: () => {
                        GAME.dialogue.playDialogue('TrasoniaLibrary');
                    }
                }
            },
            "Hell": {
                "Throne": {
                    key: "HellThrone",
                    name: "Throne",
                    x: 141,
                    y: 95,
                    callback: () => {
                        GAME.dialogue.playDialogue('HellThrone');
                    }
                },
                "Exit": {
                    key: 'exit',
                    name: "Exit",
                    x: 20,
                    y: 963,
                    callback: () => {
                        GAME.map.switchMap('Easthollow');
                    }
                }
            },
            "ScaryMansCastle": {
                "Castle": {
                    key: "ScaryMansCastleButton",
                    name: "Castle",
                    x: 113,
                    y: 34,
                    callback: () => {
                        GAME.dialogue.playDialogue('ScaryMansCastle');
                    }
                }
            }
        };

        /**
         * @name MapManager#_arrowConditions
         * @type {Object}
         * @private
         */
        this._arrowConditions = {
            "Easthollow": [function () {
                if (GAME.quest.isComplete('greenhaven', 'Start') === false) {
                    GAME.map.disableArrow('east');
                }
            }],
            "Greenhaven": [function () {
                if (GAME.quest.isComplete('mushroomQuest', 'BuildBoat') === false) {
                    GAME.map.disableArrow('south');
                }
            }],
            "MoaningMorass": [function () {
                if (GAME.quest.isComplete('kingsQuest', 'Start') === false) {
                    GAME.map.disableArrow('south');
                }
            }],
            "Mountains": [function () {
                if (GAME.quest.isComplete('findTrasonia', 'Start') === false) {
                    GAME.map.disableArrow('west');
                }
            }],
            "Crossroad": [function () {
                if (GAME.quest.isComplete('leadToCastle', 'Crossroads') === false) {
                    GAME.map.disableArrow('west');
                }
            }]
        };

        this._mapGroup = null;

        /**
         * The id of the current map the player is on.
         * @name MapManager#currentMap
         * @type {string}
         */
        this.currentMap = 'Easthollow';
    }

    _initMapConditions() {
        GAME.map.addMapCondition('Town', function () {
            if (GAME.quest.isComplete('worldQuests', 'firstVisitTown') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('TownMayor', 'firstVisitTown').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition("School", function () {
            if (GAME.quest.isComplete('sukiQuest', 'Start') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('schoolEntrance').then(() => {
                        resolve();
                    })
                });
            }
        });

        GAME.map.addMapCondition("School", function () {
            if (GAME.quest.isComplete('sukiQuest', 'Start') === true && GAME.girl.Queen.getClothes().getID() !== 'SchoolgirlQueen' && GAME.quest.isComplete('sukiQuest', 'End') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('schoolEntrance', 'clothes').then(() => {
                        resolve();
                    })
                });
            }
        });

        GAME.map.addMapCondition('Greenhaven', function () {
            if (GAME.quest.isComplete('greenhaven', 'End') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('TownMayor', 'greenhavenEnd').then(() => {
                        resolve();
                    })
                });
            }
        });

        GAME.map.addMapCondition('Crossroad', function () {
            if (GAME.quest.isComplete('kingsQuest', 'GoToCrossroads') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('crossroadFirstVisit').then(() => {
                        resolve();
                    })
                });
            }
        });

        GAME.map.addMapCondition('Avia', function () {
            if (GAME.quest.isComplete('kingsQuest', 'FuckPeasants') === true && GAME.quest.isComplete('kingsQuest', 'NaknuClimbCastle') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('aviaAfterFuckPeasants').then(() => {
                        resolve();
                    })
                });
            }
        });

        GAME.map.addMapCondition('Mountains', function () {
            if (GAME.quest.isComplete('battleOrcs', 'AskKing') === false) {
                return new Promise((resolve) => {
                    if (GAME.girl.Queen.isNaked()) {
                        GAME.dialogue.playDialogue('checkMountainsNaked').then(() => {
                            resolve();
                        });
                    } else {
                        GAME.dialogue.playDialogue('checkMountainsClothes').then(() => {
                            resolve();
                        });
                    }
                });
            }
        });

        GAME.map.addMapCondition('Mountains', function () {
            if (GAME.quest.isComplete('battleOrcs', 'AskKing') === true && GAME.quest.isComplete('battleOrcs', 'CheckBattle') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('battleOrcsCheckBattle').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('Mountains', function () {
            if (GAME.quest.isComplete('battleOrcs', 'NaknuPoison') === true && GAME.quest.isComplete('battleOrcs', 'FuckSoldiers') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('battleOrcsFuckSoldiers').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('Trasonia', function () {
            if (GAME.quest.isComplete('findTrasonia', 'Start') === true && GAME.quest.isComplete('findTrasonia', 'End') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('TrasoniaMap').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('Trasonia', function () {
            if (GAME.quest.isComplete('ariettaQuest') === true && GAME.quest.isComplete('getBooks', 'Start') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('TrasoniaBanned').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('Greenhaven', function () {
            if (GAME.quest.isComplete('leadToCastle', 'Start') === true && GAME.quest.isComplete('leadToCastle', 'Greenhaven') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('leadToCastleGreenhaven').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('MoaningMorass', function () {
            if (GAME.quest.isComplete('leadToCastle', 'Greenhaven') === true && GAME.quest.isComplete('leadToCastle', 'Morass') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('leadToCastleMorass').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('Crossroad', function () {
            if (GAME.quest.isComplete('leadToCastle', 'Morass') === true && GAME.quest.isComplete('leadToCastle', 'Crossroads') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('leadToCastleCrossroads').then(() => {
                        resolve();
                    });
                });
            }
        });

        GAME.map.addMapCondition('ScaryMansCastle', function () {
            if (GAME.quest.isComplete('leadToCastle', 'Crossroads') === true && GAME.quest.isComplete('leadToCastle', 'End') === false) {
                return new Promise((resolve) => {
                    GAME.dialogue.playDialogue('leadToCastleEnd').then(() => {
                        resolve();
                    });
                });
            }
        });
    }

    /**
     * @method getMap
     * @memberOf MapManager
     * @instance
     * @param {string} mapID=undefined - If no id is given, it will return the entire game map
     * @return {MapManager.map|boolean}
     */
    getMap(mapID) {
        if (mapID === undefined) {
            return this._map;
        } else {
            if (this._map.hasOwnProperty(mapID)) {
                return this._map[mapID]
            } else {
                return false;
            }
        }
    }

    /**
     * @getBuildings
     * @memberOf MapManager
     * @param {string} mapID - Get all of the buildings for the map
     * @return {object<MapManager.building>|boolean}
     */
    getBuildings(mapID) {
        if (this._buildings.hasOwnProperty(mapID)) {
            return this._buildings[mapID];
        } else {
            return false;
        }
    }

    /**
     * Add a new building to the map
     * @method addBuilding
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @param {string} buildingID
     * @param {MapManager.building} building
     */
    addBuilding(mapID, buildingID, building) {
        if (this._buildings.hasOwnProperty(mapID) === false) {
            this._buildings[mapID] = {};
        }
        this._buildings[mapID][buildingID] = building;
    }

    /**
     * Removes the building from the game entirely
     * @method removeBuilding
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @param {string} buildingID
     */
    removeBuilding(mapID, buildingID) {
        delete this._buildings[mapID][buildingID];
    }

    /**
     * @method _addToQueue
     * @memberOf MapManager
     * @instance
     * @private
     * @param {Promise} callback
     */
    _addToQueue(callback) {
        this._queue.push(callback);
    }

    /**
     * @method _playMapConditions
     * @memberOf MapManager
     * @instance
     * @private
     */
    _playMapConditions(currentMap) {
        return new Promise((resolve) => {
            if (this._mapConditions.hasOwnProperty(currentMap)) {
                for (let i in this._mapConditions[currentMap]) {
                    if (typeof this._mapConditions[currentMap][i] === "function") {
                        this._addToQueue(this._mapConditions[currentMap][i]);
                    }
                }
                this._popQueue(resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * @method _popQueue
     * @memberOf MapManager
     * @instance
     * @private
     * @param {function} resolve
     */
    _popQueue(resolve) {
        if (this._queue.length > 0) {
            let functionType = (this._queue.shift())();
            if (typeof functionType === "object") {
                functionType.then(() => {
                    this._popQueue(resolve);
                })
            } else {
                this._popQueue(resolve);
            }
        } else {
            resolve();
        }
    }

    /**
     * Map conditions are functions called whenever a player goes to that map. For example, when the girls go to the Morass after recruiting Esxea, a dialogue plays. That is a map condition.
     * The callback function should return a promise function if the condition is met to prevent two conditions from playing at the same time.
     * @method addMapCondition
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @param {Promise} callback - Should return a promise if the condition is met
     */
    addMapCondition(mapID, callback) {
        if (this._mapConditions.hasOwnProperty(mapID) === false) {
            this._mapConditions[mapID] = [];
        }
        this._mapConditions[mapID].push(callback);
    }

    /**
     * Use {@link MapManager.getMapConditions} to find the index of the condition you want to remove
     * @method removeMapCondition
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @param {number} index
     */
    removeMapCondition(mapID, index) {
        this._mapConditions[mapID].splice(index, 1);
    }

    /**
     * Returns the array of map conditions.
     * @method getMapConditions
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @return {Array}
     */
    getMapConditions(mapID) {
        return this._mapConditions[mapID];
    }

    /**
     * Switches to a map
     * @method switchMap
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @param {boolean} [silent=false] - Silent means no map conditions will be played when switching maps
     */
    switchMap(mapID, silent) {
        silent = silent || false;
        this.clearQueue();
        GAME.map.currentMap = mapID;
        GAME.createMap(silent);
        if (GAME.map.getMap(mapID)) {
            GAME.showMapName(this.getMap(mapID).name);
        }
    }

    /**
     * Clears the map condition queue, preventing the remaining conditions to play
     * @method clearQueue
     * @memberOf MapManager
     * @instance
     */
    clearQueue() {
        this._queue = [];
    }

    /**
     * @method _doArrowConditions
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @private
     */
    _doArrowConditions(mapID) {
        if (this._arrowConditions.hasOwnProperty(mapID)) {
            for (let i in this._arrowConditions[mapID]) {
                this._arrowConditions[mapID][i]();
            }
        }
    }

    /**
     * Sets the arrow visibility to false.
     * All arrows are visible by default if there is a map location available there. You will only ever need to disable them temporarily for quests or other conditions
     * @method setArrow
     * @memberOf MapManager
     * @instance
     * @param {'north'|'south'|'east'|'west'} direction - Direction of the arrow
     */
    disableArrow(direction) {
        this._mapGroup.getByName(direction).setVisible(false);
    }

    /**
     * Adds an arrow condition to the map. Anything you need to do to the arrows should be inside the callback function. Use {@link MapManager#_arrowConditions} as a template
     * @method setArrowCondition
     * @memberOf MapManager
     * @instance
     * @param {string} mapID
     * @param {function} callback - This function should disable arrows inside of it. Use the default values as a template.
     */
    setArrowCondition(mapID, callback) {
        if (this._arrowConditions.hasOwnProperty(mapID) === false) {
            this._arrowConditions[mapID] = [];
        }
        this._arrowConditions[mapID].push(callback);
    }
}