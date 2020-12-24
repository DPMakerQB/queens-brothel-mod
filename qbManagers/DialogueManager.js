/**
 * The DialogueManager is shared by all mods and the game. Any names added to the list will be available for everyone to use.
 * @class DialogueManager
 */
class DialogueManager {
    constructor() {
        this._names = {
            '': ''
        };

        this.dialogues = {};

        this.activeDialogue = false;
    }

    _initNames() {
        this.addName('Queen', 'Queen');
        this.addName('Queen-Bukkake', 'Queen');
        this.addName('Suki', 'Suki');
        this.addName('Esxea', 'Esxea');
        this.addName('Scarlett', 'Scarlett');
        this.addName('Ardura', 'Ardura');
        this.addName('Natasha', 'Natasha')
        this.addName('AviaGuard', 'Avia Guard');
        this.addName('Brior', 'Brior');
        this.addName('Daniel', 'Daniel');
        this.addName('Darrak', 'Darrak');
        this.addName('Boris', 'Boris');
        this.addName('BorisWolf', 'Boris');
        this.addName('Dathea', 'Dathea');
        this.addName('Geoff', 'Geoff');
        this.addName('King', 'King of Avia');
        this.addName('KingEvil', 'King of Avia');
        this.addName('Leon', 'Leon');
        this.addName('Mayor', 'Mayor');
        this.addName('Naknu', 'Naknu');
        this.addName('NotNaknu', 'Not Naknu');
        this.addName('Nirvokk', 'Nirvokk');
        this.addName('Peasant', 'Peasant');
        this.addName('Principal', 'Principal');
        this.addName('Abigail', 'Abigail');
        this.addName('Cassie', 'Cassie');
        this.addName('Thomas', 'Thomas');
        this.addName('ScaryMan', 'Scary Man');
        this.addName('Thisa', 'Thisa');
        this.addName('AviaCaptain', 'Avia Captain');
        this.addName('Mog', 'Mog');
        this.addName('Arietta', 'Arietta');
        this.addName('Sabrina', 'Sabrina');
        this.addName('Daisy', 'Daisy');
        this.addName('Archmage', 'ArchMage');
        this.addName('Phyllis', 'Phyllis');
        this.addName('Lilith', 'Lilith');
        this.addName('Minotaur', 'Minotaur');
        this.addName('Monster', 'Monster');
        this.addName('MonsterBlue', 'Monster');
        this.addName('MonsterBrown', 'Monster');
        this.addName('Nigel', 'Nigel');
        this.addName('Nigel-SmallCock', 'Nigel');
        this.addName('Nigel-BigCock', 'Nigel');
        this.addName('Nigel-2', 'Nigel');
        this.addName('Nigel-3', 'Nigel');
        this.addName('E1', 'Man');
        this.addName('E2', 'Man');
        this.addName('E3', 'Man');
        this.addName('E4', 'Man');
        this.addName('G1', 'Man');
        this.addName('G2', 'Man');
        this.addName('G3', 'Man');
        this.addName('G4', 'Man');
        this.addName('Go1', 'Goblin');
        this.addName('Go2', 'Goblin');
        this.addName('Go3', 'Goblin');
        this.addName('Go4', 'Goblin');
        this.addName('P1', 'Man');
        this.addName('P2', 'Man');
        this.addName('P3', 'Man');
        this.addName('P4', 'Man');
        this.addName('O1', 'Orc');
        this.addName('O2', 'Orc');
        this.addName('O3', 'Orc');
        this.addName('O4', 'Orc');
    }

    _playDialogueTree(id, branch, parameter) {
        if (branch === "") {
            branch = null;
        }
        return new Promise((resolve) => {
            if (this.activeDialogue === false) {
                this.activeDialogue = this.getDialogueTree(id).getID();
            }
            this.getDialogueTree(id).play(branch, parameter).then((answer) => {
                if (this.activeDialogue === this.getDialogueTree(id).getID()) {
                    this.activeDialogue = false;
                }
                resolve(answer);
            });
        });
    }

    /**
     * @method addDialogueTree
     * @memberOf DialogueManager
     * @instance
     * @param {string} id
     * @returns {DialogueTree}
     */
    addDialogueTree(id) {
        let dialogueTree = new DialogueTree(id);
        this.dialogues[dialogueTree.getID()] = dialogueTree;
        return this.dialogues[dialogueTree.getID()];
    }

    /**
     * @method removeDialogueTree
     * @memberOf DialogueManager
     * @instance
     * @param id
     * @returns {DialogueManager}
     */
    removeDialogueTree(id) {
        delete this.dialogues[id];

        return this;
    }

    /**
     * @method getDialogueTree
     * @memberOf DialogueManager
     * @instance
     * @param {string} id
     * @return {function}
     */
    getDialogueTree(id) {
        return this.dialogues[id];
    }

    /**
     * @method playDialogue
     * @memberOf DialogueManager
     * @instance
     * @param {string} id
     * @param {string} [branchID]
     * @param {*} [parameter]
     * @returns {Promise<any>}
     */
    playDialogue(id, branchID, parameter) {
        return new Promise((resolve) => {
            let dialogueScene = game.scene.getScene('DialogueScene');

            if (dialogueScene.sys.isActive() === false) {
                dialogueScene.events.once('doneLoading', () => {
                    this._playDialogueTree(id, branchID, parameter).then((answer) => {
                        dialogueScene.end(answer).then(() => {
                            resolve(answer)
                        })
                    });
                });

                dialogueScene.scene.start('DialogueScene', {pauseAllScenes: true})
            } else {
                let pausedScenes = dialogueScene.data.get('pausedScenes');

                dialogueScene.scene.bringToTop();
                game.scene.getScene('DialogueScene').scene.manager.pauseAllScenes('DialogueScene');

                this._playDialogueTree(id, branchID, parameter).then((answer) => {
                    let overScenes = dialogueScene.data.get('pausedScenes');

                    if (overScenes) {
                        for (let scene of overScenes) {
                            game.scene.getScene(scene).scene.resume();
                        }
                        dialogueScene.scene.sendToBack();
                    }

                    if (pausedScenes) {
                        for (let scene of pausedScenes) {
                            game.scene.getScene(scene).scene.pause();
                        }

                        dialogueScene.data.set('pausedScenes', pausedScenes);
                    }

                    resolve(answer);
                });
            }
        });
    }

