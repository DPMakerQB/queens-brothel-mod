/**
 * @typedef Phaser.Scene
 * @class MenuManager
 */
class MenuManager {
    constructor() {
        this._menus = {}
    }

    init() {
        this.newDay = false;
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.newDay === true) {
                GAME.newDay();
            }
        });
    }

    preload() {
        this.menu = this.add.group();
    }

    create(data) {
        data.optional_parameter = data.optional_parameter || null;
        this.scene.bringToTop();

        this.startMenu(data.menuName, data.optional_parameter);
    }

    startMenu(menuName, optional_parameter) {
        if (this.getMenu(menuName) === false) {
            this.closeMenu();
            return null;
        }
        this.getMenu(menuName).call(this, optional_parameter);
    }

    /**
     * @method switchMenu
     * @memberOf MenuManager
     * @instance
     * @param {string} menuName
     * @param [optional_parameter]
     */
    switchMenu(menuName, optional_parameter) {
        this.menu.destroy(true, true);
        this.startMenu(menuName, optional_parameter);
    }

    /**
     * Closes the currently opened menu
     * @method closeMenu
     * @memberOf MenuManager
     * @instance
     */
    closeMenu() {
        this.menu.destroy(true);
        this.scene.stop()
    }

    /**
     * Returns the function of the given menu
     * @method getMenu
     * @memberOf MenuManager
     * @instance
     * @param {string} menuName
     * @returns {boolean|function}
     */
    getMenu(menuName) {
        if (this._menus.hasOwnProperty(menuName)) {
            return this._menus[menuName];
        } else {
            return false;
        }
    }

    /**
     * Adds a function to the given menu
     * @method addMenu
     * @memberOf MenuManager
     * @instance
     * @param {string} menuName
     * @param {function} callback
     * @example
     * myMod.menu.addMenu('myMenu', function () {
     *     let menu = this.menu;
     *
     *     menu.create(0, 0, 'HouseBackground').setOrigin(0);
     *
     *     menu.create(20, 1060, 'exit')
     *         .setOrigin(0, 1)
     *         .button()
     *         .on('pointerup', () =>{
     *             this.closeMenu();
     *         });)
     * }
     */
    addMenu(menuName, callback) {
        this._menus[menuName] = callback;
    }

    /**
     * @method removeMenu
     * @memberOf MenuManager
     * @instance
     * @param {string} menuName
     */
    removeMenu(menuName) {
        delete this._menus[menuName];
    }

    /**
     * If you want to progress to a new day after the menu closes
     * @method newDay
     * @memberOf MenuManager
     * @instance
     * @param {boolean} boolean
     */
    newDay(boolean) {
        this._menuScene.newDay = boolean;
    }
}

/**
 * Starts the menu scene and opens the given menu
 * @param {string} menuName
 * @param [optional_parameter]
 * @returns {Promise<any>}
 */
MenuManager.prototype.openMenu = function (menuName, optional_parameter) {
    return new Promise((resolve) => {
        game.scene.start('Menu', {pauseAllScenes: true, menuName: menuName, optional_parameter: optional_parameter});
        game.scene.getScene('Menu').events.once('shutdown', () => {
            GAME.createMap().then(resolve);
        })
    });
};