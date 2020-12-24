/**
 * @typedef AnimationManager.animationConfig
 * @property {string} ID
 * @property {number} frameRate
 * @property {function|array} frames - Pass the createFrames function or a completed Phaser frames array into this parameter
 * @property {string} extension - The file extension for the images
 */

/**
 * @typedef AnimationManager.galleryObject
 * @property {string} thumbnail - The texture key of the thumbnail that is going to be used in the gallery, usually the first frame of the animation
 * @property {'Animation'|'Image'} type - The type of animation. Either a still "Image" or an "Animation"
 * @property {string} animationID - The animation ID for playing the animation
 */

/**
 * This class will let you handle all of the sex scenes
 * @class AnimationManager
 */
class AnimationManager {
    constructor() {
        this._animations = {};
        this._gallery = [];
    }

    /**
     * @method createAnimation
     * @memberOf AnimationManager
     * @instance
     * @param {AnimationManager.animationConfig} config
     * @example
     * // 27 frame animation. QueenThroatdefault00000 to QueenThroatdefault00026
     * GAME.animation.createAnimation({
     *     ID: "QueenThroatdefault",
     *     frameRate: 24,
     *     frames: () => {
     *          GAME.animation.createFrames('QueenThroatdefault', 0, 13, 5);
     *     }
     * });
     * @example
     * // Only one image in animation
     * GAME.animation.createAnimation({
     *     ID: "townFuckQuest3",
     *     frameRate: 1,
     *     frames: [{key: "townFuckQuest3"}]
     * }
     * @example
     * // Only two images in animation
     * GAME.animation.createAnimation({
     *     ID: "forestBeastQuest1",
     *     frameRate: 1,
     *     frames: [{key: 'forestBeastQuest1'}, {key: 'forestBeastQuest2'}]
     * }
     */
    createAnimation(config) {
        this._animations[config.ID] = {};
        this._animations[config.ID].ID = config.ID;
        this._animations[config.ID].frameRate = config.frameRate;
        this._animations[config.ID].extension = config.extension || ".jpg";

        if (typeof config.frames === "function") {
            this._animations[config.ID].frames = config.frames();
        } else {
            this._animations[config.ID].frames = config.frames;
        }
    }

    /**
     * Returns an animation object that Phaser can use
     * @method getAnimation
     * @memberOf AnimationManager
     * @instance
     * @param {string} animationID
     * @return {object}
     */
    getAnimation(animationID) {
        if (this._animations.hasOwnProperty(animationID)) {

            return {
                ID: this._animations[animationID].ID,
                key: 'video',
                repeat: -1,
                frameRate: this._animations[animationID].frameRate,
                frames: this._animations[animationID].frames,
                extension: this._animations[animationID].extension
            };
        } else {
            return false;
        }
    }

    /**
     * @method getAllAnimations
     * @memberOf AnimationManager
     * @instance
     * @returns {Array<AnimationManager.animationConfig>}
     */
    getAllAnimations() {
        let array = [];

        for (let animation in this._animations) {
            array.push(this._animations[animation]);
        }

        return array;
    }

    /**
     * Launches the animation scene and plays the animation. Returns a promise so don't forget to resolve it
     * @method playAnimation
     * @memberOf AnimationManager
     * @instance
     * @param {string} animationID
     * @return {Promise<any>}
     */
    playAnimation(animationID) {
        return new Promise((resolve) => {
            game.scene.start('PlayVideo', {pauseAllScenes: true, video: animationID});
            game.scene.getScene('PlayVideo').events.once('shutdown', () => {
                resolve();
            });
        });
    }

    /**
     * Creates the frames array for the animation
     * @method createFrames
     * @memberOf AnimationManager
     * @instance
     * @param {string} animationID
     * @param {number} start - The starting frame of the animation, usually 0
     * @param {number} stop - The stopping frame of the animation. For example QueenThroatdefault ends on frame 26
     * @param {number} [pad=5] - Padding is how many 0s there are in the picture files. For example QueenThroatdefault00001 has 5 padding.
     * @return {Array}
     */
    createFrames(animationID, start, stop, pad) {
        pad = pad || 5;
        let frames = [];
        for (start; start <= stop; start++) {
            frames.push({key: animationID + start.toString().padStart(pad, "0")});
        }
        return frames;
    }