    /**
     * A popUpBoard is the message board that pops up and you either press "okay" or "yes/no"
     * @method popUpBoard
     * @memberOf DialogueManager
     * @instance
     * @param {string} text - Text to display in the box
     * @param {boolean} [type=false] - Set to true for a "yes/no" pop up board. It will return a boolean if set to true.
     * @returns Promise<boolean>
     */
    popUpBoard(text, type) {
        return new Promise((resolve) => {
            text = text || "";
            type = type || false;
            game.scene.start('popUpBoard', {pauseAllScenes: true, text: text, type: type});
            game.scene.getScene('popUpBoard').events.once('shutdown', (scene, data) => {
                resolve(data.answer);
            });
        })
    }

    /**
     * This is a quick way to make a character say something without creating a dialogue
     * @method talk
     * @memberOf DialogueManager
     * @instance
     * @param {String} characterID - The ID of the character
     * @param {String} dialogueText - The text to put in the dialogue box
     * @param {GirlManager.facialExpression} [emotion="Neutral"]
     * @param {number} [duration]
     * @returns Promise
     */
    talk(characterID, dialogueText, emotion, duration) {
        return new Promise((resolve) => {
            this.addDialogueTree('tempDialogue')
                .addBranch('tempBranch', true)
                .talk(characterID, dialogueText, emotion);

            this.playDialogue('tempDialogue').then(() => {
                this.removeDialogueTree('tempDialogue');
                resolve();
            });
        })
    }

    /**
     * Get the full name of the character using the characterID
     * @method getName
     * @memberOf DialogueManager
     * @instance
     * @param {string} id
     * @returns {string}
     */
    getName(id) {
        return this._names[id];
    }

    /**
     * Adds a new name to the list
     * @method addName
     * @memberOf DialogueManager
     * @instance
     * @param {string} id
     * @param name
     */
    addName(id, name) {
        this._names[id] = name;
    }

    /**
     * @method removeName
     * @memberOf DialogueManager
     * @instance
     * @param {string} id
     */
    removeName(id) {
        delete this._names[id];
    }

    /**
     * Searches through all of the dialogues to find a string
     * @method search
     * @memberOf DialogueManager
     * @instance
     * @param {string} string
     * @return {Array<object>}
     */
    search(string) {
        let found = [];

        let checkLeaves = (leaves) => {
            for (let i in leaves) {
                let leaf = leaves[i];
                if (leaf.getType() === "Talk") {
                    if (leaf.text.search(string) !== -1) {
                        found.push({
                            character: leaf.character,
                            text: leaf.text,
                            emotion: leaf.emotion,
                            branch: leaf.getParent(),
                            branchParent: leaf.getParent().getParent(),
                            branchTree: leaf.getParent().getTree(),
                            leaf: i,
                        })
                    }
                }
            }
        };

        let checkBranch = (branch) => {
            checkLeaves(branch.getLeaves());

            for (let branchID in branch.getBranches()) {
                checkBranch(branch.getBranch(branchID));
            }
        };

        let checkDialogue = (dialogueID) => {
            for (let branches in this.getDialogueTree(dialogueID).branches) {
                checkBranch(this.getDialogueTree(dialogueID).getBranch(branches));
            }
        };

        for (let dialogue in this.dialogues) {
            checkDialogue(dialogue);
        }

        return found;
    }

    // /**
    //  * Exports all of the dialogue in the game into an editable mod
    //  * @method export
    //  * @memberOf DialogueManager
    //  * @instance
    //  * @return {Array<object>}
    //  */
    // export() {
    //     let rows = [['character','emotion','tree','branchParent','branch','leaf','text']];
    //
    //     let checkLeaves = (leaves) => {
    //         for (let i in leaves) {
    //             let leaf = leaves[i];
    //             if (leaf.getType() === "Talk") {
    //                 let emotion = leaf.emotion || "";
    //                 rows.push([leaf.character,emotion,leaf.getParent().getTree().getID(),leaf.getParent().getParent().getID(),leaf.getParent().getID(),i,leaf.text])
    //             }
    //         }
    //     };
    //
    //     let checkBranch = (branch) => {
    //         checkLeaves(branch.getLeaves());
    //
    //         for (let branchID in branch.getBranches()) {
    //             checkBranch(branch.getBranch(branchID));
    //         }
    //     };
    //
    //     let checkDialogue = (dialogueID) => {
    //         for (let branches in this.getDialogueTree(dialogueID).branches) {
    //             checkBranch(this.getDialogueTree(dialogueID).getBranch(branches));
    //         }
    //     };
    //
    //     for (let dialogue in this.dialogues) {
    //         checkDialogue(dialogue);
    //     }
    //
    //     let csvContent = "data:text/csv;charset=utf-8,"
    //         + rows.map(e => e.join(",")).join("\n");
    //
    //     let encodedUri = encodeURI(csvContent);
    //     window.open(encodedUri);
    // }
}

class DialogueTree {
    /**
     * @constructor
     * @param {string} id
     * @returns {DialogueTree}
     */
    constructor(id) {
        this.id = id;
        this.branches = {};
        this.root = "";
        this.parameter = {};

        return this;
    }

    getID() {
        return this.id;
    }

