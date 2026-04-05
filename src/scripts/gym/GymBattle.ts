class GymBattle extends Battle {

    static gym: Gym;
    static index: KnockoutObservable<number> = ko.observable(0);
    static totalPokemons: KnockoutObservable<number> = ko.observable(0);

    static isAutoClicking: KnockoutObservable<boolean> = ko.observable(false);
    static shouldAutoClick: KnockoutObservable<boolean> = ko.observable(false);

    public static pokemonAttack() {
        if (GymRunner.running()) {
            super.pokemonAttack();
        }
    }

    public static clickAttack() {
        if (GymRunner.running()) {
            super.clickAttack();
        }
    }

    /**
     * Autoclick functionality for the lazy ones that want to keep using the mouse.
     */
    public static toggleAutoClick(isButtonAction = true) {
        if (this.isAutoClicking()) {
            this.isAutoClicking(false);
            if (this.autoClickInterval !== null) {
                clearInterval(this.autoClickInterval);
                this.autoClickInterval = null;
            }
            this.shouldAutoClick(false);
        } else {
            this.isAutoClicking(true);
            this.autoClickInterval = setInterval(() => {
                if (App.game.gameState == GameConstants.GameState.gym) {
                    GymBattle.clickAttack();
                }
            }, 50);
            this.shouldAutoClick(true);
        }
    }

    /**
     * Award the player with exp, and go to the next pokemon
     */
    public static defeatPokemon() {
        this.enemyPokemon().defeat(true);

        // Make gym "route" regionless
        App.game.breeding.progressEggsBattle(this.gym.badgeReward * 3 + 1, GameConstants.Region.none);
        this.index(this.index() + 1);

        if (this.index() >= this.gym.getPokemonList().length) {
            GymRunner.gymWon(this.gym);
        } else {
            this.generateNewEnemy();
        }
        player.lowerItemMultipliers(MultiplierDecreaser.Battle);
    }

    /**
     * Reset the counter.
     */
    public static generateNewEnemy() {
        this.counter = 0;
        this.enemyPokemon(PokemonFactory.generateGymPokemon(this.gym, this.index()));
    }

    public static pokemonsDefeatedComputable: KnockoutComputed<number> = ko.pureComputed(() => {
        return GymBattle.index();
    });

    public static pokemonsUndefeatedComputable: KnockoutComputed<number> = ko.pureComputed(() => {
        return GymBattle.totalPokemons() - GymBattle.index();
    })
}