    /**
     * Returns an array of available gallery animations
     * @method getGallery
     * @memberOf AnimationManager
     * @instance
     * @return {Array}
     */
    getGallery() {
        let gallery = [];
        for (let i in this._gallery) {
            let array = this._gallery[i]();

            for (let obj in array) {
                gallery.push(array[obj]);
            }
        }
        return gallery;
    }

    /**
     * Add a function that returns an array of {@link AnimationManager.galleryObject}
     * @method addToGallery
     * @memberOf AnimationManager
     * @instance
     * @param {function} callback - Function must return an array
     */
    addToGallery(callback) {
        this._gallery.push(callback);
    }

    /**
     * The game's animations. Use this as a template for your own animations
     * @method _initAnimations
     * @memberOf AnimationManager
     * @instance
     * @private
     */
    _initAnimations() {
        // Brothel animations
        (() => {
            // Throat
            this.createAnimation({
                ID: 'QueenThroatdefault',
                frameRate: 24,
                frames: this.createFrames('QueenThroatdefault', 0, 13, 5)
            });
            this.createAnimation({
                ID: 'SukiThroatdefault',
                frameRate: 24,
                frames: this.createFrames('SukiThroatdefault', 0, 12, 5)
            });
            this.createAnimation({
                ID: 'EsxeaThroatdefault',
                frameRate: 24,
                frames: this.createFrames('EsxeaThroatdefault', 0, 23, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ScarlettThroatdefault',
                frameRate: 24,
                frames: this.createFrames('ScarlettThroatdefault', 0, 23, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ArduraThroatdefault',
                frameRate: 24,
                frames: this.createFrames('ArduraThroatdefault', 0, 23, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'NatashaThroatdefault',
                frameRate: 24,
                frames: this.createFrames('NatashaThroatdefault', 0, 23, 5),
                extension: ".webp"
            });

            // Tits
            this.createAnimation({
                ID: 'QueenTitsdefault',
                frameRate: 24,
                frames: this.createFrames('QueenTitsdefault', 0, 15, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'SukiTitsdefault',
                frameRate: 24,
                frames: this.createFrames('SukiTitsdefault', 0, 15, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'EsxeaTitsdefault',
                frameRate: 24,
                frames: this.createFrames('EsxeaTitsdefault', 0, 15, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ScarlettTitsdefault',
                frameRate: 24,
                frames: this.createFrames('ScarlettTitsdefault', 0, 15, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ArduraTitsdefault',
                frameRate: 24,
                frames: this.createFrames('ArduraTitsdefault', 0, 15, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'NatashaTitsdefault',
                frameRate: 24,
                frames: this.createFrames('NatashaTitsdefault', 0, 15, 5),
                extension: ".webp"
            });

            // Pussy
            this.createAnimation({
                ID: 'QueenPussydefault',
                frameRate: 24,
                frames: this.createFrames('QueenPussydefault', 0, 12, 5)
            });
            this.createAnimation({
                ID: 'SukiPussydefault',
                frameRate: 24,
                frames: this.createFrames('SukiPussydefault', 0, 15, 5)
            });
            this.createAnimation({
                ID: 'EsxeaPussydefault',
                frameRate: 24,
                frames: this.createFrames('EsxeaPussydefault', 0, 14, 5)
            });
            this.createAnimation({
                ID: 'ScarlettPussydefault',
                frameRate: 24,
                frames: this.createFrames('ScarlettPussydefault', 0, 18, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ArduraPussydefault',
                frameRate: 24,
                frames: this.createFrames('ArduraPussydefault', 0, 18, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'NatashaPussydefault',
                frameRate: 24,
                frames: this.createFrames('NatashaPussydefault', 0, 18, 5),
                extension: ".webp"
            });

            // Anal
            this.createAnimation({
                ID: 'QueenAnaldefault',
                frameRate: 24,
                frames: this.createFrames('QueenAnaldefault', 0, 18, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'SukiAnaldefault',
                frameRate: 24,
                frames: this.createFrames('SukiAnaldefault', 0, 14, 5)
            });
            this.createAnimation({
                ID: 'EsxeaAnaldefault',
                frameRate: 24,
                frames: this.createFrames('EsxeaAnaldefault', 0, 17, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ScarlettAnaldefault',
                frameRate: 24,
                frames: this.createFrames('ScarlettAnaldefault', 0, 17, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'ArduraAnaldefault',
                frameRate: 24,
                frames: this.createFrames('ArduraAnaldefault', 0, 17, 5),
                extension: ".webp"
            });
            this.createAnimation({
                ID: 'NatashaAnaldefault',
                frameRate: 24,
                frames: this.createFrames('NatashaAnaldefault', 0, 17, 5),
                extension: ".webp"
            });
        })();

        this.createAnimation({
            ID: 'battleNullImage',
            frameRate: 1,
            frames: [{key: 'battleNullImage'}]
        });
        this.createAnimation({
            ID: 'QueenFreeBlowjobs',
            frameRate: 1,
            frames: [{key: 'QueenFreeBlowjobs'}]
        });

        this.createAnimation({
            ID: 'QueenAssGrab',
            frameRate: 1,
            frames: [{key: 'QueenAssGrab'}]
        });
        this.createAnimation({
            ID: 'QueenLeonAlphaBlack',
            frameRate: 1,
            frames: [{key: 'QueenLeonAlphaBlack'}]
        });
        // this.createAnimation({
        //     ID: 'QueenHandsdefault',
        //     frameRate: 24,
        //     frames: this.createFrames('QueenHandsdefault', 0, 15, 5)
        // });
        this.createAnimation({
            ID: 'QueenDanielMilk',
            frameRate: 1,
            frames: [{key: 'QueenDanielMilk'}]
        });
        this.createAnimation({
            ID: 'SukiDanielCum',
            frameRate: 1,
            frames: [{key: 'SukiDanielCum'}]
        });
        this.createAnimation({
            ID: 'SukiPrincipalThighs',
            frameRate: 1,
            frames: [{key: 'SukiPrincipalThighs'}]
        });
        this.createAnimation({
            ID: 'SukiSpitroastOrcs',
            frameRate: 1,
            frames: [{key: 'SukiSpitroastOrcs'}]
        });
        this.createAnimation({
            ID: 'SukiClassFuck',
            frameRate: 1,
            frames: [{key: 'SukiClassFuck'}]
        });

        this.createAnimation({
            ID: 'SukiHandsdefault',
            frameRate: 24,
            frames: this.createFrames('SukiHandsdefault', 0, 13, 5)
        });


        this.createAnimation({
            ID: 'QueenNirvokkDoggy',
            frameRate: 1,
            frames: [{key: 'QueenNirvokkDoggy'}]
        });
        this.createAnimation({
            ID: 'forestBeastPussy',
            frameRate: 24,
            frames: this.createFrames('forestBeastPussy', 0, 12, 5)
        });
        this.createAnimation({
            ID: 'forestBeastThroat',
            frameRate: 24,
            frames: this.createFrames('forestBeastThroat', 0, 13, 5)
        });
        // this.createAnimation({
        //     ID: 'goblinBossPussy',
        //     frameRate: 24,
        //     frames: this.createFrames('goblinBossPussy', 0, 13, 5)
        // });
        this.createAnimation({
            ID: 'ScarlettPeasantsMilk',
            frameRate: 1,
            frames: [{key: 'ScarlettPeasantsMilk'}]
        });
        // this.createAnimation({
        //     ID: 'kingsQuestBossFuckMilk',
        //     frameRate: 24,
        //     frames: this.createFrames('kingsQuestBossFuckMilk', 0, 18, 5)
        // });
        // this.createAnimation({
        //     ID: 'kingsQuestBossSuck',
        //     frameRate: 24,
        //     frames: this.createFrames('kingsQuestBossSuck', 0, 16, 5)
        // });
        // this.createAnimation({
        //     ID: 'ScarlettAnaldefaultCum',
        //     frameRate: 24,
        //     frames: this.createFrames('ScarlettAnaldefaultCum', 0, 75, 5)
        // });
        this.createAnimation({
            ID: 'ScarlettGuardAnalCum',
            frameRate: 1,
            frames: [{key: 'ScarlettGuardAnalCum'}]
        });
        this.createAnimation({
            ID: 'QueenOrcBattle',
            frameRate: 1,
            frames: [{key: 'QueenOrcBattle'}]
        });
        this.createAnimation({
            ID: 'EsxeaTied',
            frameRate: 1,
            frames: [{key: 'EsxeaTied'}]
        });
        this.createAnimation({
            ID: 'EsxeaPondFuck',
            frameRate: 1,
            frames: [{key: 'EsxeaPondFuck'}]
        });
        this.createAnimation({
            ID: 'MorassInnGangbang',
            frameRate: 1,
            frames: [{key: 'MorassInnGangbang'}]
        });
        this.createAnimation({
            ID: 'ScarlettBigTits',
            frameRate: 1,
            frames: [{key: 'ScarlettBigTits'}]
        });
        this.createAnimation({
            ID: 'SukiFutaCum',
            frameRate: 1,
            frames: [{key: 'SukiFutaCum'}]
        });
        this.createAnimation({
            ID: 'SukiFutaNoCum',
            frameRate: 1,
            frames: [{key: 'SukiFutaNoCum'}]
        });
        this.createAnimation({
            ID: 'AriettaSeduce',
            frameRate: 1,
            frames: [{key: 'AriettaSeduce'}]
        });
        this.createAnimation({
            ID: 'NatashaOrcBJ',
            frameRate: 1,
            frames: [{key: 'NatashaOrcBJ'}]
        });
        this.createAnimation({
            ID: 'SabrinaDaisyIntimidate',
            frameRate: 1,
            frames: [{key: 'SabrinaDaisyIntimidate'}]
        });
        this.createAnimation({
            ID: 'QueenBus',
            frameRate: 1,
            frames: [{key: 'QueenBus'}]
        });
        this.createAnimation({
            ID: 'SukiGoblinFeet',
            frameRate: 1,
            frames: [{key: 'SukiGoblinFeet'}]
        });
        this.createAnimation({
            ID: 'SukibusRiding',
            frameRate: 1,
            frames: [{key: 'SukibusRiding'}]
        });
        this.createAnimation({
            ID: 'LilithQueen',
            frameRate: 1,
            frames: [{key: 'LilithQueen'}]
        });
        this.createAnimation({
            ID: 'SukiMonsterTongue',
            frameRate: 1,
            frames: [{key: 'SukiMonsterTongue'}],
            extension: ".webp"
        });
        this.createAnimation({
            ID: 'NatashaFullNelson',
            frameRate: 24,
            frames: this.createFrames('NatashaFullNelson', 0, 19, 5),
            extension: ".webp"
        });
        this.createAnimation({
            ID: 'LilithNigelStab',
            frameRate: 1,
            frames: [{key: 'LilithNigelStab'}],
            extension: ".webp"
        });
        this.createAnimation({
            ID: 'ArduraMonsterTentacles',
            frameRate: 1,
            frames: [{key: 'ArduraMonsterTentacles'}],
            extension: ".webp"
        });
        this.createAnimation({
            ID: 'QueenNigelApproach',
            frameRate: 1,
            frames: [{key: 'QueenNigelApproach'}],
            extension: ".webp"
        });
        this.createAnimation({
            ID: 'QueenTentacles',
            frameRate: 1,
            frames: [{key: 'QueenTentacles'}],
            extension: ".webp"
        });
        this.createAnimation({
            ID: 'ScarlettNigelFinal',
            frameRate: 1,
            frames: [{key: 'ScarlettNigelFinal'}],
            extension: ".webp"
        });
    }

    /**
     * The game's gallery functions. Use this as a template for your own gallery conditions
     * @method _initGallery
     * @memberOf AnimationManager
     * @instance
     * @private
     */
    _initGallery() {
        this.addToGallery(function () {
            // New Game
            return [{
                thumbnail: 'QueenBus',
                type: 'Image',
                animationID: 'QueenBus'
            }];
        });
        this.addToGallery(function () {
            // Town Fuck Quest
            if (GAME.quest.isComplete('townFuckQuest', 'End') === true) {
                return [{
                    thumbnail: 'QueenFreeBlowjobs',
                    type: 'Image',
                    animationID: 'QueenFreeBlowjobs'
                }];
            }
        });
        this.addToGallery(function () {
            // AlphaBlack
            if (GAME.quest.isComplete('alphaBlack') === true) {
                return [{
                    thumbnail: 'QueenLeonAlphaBlack',
                    type: 'Image',
                    animationID: 'QueenLeonAlphaBlack'
                }];
            }
        })
        this.addToGallery(function () {
            // Town Morals
            if (GAME.quest.isComplete('townMorals') === true) {
                return [{
                    thumbnail: 'QueenAssGrab',
                    type: 'Image',
                    animationID: 'QueenAssGrab'
                }];
            }
        })
        this.addToGallery(function () {
            // Forest Beast Quest
            if (GAME.quest.isComplete('hornyBoris', 'End') === true) {
                return [{
                    thumbnail: 'QueenNirvokkDoggy',
                    type: 'Image',
                    animationID: 'QueenNirvokkDoggy'
                }, {
                    thumbnail: 'forestBeastPussy00000',
                    type: 'Animation',
                    animationID: 'forestBeastPussy'
                }, {
                    thumbnail: 'forestBeastThroat00000',
                    type: 'Animation',
                    animationID: 'forestBeastThroat'
                }];
            }
        });
        this.addToGallery(function () {
            // Suki Animations
            if (GAME.girl.Suki.isUnlocked()) {
                return [{
                    thumbnail: 'QueenDanielMilk',
                    type: 'Image',
                    animationID: 'QueenDanielMilk'
                }, {
                    thumbnail: 'SukiDanielCum',
                    type: 'Image',
                    animationID: 'SukiDanielCum'
                }]
            }
        });
        this.addToGallery(function () {
            // principalFeetQuest
            if (GAME.quest.isComplete('principalFeetQuest') === true) {
                return [{
                    thumbnail: 'SukiPrincipalThighs',
                    type: 'Image',
                    animationID: 'SukiPrincipalThighs'
                }]
            }
        });
        this.addToGallery(function () {
            // principalFeetQuest
            if (GAME.quest.isComplete('abigailCumQuest') === true) {
                return [{
                    thumbnail: 'SukiClassFuck',
                    type: 'Image',
                    animationID: 'SukiClassFuck'
                }]
            }
        });
        this.addToGallery(function () {
            // Mushroom Quest
            if (GAME.quest.isComplete('mushroomQuest') === true) {
                return [{
                    thumbnail: 'SukiHandsdefault00000',
                    type: 'Animation',
                    animationID: 'SukiHandsdefault'
                }, {
                    thumbnail: 'SukiGoblinFeet',
                    type: 'Image',
                    animationID: 'SukiGoblinFeet'
                }, {
                    thumbnail: 'MorassInnGangbang',
                    type: 'Image',
                    animationID: 'MorassInnGangbang'
                }, {
                    thumbnail: 'EsxeaPondFuck',
                    type: 'Image',
                    animationID: 'EsxeaPondFuck'
                }];
            }
        });
        this.addToGallery(function () {
            // Kings Quest
            if (GAME.quest.isComplete('kingsQuest') === true) {
                return [{
                    thumbnail: 'ScarlettPeasantsMilk',
                    type: 'Image',
                    animationID: 'ScarlettPeasantsMilk'
                }];
            }
        });
        this.addToGallery(function () {
            // Battle Orcs
            if (GAME.quest.isComplete('battleOrcs') === true) {
                return [{
                    thumbnail: 'ScarlettGuardAnalCum',
                    type: 'Image',
                    animationID: 'ScarlettGuardAnalCum'
                }, {
                    thumbnail: 'QueenOrcBattle',
                    type: 'Image',
                    animationID: 'QueenOrcBattle'
                }];
            }
        });
        this.addToGallery(function () {
            // Mountain Training
            if (GAME.quest.isComplete('mountainTraining') === true) {
                return [{
                    thumbnail: 'EsxeaTied',
                    type: 'Image',
                    animationID: 'EsxeaTied'
                }, {
                    thumbnail: 'SukiSpitroastOrcs',
                    type: 'Image',
                    animationID: 'SukiSpitroastOrcs'
                }];
            }
        });
        this.addToGallery(function () {
            // Magic
            if (GAME.quest.isComplete('magic') === true) {
                return [{
                    thumbnail: 'ScarlettBigTits',
                    type: 'Image',
                    animationID: 'ScarlettBigTits'
                }, {
                    thumbnail: 'SukiFutaNoCum',
                    type: 'Image',
                    animationID: 'SukiFutaNoCum'
                }, {
                    thumbnail: 'SukiFutaCum',
                    type: 'Image',
                    animationID: 'SukiFutaCum'
                }];
            }
        });
        this.addToGallery(function () {
            // Arietta
            if (GAME.quest.isComplete('ariettaQuest') === true) {
                return [{
                    thumbnail: 'AriettaSeduce',
                    type: 'Image',
                    animationID: 'AriettaSeduce'
                }];
            }
        });
        this.addToGallery(function () {
            // Get Books
            if (GAME.quest.isComplete('getBooks') === true) {
                return [{
                    thumbnail: 'NatashaOrcBJ',
                    type: 'Image',
                    animationID: 'NatashaOrcBJ'
                }, {
                    thumbnail: 'SabrinaDaisyIntimidate',
                    type: 'Image',
                    animationID: 'SabrinaDaisyIntimidate'
                }];
            }
        });
        this.addToGallery(function () {
            // Lilith Quest
            if (GAME.quest.isComplete('lilithQuest') === true) {
                return [{
                    thumbnail: 'SukibusRiding',
                    type: 'Image',
                    animationID: 'SukibusRiding'
                }, {
                    thumbnail: 'LilithQueen',
                    type: 'Image',
                    animationID: 'LilithQueen'
                }];
            }
        });
        this.addToGallery(function () {
            // Natasha Easthollow Anal Quest
            if (GAME.quest.isComplete('natashaEasthollowAnal') === true) {
                return [{
                    thumbnail: 'NatashaFullNelson00000',
                    type: 'Animation',
                    animationID: 'NatashaFullNelson'
                }];
            }
        });
        this.addToGallery(function () {
            // Lead to Castle
            if (GAME.quest.isComplete('leadToCastle') === true) {
                return [{
                    thumbnail: 'SukiMonsterTongue',
                    type: 'Image',
                    animationID: 'SukiMonsterTongue'
                }];
            }
        });
        this.addToGallery(function () {
            // Final Boss
            if (GAME.quest.isComplete('finalBoss') === true) {
                return [{
                    thumbnail: 'QueenNigelApproach',
                    type: 'Image',
                    animationID: 'QueenNigelApproach'
                }, {
                    thumbnail: 'ArduraMonsterTentacles',
                    type: 'Image',
                    animationID: 'ArduraMonsterTentacles'
                }, {
                    thumbnail: 'ScarlettNigelFinal',
                    type: 'Image',
                    animationID: 'ScarlettNigelFinal'
                }, {
                    thumbnail: 'QueenTentacles',
                    type: 'Image',
                    animationID: 'QueenTentacles'
                }, {
                    thumbnail: 'LilithNigelStab',
                    type: 'Image',
                    animationID: 'LilithNigelStab'
                }];
            }
        });

        // Brothel animations
        this.addToGallery(function () {
            let array = [];

            // Queen
            array.push({
                thumbnail: 'QueenTitsdefault00000',
                type: 'Animation',
                animationID: 'QueenTitsdefault'
            });
            array.push({
                thumbnail: 'QueenThroatdefault00000',
                type: 'Animation',
                animationID: 'QueenThroatdefault'
            });
            array.push({
                thumbnail: 'QueenPussydefault00000',
                type: 'Animation',
                animationID: 'QueenPussydefault'
            });
            array.push({
                thumbnail: 'QueenAnaldefault00000',
                type: 'Animation',
                animationID: 'QueenAnaldefault'
            });

            // Suki
            if (GAME.girl.getGirl('Suki').isUnlocked()) {
                array.push({
                    thumbnail: 'SukiTitsdefault00000',
                    type: 'Animation',
                    animationID: 'SukiTitsdefault'
                });
                array.push({
                    thumbnail: 'SukiPussydefault00000',
                    type: 'Animation',
                    animationID: 'SukiPussydefault'
                });
                array.push({
                    thumbnail: 'SukiThroatdefault00000',
                    type: 'Animation',
                    animationID: 'SukiThroatdefault'
                });
                array.push({
                    thumbnail: 'SukiAnaldefault00000',
                    type: 'Animation',
                    animationID: 'SukiAnaldefault'
                });
            }

            // Esxea
            if (GAME.girl.getGirl('Esxea').isUnlocked()) {
                array.push({
                    thumbnail: 'EsxeaThroatdefault00000',
                    type: 'Animation',
                    animationID: 'EsxeaThroatdefault'
                });
                array.push({
                    thumbnail: 'EsxeaTitsdefault00000',
                    type: 'Animation',
                    animationID: 'EsxeaTitsdefault'
                });
                array.push({
                    thumbnail: 'EsxeaPussydefault00000',
                    type: 'Animation',
                    animationID: 'EsxeaPussydefault'
                });
                array.push({
                    thumbnail: 'EsxeaAnaldefault00000',
                    type: 'Animation',
                    animationID: 'EsxeaAnaldefault'
                });
            }

            // Scarlett
            if (GAME.girl.getGirl('Scarlett').isUnlocked()) {
                array.push({
                    thumbnail: 'ScarlettThroatdefault00000',
                    type: 'Animation',
                    animationID: 'ScarlettThroatdefault'
                });
                array.push({
                    thumbnail: 'ScarlettTitsdefault00000',
                    type: 'Animation',
                    animationID: 'ScarlettTitsdefault'
                });
                array.push({
                    thumbnail: 'ScarlettPussydefault00000',
                    type: 'Animation',
                    animationID: 'ScarlettPussydefault'
                });
                array.push({
                    thumbnail: 'ScarlettAnaldefault00000',
                    type: 'Animation',
                    animationID: 'ScarlettAnaldefault'
                });
            }

            // Ardura
            if (GAME.girl.getGirl('Ardura').isUnlocked()) {
                array.push({
                    thumbnail: 'ArduraThroatdefault00000',
                    type: 'Animation',
                    animationID: 'ArduraThroatdefault'
                });
                array.push({
                    thumbnail: 'ArduraTitsdefault00000',
                    type: 'Animation',
                    animationID: 'ArduraTitsdefault'
                });
                array.push({
                    thumbnail: 'ArduraPussydefault00000',
                    type: 'Animation',
                    animationID: 'ArduraPussydefault'
                });
                array.push({
                    thumbnail: 'ArduraAnaldefault00000',
                    type: 'Animation',
                    animationID: 'ArduraAnaldefault'
                });
            }

            // Natasha
            if (GAME.girl.getGirl('Natasha').isUnlocked()) {
                array.push({
                    thumbnail: 'NatashaThroatdefault00000',
                    type: 'Animation',
                    animationID: 'NatashaThroatdefault'
                });
                array.push({
                    thumbnail: 'NatashaTitsdefault00000',
                    type: 'Animation',
                    animationID: 'NatashaTitsdefault'
                });
                array.push({
                    thumbnail: 'NatashaPussydefault00000',
                    type: 'Animation',
                    animationID: 'NatashaPussydefault'
                });
                array.push({
                    thumbnail: 'NatashaAnaldefault00000',
                    type: 'Animation',
                    animationID: 'NatashaAnaldefault'
                });
            }

            return array;
        })
    }
}