    /**
     * Creates a {@link Branch} in the DialogueTree
     * @method addBranch
     * @memberOf DialogueTree
     * @instance
     * @param {string} branchID
     * @param {boolean} [setRoot=false]
     * @returns {Branch}
     */
    addBranch(branchID, setRoot) {
        setRoot = setRoot || false;

        let branch = new Branch(branchID)._setParent(this);

        if (setRoot === true) {
            this.setRoot(branch.getID());
        }

        this.branches[branch.getID()] = branch;
        this.branches[branch.getID()]._setParent(this);
        this.branches[branch.getID()]._setTree(this);
        return this.branches[branch.getID()];
    }

    /**
     * @method setRoot
     * @memberOf DialogueTree
     * @instance
     * @param {string} id
     * @returns {DialogueTree}
     */
    setRoot(id) {
        this.root = id;
        return this;
    }

    getRoot() {
        return this.root;
    }

    /**
     * @method getBranch
     * @memberOf DialogueTree
     * @instance
     * @param {string} id
     * @returns {Branch}
     */
    getBranch(id) {
        return this.branches[id];
    }

    /**
     * @method play
     * @memberOf DialogueTree
     * @instance
     * @param {string} [branch=this.root]
     * @param {*} [parameter]
     * @returns {Promise<Any>}
     */
    play(branch, parameter) {
        if (parameter) {
            this.parameter = parameter;
        }
        branch = branch || this.getRoot();

        return new Promise((resolve) => {
            this.getBranch(branch).play(parameter).then((answer) => {
                resolve(answer);
            });
        });
    }
}

class DialogueStep {
    /**
     * @constructor
     * @param {string} type
     */
    constructor(type) {
        this._TYPE = type;
        this._PARENT = false;
        this._RETURN_ANSWER = false;
        this._DialogueScene = game.scene.getScene('DialogueScene');
    }

    _setParent(parent) {
        this._PARENT = parent;
        return this;
    }

    /**
     * @method getParent
     * @memberOf DialogueStep
     * @instance
     * @returns {{}}
     */
    getParent() {
        return this._PARENT;
    }

    /**
     * @method getType
     * @memberOf DialogueStep
     * @instance
     * @returns {{}}
     */
    getType() {
        return this._TYPE;
    }

    /**
     * If this step should return an answer to be saved
     * @method returnAnswer
     * @memberOf DialogueStep
     * @param boolean
     * @returns {DialogueStep}
     */
    returnAnswer(boolean) {
        this._RETURN_ANSWER = boolean;
        return this;
    }

    /**
     * @method getReturnAnswer
     * @memberOf DialogueStep
     * @instance
     * @returns {boolean}
     */
    getReturnAnswer() {
        return this._RETURN_ANSWER;
    }

    /**
     * {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
     * @method getDialogueScene
     * @memberOf DialogueStep
     * @instance
     * @returns {Phaser.Scene}
     */
    getDialogueScene() {
        return this._DialogueScene;
    }
}

class DialogueTalk extends DialogueStep {
    /**
     * @constructor
     * @param {string} character
     * @param {string} text
     * @param {GirlManager.facialExpression} [emotion="Neutral"]
     * @param {number} [duration]
     */
    constructor(character, text, emotion, duration) {
        super("Talk");
        this.character = character;
        this.text = text;
        this.emotion = emotion;
        this.duration = duration;
    }

    /**
     * @method play
     * @memberOf DialogueTalk
     * @instance
     * @returns {Promise<Any>}
     */
    play() {
        return new Promise((resolve) => {
            this.getDialogueScene().talk(this.character, this.text, this.emotion, this.duration).then(() => {
                resolve();
            });
        });
    }
}

class DialogueQuestion extends DialogueStep {
    /**
     * @constructor
     * @param {Array<String>} answers
     * @param {boolean} [exit=false]
     * @param {string} [text]
     * @param {string} [character]
     */
    constructor(answers, exit, text, character) {
        super("Question");
        this.answers = answers;
        this.exit = exit || false;
        this.text = text || "";
        this.character = character || "nullPixel";

        this.returnAnswer(true);
    }

    /**
     * @method play
     * @memberOf DialogueQuestion
     * @instance
     * @returns {Promise<Number>}
     */
    play() {
        return new Promise((resolve) => {
            this.getDialogueScene().question(this.answers, this.exit, this.text, this.character).then((answer) => {
                resolve(answer);
            });
        });
    }
}

class DialogueQuestPicker extends DialogueStep {
    /**
     * @constructor
     * @param {string} mapKey
     * @param {string} text
     * @param {string} [character="nullPixel"]
     * @param {boolean} [greet=false]
     */
    constructor(mapKey, text, character, greet) {
        super("QuestPicker");
        this.mapKey = mapKey;
        this.text = text || "";
        this.character = character || "nullPixel";
        this.greet = greet;

        this.returnAnswer(true);
    }

    /**
     * @method play
     * @memberOf DialogueQuestPicker
     * @instance
     * @returns {Promise<number>}
     */
    play() {
        return new Promise((resolve) => {
            let quests = GAME.quest.getActiveQuests(this.mapKey);
            quests = quests.filter((a) => {
                return a.getProgress() === true;
            });

            let questNames = [];

            for (let quest of quests) {
                questNames.push(quest.getQuest().getName());
            }

            if (this.greet) {
                Phaser.Utils.Array.AddAt(questNames, "Greet", 0);
                Phaser.Utils.Array.AddAt(quests, "Greet", 0);
            }

            this.getDialogueScene().question(questNames, true, this.text, this.character, quests).then((answer) => {
                if (answer === false) {
                    resolve();
                } else {
                    let quest = quests[answer - 1];

                    if (this.greet && answer === 1) {
                        resolve("greet");
                    } else {
                        if (quest.getDialogueBranch() !== "") {
                            GAME.dialogue.playDialogue(quest.getDialogueTree(), quest.getDialogueBranch()).then((answer) => {
                                resolve(answer);
                            });
                        } else {
                            GAME.dialogue.playDialogue(quest.getDialogueTree()).then((answer) => {
                                resolve(answer);
                            });
                        }
                    }
                }
            });
        });
    }
}

class DialogueSwitchDialogue extends DialogueStep {
    /**
     * @constructor
     * @param {string} dialogueID
     * @param {string} branchID
     */
    constructor(dialogueID, branchID) {
        super("SwitchDialogue");

        this.dialogueID = dialogueID;
        this.branchID = branchID;
    }

    /**
     * @method play
     * @memberOf DialogueSwitchDialogue
     * @instance
     * @returns {Promise<Any>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.dialogue.playDialogue(this.dialogueID, this.branchID).then(() => {
                resolve();
            });
        });
    }
}

class DialogueSwitchBranch extends DialogueStep {
    /**
     * @constructor
     * @param {string} branchID
     */
    constructor(branchID) {
        super("SwitchBranch");

        this.branchID = branchID;
    }

    /**
     * @method play
     * @memberOf DialogueSwitchBranch
     * @instance
     * @returns {Promise<Any>}
     */
    play() {
        return new Promise((resolve) => {
            this.getParent().playBranch(this.branchID).then((answer) => {
                resolve(answer);
            });
        });
    }
}

class DialogueFunction extends DialogueStep {
    /**
     * @constructor
     * @param {function} callback
     * @returns {DialogueFunction}
     */
    constructor(callback) {
        super("DialogueFunction");
        this.callback = callback;

        this.returnAnswer(true);

        return this;
    }

    /**
     * @method play
     * @memberOf DialogueFunction
     * @instance
     * @returns {Promise<any>}
     */
    play() {
        return new Promise((resolve) => {
            this.callback(this.getParent().getParameter(), this.getParent().getLastAnswer()).then((answer) => {
                resolve(answer);
            });
        });
    }
}

class DialogueSetBackground extends DialogueStep {
    /**
     * @constructor
     * @param {string|boolean} [key]
     */
    constructor(key) {
        super("SetBackground");

        this.key = key;
    }

    /**
     * @method play
     * @memberOf DialogueSetBackground
     * @instance
     * @returns {Promise<Any>}
     */
    play() {
        return new Promise((resolve) => {
            this.getDialogueScene().setBackground(this.key).then(() => {
                resolve();
            });
        });
    }
}

class DialogueifLastAnswer extends DialogueStep {
    /**
     * @constructor
     * @param scope
     * @param {number} answer
     * @param {string} branchID
     * @param {string} [dialogueID]
     * @param {number} [skipAnswers]
     */
    constructor(scope, answer, branchID, dialogueID, skipAnswers) {
        super("ifLastAnswer");

        this.answer = answer;
        this.scope = scope;
        this.branchID = branchID;
        this.dialogueID = dialogueID;
        this.skipAnswers = skipAnswers;
    }

    /**
     * @method play
     * @memberOf DialogueifLastAnswer
     * @instance
     * @returns {Promise<any>}
     */
    play() {
        return new Promise((resolve) => {
            if (this.answer === this.scope.getLastAnswer(this.skipAnswers)) {
                if (this.dialogueID) {
                    GAME.dialogue.playDialogue(this.dialogueID, this.branchID).then((answer) => {
                        resolve(answer);
                    });
                } else if (this.branchID) {
                    this.getParent().playBranch(this.branchID).then((answer) => {
                        resolve(answer);
                    });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }
}

class DialogueifAnswerAtStep extends DialogueStep {
    /**
     * @constructor
     * @param scope
     * @param {number} step
     * @param {number} answer
     * @param {string} branchID
     * @param {string} [dialogueID]
     */
    constructor(scope, step, answer, branchID, dialogueID) {
        super("ifAnswerAtStep");

        this.answer = answer;
        this.scope = scope;
        this.step = step;
        this.branchID = branchID;
        this.dialogueID = dialogueID;
    }

    /**
     * @method play
     * @memberOf DialogueifAnswerAtStep
     * @instance
     * @returns {Promise<Any>}
     */
    play() {
        return new Promise((resolve) => {
            if (this.answer === this.scope.getAnswers(this.step)) {
                if (this.dialogue) {
                    GAME.dialogue.playDialogue(this.dialogueID, this.branchID).then((answer) => {
                        resolve(answer);
                    });
                } else if (this.branchID) {
                    this.getParent().playBranch(this.branchID).then((answer) => {
                        resolve(answer);
                    });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }
}

class DialogueFade extends DialogueStep {
    /**
     * @constructor
     * @param {number} [delay=1000]
     */
    constructor(delay) {
        super("Fade");
        this.delay = delay || 1000;
    }

    /**
     * @method play
     * @memberOf DialogueFade
     * @instance
     * @returns {Promise<any>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.fade(this.delay).then(() => {
                resolve();
            })
        });
    }
}

class DialogueFlash extends DialogueStep {
    /**
     * @constructor
     */
    constructor() {
        super("Flash");
    }

    /**
     * @method play
     * @memberOf DialogueFlash
     * @instance
     * @returns {Promise<any>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.cumFlash();
            resolve();
        });
    }
}

class DialoguePopUp extends DialogueStep {
    /**
     * @constructor
     * @param {string} text
     * @param {boolean} type - True = Yes/No, False = Okay
     */
    constructor(text, type) {
        super("PopUp");
        this.text = text || "";
        this.type = type || false;

        if (this.getPopUpType() === true) {
            this.returnAnswer(true);
        }
    }

    /**
     * @method getPopUpType
     * @memberOf DialoguePopUp
     * @instance
     * @returns {boolean}
     */
    getPopUpType() {
        return this.type;
    }

    /**
     * @method play
     * @memberOf DialoguePopUp
     * @instance
     * @returns {Promise<boolean>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.dialogue.popUpBoard(this.text, this.type).then((answer) => {
                resolve(answer);
            });
        });
    }
}

class DialogueCompleteQuest extends DialogueStep {
    /**
     * @constructor
     * @param {string} questID
     * @param {string} subquestID
     * @param {*} onCompleteParameter
     */
    constructor(questID, subquestID, onCompleteParameter) {
        super("CompleteQuest");
        this.questID = questID;
        this.subquestID = subquestID;
        this.onCompleteParameter = onCompleteParameter;
    }

    /**
     * @method play
     * @memberOf DialogueCompleteQuest
     * @instance
     * @returns {Promise<any>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.quest.complete(this.questID, this.subquestID, this.onCompleteParameter);
            resolve();
        });
    }
}

class DialogueSetNaked extends DialogueStep {
    /**
     * @constructor
     * @param {string|array<string>} girl
     * @param {boolean} boolean
     */
    constructor(girl, boolean) {
        super("SetNaked");
        this.girl = girl;
        this.boolean = boolean || false;
    }

    /**
     * @method play
     * @memberOf DialogueSetNaked
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            if (typeof this.girl === "object") {
                for (let girl of this.girl) {
                    GAME.girl.getGirl(girl).setNaked(this.boolean);
                }
            } else {
                GAME.girl.getGirl(this.girl).setNaked(this.boolean);
            }
            resolve();
        });
    }
}

class DialogueSetFuta extends DialogueStep {
    /**
     * @constructor
     * @param {string|array<string>} girl
     * @param {boolean} boolean
     */
    constructor(girl, boolean) {
        super("SetFuta");
        this.girl = girl;
        this.boolean = boolean || false;
    }

    /**
     * @method play
     * @memberOf DialogueSetFuta
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            if (typeof this.girl === "object") {
                for (let girl of this.girl) {
                    GAME.girl.getGirl(girl).setFuta(this.boolean);
                }
            } else {
                GAME.girl.getGirl(this.girl).setFuta(this.boolean);
            }
            resolve();
        });
    }
}

class DialogueEquipClothes extends DialogueStep {
    /**
     * @constructor
     * @param {string} girl
     * @param {string} clothes
     * @param {boolean} [force=false]
     */
    constructor(girl, clothes, force) {
        super("EquipClothes");
        this.girl = girl;
        this.clothes = clothes;
        this.force = force;
    }

    /**
     * @method play
     * @memberOf DialogueSetFuta
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.girl.getGirl(this.girl).equipClothes(this.clothes, this.force);
            resolve();
        });
    }
}

class DialogueSetClothesStyle extends DialogueStep {
    /**
     * @constructor
     * @param {string} girl
     * @param {string|boolean} style
     * @param {string} clothes
     */
    constructor(girl, style, clothes) {
        super("EquipClothes");
        this.girl = girl;
        this.style = style;
        this.clothes = clothes;
    }

    /**
     * @method play
     * @memberOf DialogueSetFuta
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            if (this.clothes) {
                GAME.clothes.getClothes(this.clothes).setStyle(this.style);
            } else {
                GAME.girl.getGirl(this.girl).getClothes().setStyle(this.style);
            }
            resolve();
        });
    }
}

class DialogueCumOn extends DialogueStep {
    /**
     * @constructor
     * @param {string|array<string>} girl
     * @param {GirlManager.bodyPart} bodyPart
     * @param {number} [amount=1]
     */
    constructor(girl, bodyPart, amount) {
        super("CumOn");

        this.girl = girl;
        this.bodyPart = bodyPart;
        this.amount = amount || 1;
    }

    /**
     * @method play
     * @memberOf DialogueCumOn
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            if (typeof this.girl === "object") {
                for (let girl of this.girl) {
                    GAME.girl.getGirl(girl).cumOn(this.bodyPart, this.amount);
                }
            } else {
                GAME.girl.getGirl(this.girl).cumOn(this.bodyPart, this.amount);
            }
            resolve();
        });
    }
}

class DialogueBukkake extends DialogueStep {
    /**
     * @constructor
     * @param {string|array<string>} girl
     */
    constructor(girl) {
        super("Bukkake");

        this.girl = girl;
    }

    /**
     * @method play
     * @memberOf DialogueBukkake
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            if (typeof this.girl === "object") {
                for (let girl of this.girl) {
                    GAME.girl.getGirl(girl).bukkake();
                }
            } else {
                GAME.girl.getGirl(this.girl).bukkake();
            }
            resolve();
        });
    }
}

class DialogueSwitchMap extends DialogueStep {
    /**
     * @constructor
     * @param {string} mapID
     */
    constructor(mapID) {
        super("SwitchMap");

        this.mapID = mapID;
    }

    /**
     * @method play
     * @memberOf DialogueSwitchMap
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.map.switchMap(this.mapID, true);
            resolve();
        });
    }
}

class DialoguePlayAnimation extends DialogueStep {
    /**
     * @constructor
     * @param {string} animationID
     */
    constructor(animationID) {
        super("PlayAnimation");
        this.animationID = animationID;
    }

    /**
     * @method play
     * @memberOf DialoguePlayAnimation
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.animation.playAnimation(this.animationID).then(() => {
                resolve();
            })
        });
    }
}

class DialogueBossBattle extends DialogueStep {
    /**
     * @constructor
     * @param {string} id
     * @param {string} difficulty
     */
    constructor(id, difficulty) {
        super("DialogueBossBattle");
        this.id = id;
        this.difficulty = difficulty;

        this.returnAnswer(true);
    }

    /**
     * @method play
     * @memberOf DialogueBossBattle
     * @instance
     * @returns {Promise<boolean>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.boss.startBossBattle(this.id, this.difficulty).then((answer) => {
                resolve(answer);
            });
        });
    }
}

class DialogueBattle extends DialogueStep {
    /**
     * @constructor
     * @param {Battle} BATTLE
     */
    constructor(BATTLE) {
        super("DialogueBattle");

        this.battle = BATTLE;

        this.returnAnswer(true);
    }

    /**
     * @method play
     * @memberOf DialogueBattle
     * @instance
     * @returns {Promise<boolean>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.battle.startBattle(this.battle).then((answer) => {
                resolve(answer);
            })
        });
    }
}

class DialogueReturn extends DialogueStep {
    /**
     * @constructor
     * @param {*} value
     */
    constructor(value) {
        super("Return");
        this.value = value;
    }

    /**
     * @method play
     * @memberOf DialogueReturn
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            resolve(this.value);
        });
    }
}

class DialogueReturnLastAnswer extends DialogueStep {
    /**
     * @constructor
     * @param {*} scope
     */
    constructor(scope) {
        super("Return");
        this.scope = scope;
    }

    /**
     * @method play
     * @memberOf DialogueReturnLastAnswer
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            resolve(this.scope.getLastAnswer());
        });
    }
}

class DialoguePatreonPopUp extends DialogueStep {
    /**
     * @constructor
     */
    constructor(endOfGame) {
        super("PatreonPopUp");
        this.endOfGame = endOfGame || false;
    }

    /**
     * @method play
     * @memberOf DialogueReturnLastAnswer
     * @instance
     * @returns {Promise<*>}
     */
    play() {
        return new Promise((resolve) => {
            GAME.patreonPopUp(this.endOfGame).then(resolve);
        });
    }
}

class Branch {
    /**
     * @constructor
     * @param id
     * @returns {Branch}
     */
    constructor(id) {
        this.id = id;
        this._PARENT = false;
        this._TREE = false;
        this.branches = {};
        this.leaves = [];
        this.questionAnswers = {};
        this.parameter = {};

        return this;
    }

    _setTree(tree) {
        this._TREE = tree;
        return this;
    }

    /**
     * @method getTree
     * @memberOf Branch
     * @instance
     * @returns {{}}
     */
    getTree() {
        return this._TREE;
    }

    _setParent(parent) {
        this._PARENT = parent;
        return this;
    }

    /**
     * @method getParent
     * @memberOf Branch
     * @instance
     * @returns {{}}
     */
    getParent() {
        return this._PARENT;
    }

    /**
     * @method addBranch
     * @memberOf Branch
     * @instance
     * @param {string} branchID
     * @returns {Branch}
     */
    addBranch(branchID) {
        let branch = new Branch(branchID)._setParent(this)._setTree(this.getTree());

        this.branches[branch.getID()] = branch;
        this.branches[branch.getID()]._setParent(this);
        this.branches[branch.getID()]._setTree(this);

        return this.branches[branch.getID()];
    }

    /**
     * @method getBranch
     * @memberOf Branch
     * @instance
     * @param branchID
     * @returns {Branch}
     */
    getBranch(branchID) {
        return this.branches[branchID];
    }

    /**
     * @method getBranches
     * @memberOf Branch
     * @instance
     * @returns {{Branch}}
     */
    getBranches() {
        return this.branches;
    }

    /**
     * @method getID
     * @memberOf Branch
     * @instance
     * @returns {string}
     */
    getID() {
        return this.id;
    }

    /**
     * @method getLeaves
     * @memberOf Branch
     * @instance
     * @param [index]
     * @returns {Array<DialogueStep>|boolean}
     */
    getLeaves(index) {
        if (index || index === 0) {
            if (typeof this.leaves[index] !== "undefined") {
                return this.leaves[index];
            } else {
                return false;
            }
        } else {
            return this.leaves;
        }
    }

    /**
     * @method removeLeaf
     * @memberOf Branch
     * @instance
     * @param {integer} index
     * @returns {Branch}
     */
    removeLeaf(index) {
        Phaser.Utils.Array.RemoveAt(this.leaves, index);
        return this;
    }

    /**
     * @method removeLeavesBetween
     * @memberOf Branch
     * @instance
     * @param {integer} startIndex
     * @param {integer} endIndex
     * @returns {Branch}
     */
    removeLeavesBetween(startIndex, endIndex) {
        Phaser.Utils.Array.RemoveBetween(this.leaves, startIndex, endIndex);
        return this;
    }

    /**
     * @method talk
     * @memberOf Branch
     * @instance
     * @param {string} character
     * @param {string} text
     * @param {string} [emotion="Neutral"]
     * @param {number} [duration] - How fast the text moves
     * @param {integer} [index]
     * @returns {Branch}
     */
    talk(character, text, emotion, duration, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueTalk(character, text, emotion, duration)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueTalk(character, text, emotion, duration)._setParent(this));
        }

        return this;
    }

    /**
     * @method question
     * @memberOf Branch
     * @instance
     * @param {Array<string>} answers
     * @param {boolean} [exit=false]
     * @param {string} [text]
     * @param {string} [character]
     * @param {integer} [index]
     * @returns {Branch}
     */
    question(answers, exit, text, character, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueQuestion(answers, exit, text, character)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueQuestion(answers, exit, text, character)._setParent(this));
        }

        return this;
    }

    /**
     * @method QuestPicker
     * @memberOf Branch
     * @instance
     * @param {string} mapKey
     * @param {string} [text]
     * @param {string} [character]
     * @param {boolean} [greet=false]
     * @param {integer} [index]
     * @returns {Branch}
     */
    QuestPicker(mapKey, text, character, greet, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueQuestPicker(mapKey, text, character, greet)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueQuestPicker(mapKey, text, character, greet)._setParent(this));
        }

        return this;
    }

    /**
     * @method setAnswer
     * @memberOf Branch
     * @instance
     * @param {number} step
     * @param {number} answer
     * @returns {Branch}
     */
    setAnswer(step, answer) {
        this.questionAnswers[step] = answer;
        return this;
    }

    /**
     * @method getAnswers
     * @memberOf Branch
     * @instance
     * @param {number} step
     * @returns {number}
     */
    getAnswers(step) {
        if (step) {
            return this.questionAnswers[step];
        } else {
            return this.questionAnswers;
        }
    }

    /**
     * @method getLastAnswer
     * @memberOf Branch
     * @instance
     * @param {number} [skipAnswers=0] - If there are 3 answers, you can get the 3rd answer by passing 2 in this variable
     * @returns {number}
     */
    getLastAnswer(skipAnswers) {
        skipAnswers = skipAnswers || 0;
        return this.questionAnswers[Object.keys(this.questionAnswers)[Object.keys(this.questionAnswers).length - 1 - skipAnswers]];
    }

    /**
     * @method getParameter
     * @memberOf Branch
     * @instance
     * @returns {*}
     */
    getParameter() {
        return this.parameter;
    }

    /**
     * @method SwitchDialogue
     * @memberOf Branch
     * @instance
     * @param {string} id
     * @param {string} branchID
     * @param {integer} [index]
     * @returns {Branch}
     */
    SwitchDialogue(id, branchID, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSwitchDialogue(id, branchID)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSwitchDialogue(id, branchID)._setParent(this));
        }

        return this;
    }

    /**
     * @method SwitchBranch
     * @memberOf Branch
     * @instance
     * @param {string} branchID
     * @param {integer} [index]
     * @returns {Branch}
     */
    SwitchBranch(branchID, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSwitchBranch(branchID)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSwitchBranch(branchID)._setParent(this));
        }

        return this;
    }

    /**
     * Callback answer gets saved into answers
     * @method Function
     * @memberOf Branch
     * @instance
     * @param {function} callback - Must return a promise
     * @param {integer} [index]
     * @returns {Branch}
     */
    Function(callback, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueFunction(callback)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueFunction(callback)._setParent(this));
        }

        return this;
    }

    /**
     * @method setBackground
     * @memberOf Branch
     * @instance
     * @param {string|boolean} [key]
     * @param {integer} [index]
     * @returns {Branch}
     */
    setBackground(key, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSetBackground(key)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSetBackground(key)._setParent(this));
        }

        return this;
    }

    /**
     * @method removeBackground
     * @memberOf Branch
     * @instance
     * @param {integer} [index]
     * @returns {Branch}
     */
    removeBackground(index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSetBackground('nullPixel')._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSetBackground('nullPixel')._setParent(this));
        }

        return this;
    }

    /**
     * @method ifLastAnswer
     * @memberOf Branch
     * @instance
     * @param {*} answer
     * @param {string} branchID
     * @param {string} [dialogueID]
     * @param {number} [skipAnswers=0] - If there are 3 answers, you can get the 3rd answer by passing 3 in this variable
     * @param {integer} [index]
     * @returns {Branch}
     */
    ifLastAnswer(answer, branchID, dialogueID, skipAnswers, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueifLastAnswer(this, answer, branchID, dialogueID)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueifLastAnswer(this, answer, branchID, dialogueID)._setParent(this));
        }

        return this;
    }

    /**
     * @method ifAnswersAtStep
     * @memberOf Branch
     * @instance
     * @param {number} step
     * @param {*} answer
     * @param {string} branchID
     * @param {string} [dialogueID]
     * @param {integer} [index]
     * @returns {Branch}
     */
    ifAnswerAtStep(step, answer, branchID, dialogueID, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueifAnswerAtStep(this, step, answer, branchID, dialogueID)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueifAnswerAtStep(this, step, answer, branchID, dialogueID)._setParent(this));
        }

        return this;
    }

    /**
     * @method Fade
     * @memberOf Branch
     * @instance
     * @param {number} [delay=1000]
     * @param {integer} [index]
     * @returns {Branch}
     */
    Fade(delay, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueFade(delay)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueFade(delay)._setParent(this));
        }

        return this;
    }

    /**
     * @method Flash
     * @memberOf Branch
     * @instance
     * @param {integer} [index]
     * @returns {Branch}
     */
    Flash(index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueFlash()._setParent(this), index);
        } else {
            this.leaves.push(new DialogueFlash()._setParent(this));
        }

        return this;
    }

    /**
     * @method popUp
     * @memberOf Branch
     * @instance
     * @param {string} text
     * @param {boolean} [type=false] - True = Yes/No, False = Okay
     * @param {integer} [index]
     * @returns {Branch}
     */
    popUp(text, type, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialoguePopUp(text, type)._setParent(this), index);
        } else {
            this.leaves.push(new DialoguePopUp(text, type)._setParent(this));
        }

        return this;
    }

    /**
     * @method completeQuest
     * @memberOf Branch
     * @instance
     * @param {string} questID
     * @param {string} subquestID
     * @param {*} [onCompleteParameter]
     * @param {integer} [index]
     * @returns {Branch}
     */
    completeQuest(questID, subquestID, onCompleteParameter, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueCompleteQuest(questID, subquestID, onCompleteParameter)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueCompleteQuest(questID, subquestID, onCompleteParameter)._setParent(this));
        }

        return this;
    }

    /**
     * @method setNaked
     * @memberOf Branch
     * @instance
     * @param {string|Array<string>} girl - Girl ID or Array of IDs
     * @param {boolean} boolean - Clothes on or off
     * @param {integer} [index]
     * @returns {Branch}
     */
    setNaked(girl, boolean, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSetNaked(girl, boolean)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSetNaked(girl, boolean)._setParent(this));
        }

        return this;
    }

    /**
     * @method setFuta
     * @memberOf Branch
     * @instance
     * @param {string|Array<string>} girl - Girl ID or Array of IDs
     * @param {boolean} boolean - Futa on or off
     * @param {integer} [index]
     * @returns {Branch}
     */
    setFuta(girl, boolean, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSetFuta(girl, boolean)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSetFuta(girl, boolean)._setParent(this));
        }

        return this;
    }

    /**
     * @method equipClothes
     * @memberOf Branch
     * @instance
     * @param {string} girl - Girl ID
     * @param {string} clothes - Clothes ID
     * @param {boolean} [force=false] - Force the clothes on
     * @param {integer} [index]
     * @returns {Branch}
     */
    equipClothes(girl, clothes, force, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueEquipClothes(girl, clothes, force)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueEquipClothes(girl, clothes, force)._setParent(this));
        }

        return this;
    }

    /**
     * @method setClothesStyle
     * @memberOf Branch
     * @instance
     * @param {string} girl - Girl ID
     * @param {string|boolean} style - Style ID
     * @param {string} [clothes] - Clothes ID if you want to change the style of non-equipped clothes
     * @param {integer} [index]
     * @returns {Branch}
     */
    setClothesStyle(girl, style, clothes, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSetClothesStyle(girl, style, clothes)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSetClothesStyle(girl, style, clothes)._setParent(this));
        }

        return this;
    }

    /**
     * @method cumOn
     * @memberOf Branch
     * @instance
     * @param {string|Array<string>} girl - Girl ID or Array of IDs
     * @param {GirlManager.bodyPart} bodyPart
     * @param {number} [amount=1]
     * @param {integer} [index]
     * @returns {Branch}
     */
    cumOn(girl, bodyPart, amount, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueCumOn(girl, bodyPart, amount)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueCumOn(girl, bodyPart, amount)._setParent(this));
        }

        return this;
    }

    /**
     * @method bukkake
     * @memberOf Branch
     * @instance
     * @param {string|Array<string>} girl - Girl ID or Array of IDs
     * @param {integer} [index]
     * @returns {Branch}
     */
    bukkake(girl, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueBukkake(girl)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueBukkake(girl)._setParent(this));
        }

        return this;
    }

    /**
     * @method switchMap
     * @memberOf Branch
     * @instance
     * @param {string} mapID
     * @param {integer} [index]
     * @returns {Branch}
     */
    switchMap(mapID, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueSwitchMap(mapID)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueSwitchMap(mapID)._setParent(this));
        }

        return this;
    }

    /**
     * @method playAnimation
     * @memberOf Branch
     * @instance
     * @param {string} animationID
     * @param {integer} [index]
     * @returns {Branch}
     */
    playAnimation(animationID, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialoguePlayAnimation(animationID)._setParent(this), index);
        } else {
            this.leaves.push(new DialoguePlayAnimation(animationID)._setParent(this));
        }

        return this;
    }

    /**
     * @method battle
     * @memberOf Branch
     * @instance
     * @param {Battle} BATTLE
     * @param {integer} [index]
     */
    battle(BATTLE, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueBattle(BATTLE)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueBattle(BATTLE)._setParent(this));
        }

        return this;
    }

    /**
     * @method bossBattle
     * @memberOf Branch
     * @instance
     * @param {string} bossID
     * @param {string} bossDifficulty
     * @param {integer} [index]
     * @returns {Branch}
     */
    bossBattle(bossID, bossDifficulty, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueBossBattle(bossID, bossDifficulty)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueBossBattle(bossID, bossDifficulty)._setParent(this));
        }

        return this;
    }

    /**
     * @method return
     * @memberOf Branch
     * @instance
     * @param {*} value
     * @param {integer} [index]
     * @returns {Branch}
     */
    return(value, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueReturn(value)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueReturn(value)._setParent(this));
        }

        return this;
    }

    /**
     * @method returnLastAnswer
     * @memberOf Branch
     * @instance
     * @param {integer} [index]
     * @returns {Branch}
     */
    returnLastAnswer(index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialogueReturnLastAnswer(this)._setParent(this), index);
        } else {
            this.leaves.push(new DialogueReturnLastAnswer(this)._setParent(this));
        }

        return this;
    }

    /**
     * @method patreonPopUp
     * @memberOf Branch
     * @instance
     * @param {boolean] [endOfGame=false]
     * @param {integer} [index]
     * @returns {Branch}
     */
    patreonPopUp(endOfGame, index) {
        if (index || index === 0) {
            Phaser.Utils.Array.AddAt(this.leaves, new DialoguePatreonPopUp(endOfGame, this)._setParent(this), index);
        } else {
            this.leaves.push(new DialoguePatreonPopUp(endOfGame, this)._setParent(this));
        }

        return this;
    }


    /**
     * @method play
     * @memberOf Branch
     * @instance
     * @param {*} parameter
     * @returns {Promise<any>}
     */
    play(parameter) {
        this.questionAnswers = {};
        if (parameter) {
            this.parameter = parameter;
        } else {
            this.parameter = this.getTree().parameter;
        }
        return new Promise((resolve) => {
            let step = 0;

            let nextStep = (step) => {
                if (GAME.debugDialogue === true) {
                    console.log(this.getLeaves(step));
                }
                if (this.getLeaves(step) !== false) {
                    this.getLeaves(step).play().then((answer) => {
                        if (this.getLeaves(step).getReturnAnswer() === true) {
                            this.setAnswer(step, answer);
                        }
                        // If the leaf is a return or ifLastAnswer has an answer
                        if (this.getLeaves(step).getType() === "Return") {
                            resolve(answer);
                        } else if (this.getLeaves(step).getType() === "ifLastAnswer" || this.getLeaves(step).getType() === "ifAnswerAtStep") {
                            if (answer !== undefined) {
                                resolve(answer);

                            } else {
                                nextStep(step + 1);
                            }
                        } else {
                            nextStep(step + 1);
                        }
                    });
                } else {
                    resolve();
                }
            };

            nextStep(step);
        });
    }

    /**
     * @method playBranch
     * @memberOf Branch
     * @instance
     * @param {string} branchID
     * @param {integer} [index]
     * @returns {Promise<any>}
     */
    playBranch(branchID, index) {
        return new Promise((resolve) => {
            this.getBranch(branchID).play(index).then((answer) => {
                resolve(answer);
            });
        });
    }
}