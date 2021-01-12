const URL = "https://shielded-mountain-86289.herokuapp.com/users";

let button = document.createElement("button");

const top10 = () => {
    button.id = "back-button";
    button.textContent = "PLAY AGAIN";

    let div = document.querySelector(".login");
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    table.innerHTML = `<tr>
            <th scope="col">#</th>
            <th scope="col">User</th>
            <th scope="col">Score</th>
            </tr>
            </thead>`;
    generalFetch(URL).then((users) => {
        i = 0;
        users.forEach((user) => {
            i++;
            tbody.innerHTML += `<tr> 
                <th>${i}</th>
                <th>${user.user_name}</th>
                <th>${user.high_score}</th>
            </tr>`;
        });
    });
    div.innerHTML = "";
    table.append(tbody);
    div.append(table);
    div.append(button);
};
const table = (user) => {
    let tr = document.createElement("tr");
};

const generalFetch = (url, options = {}) => {
    return fetch(url, options).then((res) => res.json());
};

const makeOptions = (method, body = {}) => {
    return {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
};

const MainMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function MainMenu() {
        Phaser.Scene.call(this, { key: "menu" });

        this.pic;
    },

    preload: function () {
        this.load.audio("landing_music", "assets/sounds/Cactusdude - 11pm.mp3");

        // this.load.image("button-bg", "assets/button-bg.png");
        this.load.image("button-text", "assets/play_game_button-test.png");
        this.load.image("title_screen", "assets/title_screen-darker.png");
        this.load.image("button-bg", "assets/play_game_button-test.png");
        this.loadFont("pixel", "assets/fonts/PixeloidMono.ttf");
    },

    create: function () {
        this.title_music = this.sound.add("landing_music", { volume: 0.3 });
        this.title_music.setLoop(true);
        this.title_music.play();

        this.add.image(0, 0, "title_screen").setOrigin(0, 0);

        

        playButton = this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "button-bg"
        );
        playButton.setScale(.75);

        const instruction = this.add
            .text(
                384 / 3.4,
                320 * 1.7,
                "Move with arrow keys\nCrouch with Down Arrow\nJump with Spacebar\nShoot with E key",
                {
                    fontFamily: 'pixel', fontSize: 15, color: '#ffffff', align: 'left'
                }
            )
            .setOrigin(0.5);
        instruction.setLineSpacing(10);

        const Title = this.add.text(
            this.game.config.width / 7,
            this.game.config.height / 6,
            'SPACE TRIALS', {
            fontFamily: 'pixel', fontSize: 75, color: '#ffd000', align: 'center'
          })

          this.tweens.add({
            targets: Title,
            alpha: { from: 1, to: 0.5 },
            ease: 'Sine.InOut',
            duration: 1000,
            repeat: -1,
            yoyo: true
          });

        // .setDepth(1);

        let text = this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "button-text"
        );
        text.setScale(.75);

        let container = this.add.container(0, 0).setDepth(1);

        container.add(playButton);
        // container.add(text);

        playButton.setInteractive();

        playButton.once(
            "pointerup",
            function () {
                playButton.visible = false;
                text.visible = false;

                this.cameras.main.fadeOut(1000);
                this.title_music.stop();

                setTimeout(() => {
                    this.scene.pause();
                    this.scene.launch("level1");
                }, 1000);
            },
            this
        );
    },

    update: function () {},

    loadFont(name, url) {
        let newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }

});

const UI = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function UI() {
        Phaser.Scene.call(this, { key: "ui" });
    },

    preload: function () {
        this.load.html("nameform", "assets/loginform.html");
    },

    create: function () {
        element = this.add.dom(400, 600).createFromCache("nameform");
        element.setPerspective(800);

        let submit = document.getElementById("login-page").lastElementChild;
        let input = document.getElementById("login-page").firstElementChild;

        // Post req to backend to store user name and score

        submit.addEventListener("click", (e) => {
            body = {
                user_name: input.value,
                high_score: score,
            };

            button.addEventListener("click", (e) => {
                console.log(this);
                this.scene.start("menu");
            });

            generalFetch(URL, makeOptions("POST", body)).then((_response) => {
                top10();
            });
        });

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: "Power3",
        });
    },

    update: function () {
        if (gameOver) {
            input.style.display = "block";

            let textConfig = {
                fontSize: "35px",
                color: "#ff0000",
                fontFamily: "Arial",
            };
            this.add.text(
                player.x, // x axis
                player.y, // y axis
                "GAME OVER",
                textConfig
            );

            this.data.set("score", score);

            let text = this.add.text(player.x + 30, player.y + 30, "", {
                fontSize: "35px",
                fill: "#00ff00",
                fontFamily: "prstart",
            });

            text.setText(["SCORE: " + this.data.get("score")]);
            scoreText.visible = false;

            this.scene.launch("");
        }

        //  Add and update the score
        // score += 10;
        // scoreText.setText("Score: " + score);
    },
});

const Level = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Level() {
        Phaser.Scene.call(this, { key: "level1" });
    },

    preload: function () {
        this.load.audio("bgm", "assets/sounds/bgm_loop.mp3");
        this.load.audio("blast", "assets/sounds/blast.mp3");
        this.load.audio("fire", "assets/sounds/fire2.mp3");
        this.load.audio("pick_up", "assets/sounds/pick_up.mp3");
        this.load.audio("die", "assets/sounds/my-leg.mp3");

        this.load.spritesheet(
            "char",
            "assets/spritesheets/entities/player_spritesheet-recolor.png",
            { frameWidth: 56, frameHeight: 50 }
        );
        this.load.spritesheet(
            "robo",
            "assets/spritesheets/entities/bi-pedal_spritesheet.png",
            { frameWidth: 72, frameHeight: 79 }
        );
        this.load.spritesheet(
            "blob",
            "assets/spritesheets/entities/blob_spritesheet.png",
            { frameWidth: 64, frameHeight: 47 }
        );
        this.load.spritesheet(
            "bug",
            "assets/spritesheets/entities/bug_spritesheet.png",
            { frameWidth: 70, frameHeight: 41 }
        );
        this.load.spritesheet(
            "rakshan",
            "assets/spritesheets/entities/rakshan_spritesheet.png",
            { frameWidth: 70, frameHeight: 41 }
        );
        this.load.spritesheet(
            "enemy-die",
            "assets/spritesheets/entities/death_spritesheet.png",
            { frameWidth: 48, frameHeight: 48 }
        );

        this.load.image("bomb", "assets/bomb.png");
        this.load.spritesheet(
            "keycard",
            "assets/spritesheets/objects/keycards.png",
            { frameWidth: 16, frameHeight: 16, endFrame: 47 }
        );
        this.load.spritesheet(
            "laser",
            "assets/spritesheets/objects/electro barrier.png",
            { frameWidth: 48, frameHeight: 16, endFrame: 5 }
        );
        this.load.spritesheet(
            "bullet",
            "assets/spritesheets/objects/bullet_spritesheet.png",
            { frameWidth: 16, frameHeight: 10 }
        );
        this.load.spritesheet(
            "impact",
            "assets/spritesheets/objects/impact_spritesheet.png",
            { frameWidth: 16, frameHeight: 16 }
        );

        this.load.image("tiles", "assets/tilesets/tileset-merged.png");
        this.load.tilemapTiledJSON(
            "map",
            "assets/tilemaps/space_station-tilesetMerged.json"
        );
    },

    create: function () {
        this.blastSFX = this.sound.add("blast");
        this.pickUpSFX = this.sound.add("pick_up", { volume: 0.3 });
        this.fireSFX = this.sound.add("fire", { volume: 0.1 });
        this.dieSFX = this.sound.add("die", { volume: 1.5 });

        this.bgMusic = this.sound.add("bgm", { volume: 0.1 });
        this.bgMusic.setLoop(true);
        this.bgMusic.play();

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage(
            "space-station",
            "tiles",
            16,
            16,
            0,
            0
        );

        map.createLayer("sky", tileset, 0, -8);
        map.createLayer("background", tileset, 0, -8);

        robo = this.add.sprite("robo");
        blob = this.add.sprite("blob");
        bug = this.add.sprite("bug");
        rakshan = this.add.sprite("rakshan");
        death = this.add.sprite("enemy-die");

        player = this.physics.add.sprite(40, 570, "char");
        player.body.setSize(20, 40, 28);
        player.body.setOffset(20, 10);
        player.setScale(0.8);
        player.setCollideWorldBounds(true);

        //---------------------------------------------------Hazard Setup
        let hazardCollision_top = this.add.rectangle(
            424,
            120,
            560,
            25,
            0x29d911
        );
        let hazardCollision_bottom = this.add.rectangle(
            448,
            592,
            640,
            16,
            0x29d911
        );

        const walls = map.createLayer("walls", tileset, 0, -8);
        const platforms = map.createLayer("platforms", tileset, 0, -8);
        walls.setCollisionByExclusion(-1, true);
        platforms.setCollisionByExclusion(-1, true);
        map.createLayer("foreground", tileset, 0, -8);

        this.physics.world.enable(hazardCollision_top);
        this.physics.world.enable(hazardCollision_bottom);
        hazardCollision_bottom.body.moves = false;
        hazardCollision_top.body.moves = false;

        impact = this.add.sprite("impact");
        bullet = this.physics.add.sprite("bullet");
        bullet.body.setSize(10, 5, 0);
        bullet.body.setOffset(5, 2);
        bullet.active = false;
        bullet.body.reset();

        this.createLasers();
        this.time.addEvent({
            delay: 3000,
            callback: this.laserSwitch,
            callbackScope: this,
            loop: true,
        });

        //------------Hazard Glow
        this.tweens.add({
            targets: hazardCollision_top,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,

            ease: "Sine.easeInOut",
        });
        this.tweens.add({
            targets: hazardCollision_bottom,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        this.enemyPaths();
        this.createAnimations();

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        cards = this.physics.add.group();
        this.generateCards();

        bombs = this.physics.add.group();

        //  The score
        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "24px",
            fill: "#000",
        });

        this.createColliders(
            platforms,
            walls,
            hazardCollision_top,
            hazardCollision_bottom
        );

        this.cameras.main.fadeIn(1000);
        this.cameras.main.setZoom(2.0);
        this.cameras.main.startFollow(player);
        //this.cameras.main.startFollow(player, true, 0.09, 0, 0, 0);
        this.cameras.main.setBounds(0, 0, 800, 600);

        // this.input.once(
        //     "pointerdown",
        //     function () {
        //         this.scene.resume("menu");
        //     },
        //     this
        // );
    },

    update: function () {
        laser1.anims.play("laser1", true);
        laser2.anims.play("laser1", true);
        laser3.anims.play("laser1", true);

        laser4.anims.play("laser1", true);
        laser5.anims.play("laser1", true);
        laser6.anims.play("laser1", true);
        laser7.anims.play("laser1", true);

        this.playerMove();
        this.enemyAnim();
    },

    createAnimations() {
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("char", {
                start: 0,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("char", {
                start: 4,
                end: 15,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "crouch",
            frames: this.anims.generateFrameNumbers("char", {
                start: 16,
                end: 18,
            }),
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("char", {
                start: 31,
                end: 38,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "die",
            frames: this.anims.generateFrameNumbers("char", {
                start: 39,
                end: 42,
            }),
            frameRate: 10,
            hideOnComplete: true,
            repeat: 0,
        });
        this.anims.create({
            key: "player-shoot",
            frames: this.anims.generateFrameNumbers("char", {
                start: 19,
                end: 30,
            }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: "robo-walk",
            frames: this.anims.generateFrameNumbers("robo", {
                start: 0,
                end: 15,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "blob-walk",
            frames: this.anims.generateFrameNumbers("blob", {
                start: 0,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "blob-attack",
            frames: this.anims.generateFrameNumbers("blob", {
                start: 4,
                end: 6,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "bug-walk",
            frames: this.anims.generateFrameNumbers("bug", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "rakshan-walk",
            frames: this.anims.generateFrameNumbers("rakshan", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "dieE",
            frames: this.anims.generateFrameNumbers("enemy-die", {
                start: 0,
                end: 4,
            }),
            frameRate: 10,
            hideOnComplete: true,
            repeat: 0,
        });

        this.anims.create({
            key: "key-rotate-g",
            frames: this.anims.generateFrameNumbers("keycard", {
                start: 8,
                end: 15,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "key-rotate-y",
            frames: this.anims.generateFrameNumbers("keycard", {
                start: 16,
                end: 23,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "laser1",
            frames: this.anims.generateFrameNumbers("laser", {
                start: 0,
                end: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });
        this.anims.create({
            key: "laser2",
            frames: this.anims.generateFrameNumbers("laser", {
                start: 3,
                end: 5,
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: "shoot",
            frames: this.anims.generateFrameNumbers("bullet", {
                start: 0,
                end: 1,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "impactB",
            frames: this.anims.generateFrameNumbers("impact", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            hideOnComplete: true,
            repeat: 0,
        });
    },
    createLasers() {
        laser1 = this.physics.add.sprite(167, 312, "laser");
        this.laserCollision(laser1);
        laser2 = this.physics.add.sprite(87, 312, "laser");
        this.laserCollision(laser2);
        laser3 = this.physics.add.sprite(247, 312, "laser");
        this.laserCollision(laser3);

        laser4 = this.physics.add.sprite(359, 200, "laser");
        this.laserCollision(laser4, 2);
        laser5 = this.physics.add.sprite(311, 200, "laser");
        this.laserCollision(laser5, 2);
        laser6 = this.physics.add.sprite(263, 200, "laser");
        this.laserCollision(laser6, 2);
        laser7 = this.physics.add.sprite(215, 200, "laser");
        this.laserCollision(laser7, 2);
    },

    laserCollision(name, size = 1.5) {
        name.setScale(size);
        name.angle = 90;
        name.body.setSize(5, 48, 0);
        name.body.setOffset(22, -16);

        name.body.moves = false;
        collider = this.physics.add.collider(
            player,
            name,
            this.takeDamage,
            null,
            this
        );
    },
    laserSwitch() {
        if (!gameOver) {
            setTimeout(() => {
                switch (laserPower1) {
                    case true:
                        laser1.body.enable = false;
                        laser1.setActive(false).setVisible(false);
                        laser2.body.enable = false;
                        laser2.setActive(false).setVisible(false);
                        laser3.body.enable = false;
                        laser3.setActive(false).setVisible(false);

                        laserPower1 = false;
                        break;

                    case false:
                        laser1.body.enable = true;
                        laser1.setActive(true).setVisible(true);
                        laser2.body.enable = true;
                        laser2.setActive(true).setVisible(true);
                        laser3.body.enable = true;
                        laser3.setActive(true).setVisible(true);

                        laserPower1 = true;
                        break;
                }
            }, 500);

            setTimeout(() => {
                switch (laserPower2) {
                    case true:
                        laser4.body.enable = false;
                        laser4.setActive(false).setVisible(false);
                        laser5.body.enable = false;
                        laser5.setActive(false).setVisible(false);
                        laser6.body.enable = false;
                        laser6.setActive(false).setVisible(false);
                        laser7.body.enable = false;
                        laser7.setActive(false).setVisible(false);

                        laserPower2 = false;
                        break;

                    case false:
                        laser4.body.enable = true;
                        laser4.setActive(true).setVisible(true);
                        laser5.body.enable = true;
                        laser5.setActive(true).setVisible(true);
                        laser6.body.enable = true;
                        laser6.setActive(true).setVisible(true);
                        laser7.body.enable = true;
                        laser7.setActive(true).setVisible(true);

                        laserPower2 = true;
                        break;
                }
            }, 3000);
        }
    },

    createColliders(
        platforms,
        walls,
        hazardCollision_top,
        hazardCollision_bottom
    ) {
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectKey function
        this.physics.add.overlap(player, cards, this.collectKey, null, this);
        //  Collide the player and the stars with the platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, walls);
        this.physics.add.collider(roboE, platforms);
        this.physics.add.collider(roboE, walls);
        this.physics.add.collider(blob1, platforms);
        this.physics.add.collider(blob1, walls);
        this.physics.add.collider(blob2, platforms);
        this.physics.add.collider(blob2, walls);
        this.physics.add.collider(bug1, platforms);
        this.physics.add.collider(bug1, walls);
        this.physics.add.collider(bug2, platforms);
        this.physics.add.collider(bug2, walls);
        this.physics.add.collider(bug3, platforms);
        this.physics.add.collider(bug3, walls);

        this.physics.add.collider(cards, platforms);
        this.physics.add.collider(cards, walls);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(bombs, walls);

        this.physics.add.collider(walls, bullet, this.resetBullet, null, this);
        this.physics.add.collider(
            platforms,
            bullet,
            this.resetBullet,
            null,
            this
        );
        this.physics.add.collider(bombs, bullet, this.resetBullet, null, this);

        this.physics.add.collider(
            player,
            hazardCollision_bottom,
            this.takeDamage,
            null,
            this
        );
        this.physics.add.collider(
            player,
            hazardCollision_top,
            this.takeDamage,
            null,
            this
        );

        this.physics.add.collider(blob1, bullet, this.enemyHit, null, this);
        this.physics.add.collider(blob2, bullet, this.enemyHit, null, this);
        this.physics.add.collider(bug1, bullet, this.enemyHit, null, this);
        this.physics.add.collider(bug2, bullet, this.enemyHit, null, this);
        this.physics.add.collider(bug3, bullet, this.enemyHit, null, this);
        this.physics.add.collider(roboE, bullet, this.enemyHit, null, this);

        this.physics.add.collider(player, bombs, this.takeDamage, null, this);
        this.physics.add.collider(player, roboE, this.takeDamage, null, this);
        this.physics.add.collider(player, blob1, this.takeDamage, null, this);
        this.physics.add.collider(player, blob2, this.takeDamage, null, this);
        this.physics.add.collider(player, bug1, this.takeDamage, null, this);
        this.physics.add.collider(player, bug2, this.takeDamage, null, this);
        this.physics.add.collider(player, bug3, this.takeDamage, null, this);
    },
    generateCards() {
        const cardData = [
            { x: 175, y: 530 },
            { x: 784, y: 573 },
            { x: 248, y: 380 },
            { x: 384, y: 444 },
            { x: 268, y: 475 },
            { x: 23, y: 330 },
            { x: 215, y: 90 },
            { x: 264, y: 90 },
            { x: 311, y: 90 },
            { x: 113, y: 50 },
            { x: 111, y: 155 },
            { x: 158, y: 170 },
            { x: 743, y: 180 },
            { x: 558, y: 360 },
            { x: 670, y: 430 },
            { x: 545, y: 490 },
            { x: 17, y: 88 },
        ];

        for (let i = 0; i < cardData.length; i++) {
            let card = cards.create(cardData[i].x, cardData[i].y, "keycard");
        }

        cards.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
            child.anims.play("key-rotate-y", true);
        });
    },

    collectKey(player, keycard) {
        this.pickUpSFX.play();
        keycard.disableBody(true, true);

        //  Add and update the score
        score += 10;
        scoreText.setText("Score: " + score);

        if (cards.countActive(true) === 0) {
            //  A new batch of stars to collect
            cards.children.iterate(function (child) {
                child.enableBody(true, child.x, child.y, true, true);
                child.anims.play("key-rotate", true);
            });

            let x =
                player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);

            let bomb = bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    },
    takeDamage(player, bomb) {
        gameOver = true;
        player.setTint(0xff0000);
        player.body.setEnable(false);
        this.dieSFX.play();
        player.anims.play("die");
        this.physics.pause();
        this.time.delayedCall(1000, this.playerDeath, [], this);

        //       let textConfig = {
        //                 fontSize: "35px",
        //                 color: "#ff0000",
        //                 fontFamily: "Arial",
        //             };
        //             this.add.text(
        //                 player.x, // x axis
        //                 player.y, // y axis
        //                 "GAME OVER",
        //                 textConfig
        //             );
        //             this.data.set("score", score);

        //             let text = this.add.text(player.x + 30, player.y + 30, "", {
        //                 fontSize: "35px",
        //                 fill: "#00ff00",
        //                 fontFamily: "Arial",
        //             });

        //             text.setText(["SCORE: " + this.data.get("score")]);
        //             scoreText.visible = false;
    },

    playerDeath() {
        this.cameras.main.fadeOut(1000);
        this.bgMusic.stop();

        setTimeout(() => {
            this.scene.stop();
            this.scene.start("ui");
            gameOver = false;
        }, 2000);
    },
    playerMove() {
        if (!gameOver) {
            if (eKey.isDown && bullet.active === false) {
                this.fireBullet(player.x, player.y);
            }

            if (cursors.left.isDown) {
                player.body.setVelocityX(-160);
                player.body.onFloor() &&
                    player.anims.play("run", true) &&
                    this.playerCollider("default");
                player.flipX = true;

                lastKeyPress = "left";
                animationPlayed = false;
            } else if (cursors.right.isDown) {
                player.body.setVelocityX(160);
                player.body.onFloor() &&
                    player.anims.play("run", true) &&
                    this.playerCollider("default");
                player.flipX = false;

                lastKeyPress = "right";
                animationPlayed = false;
            } else if (cursors.down.isDown) {
                if (animationPlayed == false && player.body.onFloor()) {
                    animationPlayed = true;
                    player.anims.play("crouch") &&
                        this.playerCollider("crouch");
                }
                player.body.setVelocityX(0);
            } else {
                if (lastKeyPress === "left" && player.body.onFloor()) {
                    player.anims.play("idle", true) &&
                        this.playerCollider("default");
                } else if (lastKeyPress === "right" && player.body.onFloor()) {
                    player.anims.play("idle", true) &&
                        this.playerCollider("default");
                } else {
                    player.anims.play("jump", true);
                }
                player.body.setVelocityX(0);
            }
            if (cursors.space.isDown && player.body.onFloor()) {
                player.body.setVelocityY(-330);
                player.anims.play("jump", true) && this.playerCollider("jump");
                animationPlayed = false;
            }
        }
    },

    playerCollider(animationKey) {
        switch (animationKey) {
            default:
                player.body.setSize(20, 40, 28);
                player.body.setOffset(20, 10);
                break;
            case "jump":
                player.body.setSize(20, 25, 28);
                break;
            case "crouch":
                player.body.setSize(20, 30, 28);
                player.body.setOffset(20, 20);
                break;
        }
    },

    enemyPaths() {
        let enemyPath = this.add.graphics();
        enemyPath.lineStyle(3, 0xffffff, 1);

        // path.draw(enemyPath);
        //------------------BLOB1----------------------
        blob1Path = this.add.path(640, 275);
        blob1Path.lineTo(775, 275);

        blob1 = this.add.follower(blob1Path, 0, 0, "blob");
        this.physics.world.enable(blob1);
        blob1.body.setSize(50, 45, 32);
        blob1.body.setOffset(8, 0);

        blob1.startFollow({
            positionOnPath: true,
            duration: 12000,
            yoyo: true,
            loop: -1,
        });
        //------------------BLOB2----------------------
        blob2Path = this.add.path(170, 230);
        blob2Path.lineTo(390, 230);

        blob2 = this.add.follower(blob2Path, 0, 0, "blob");
        this.physics.world.enable(blob2);
        blob2.body.setSize(50, 45, 32);
        blob2.body.setOffset(8, 0);

        blob2.startFollow({
            positionOnPath: true,
            duration: 14000,
            yoyo: true,
            loop: -1,
        });
        //-------------------BUG1----------------------

        bug1Path = this.add.path(630, 350);
        bug1Path.splineTo([
            766,
            347,
            754,
            447,
            688,
            413,
            642,
            411,
            575,
            480,
            515,
            456,
            562,
            439,
        ]);

        bug1 = this.add.follower(bug1Path, 0, 0, "bug");
        this.physics.world.enable(bug1);
        bug1.setScale(0.75);
        bug1.body.setAllowGravity(false);
        bug1.body.setSize(30, 30, 45);
        bug1.body.setOffset(20, 5);

        bug1.startFollow({
            positionOnPath: true,
            duration: 14000,
            rotateToPath: true,
            rotationOffset: -90,
            ease: "Sine.easeInOut",
            yoyo: true,
            loop: -1,
        });

        //-------------------BUG2----------------------

        bug2Path = this.add.path(450, 165);
        bug2Path.splineTo([590, 250, 475, 340, 490, 470]);

        bug2 = this.add.follower(bug2Path, 0, 0, "bug");
        this.physics.world.enable(bug2);
        bug2.setScale(0.75);
        bug2.body.setAllowGravity(false);
        bug2.body.setSize(30, 30, 45);
        bug2.body.setOffset(20, 5);

        bug2.startFollow({
            positionOnPath: true,
            duration: 12000,
            rotateToPath: true,
            rotationOffset: -90,
            ease: "Sine.easeInOut",
            yoyo: true,
            loop: -1,
        });
        //-------------------BUG3----------------------
        bug3Path = this.add.path(776, 554);
        bug3Path.splineTo([639, 535, 552, 560, 451, 546]);

        bug3 = this.add.follower(bug3Path, 0, 0, "rakshan");
        this.physics.world.enable(bug3);
        bug3.setScale(0.75);
        bug3.body.setAllowGravity(false);
        bug3.body.setSize(30, 30, 45);
        bug3.body.setOffset(20, 5);

        bug3.startFollow({
            positionOnPath: true,
            duration: 8000,
            rotateToPath: true,
            rotationOffset: -90,
            yoyo: true,
            loop: -1,
        });

        //------------------ROBO----------------------
        roboPath = this.add.path(400, 66);
        roboPath.lineTo(625, 66);

        roboE = this.add.follower(roboPath, 0, 0, "robo");
        this.physics.world.enable(roboE);
        roboE.body.setSize(60, 70, 36);
        roboE.body.setOffset(5, 9);

        roboE.startFollow({
            positionOnPath: true,
            duration: 8000,
            yoyo: true,
            loop: -1,
        });
    },
    enemyAnim() {
        if (bug1.isFollowing()) {
            bug1.anims.play("bug-walk", true);
        }
        if (bug2.isFollowing()) {
            bug2.anims.play("bug-walk", true);
        }
        if (bug3.isFollowing()) {
            bug3.anims.play("rakshan-walk", true);
        }

        //400 625
        if (roboE.x >= 625) {
            roboE.anims.play("robo-walk", true);
            roboE.flipX = true;
        } else if (roboE.x <= 400) {
            roboE.anims.play("robo-walk", true);
            roboE.flipX = false;
        }

        //640 775
        if (blob1.x >= 775) {
            blob1.anims.play("blob-walk", true);
            blob1.flipX = true;
        } else if (blob1.x <= 640) {
            blob1.anims.play("blob-walk", true);
            blob1.flipX = false;
        }

        //640 775
        if (blob2.x >= 390) {
            blob2.anims.play("blob-walk", true);
            blob2.flipX = true;
        } else if (blob2.x <= 170) {
            blob2.anims.play("blob-walk", true);
            blob2.flipX = false;
        }
    },

    fireBullet(x, y) {
        bullet.body.reset(x, y);
        bullet.body.setAllowGravity(false);
        bullet.setActive(true);
        bullet.setVisible(true);

        bullet.anims.play("shoot", true);
        this.fireSFX.play();

        if (lastKeyPress === "left" && cursors.down.isDown) {
            bullet.setPosition(x - 25, y + 7);
            bullet.flipX = true;
            bullet.setVelocityX(-500);
        } else if (lastKeyPress === "left" && !cursors.down.isDown) {
            bullet.setPosition(x - 25, y - 2);
            bullet.flipX = true;
            bullet.setVelocityX(-500);
        } else if (lastKeyPress === "right" && cursors.down.isDown) {
            bullet.setPosition(x + 25, y + 7);
            bullet.flipX = false;
            bullet.setVelocityX(500);
        } else if (lastKeyPress === "right" && !cursors.down.isDown) {
            bullet.setPosition(x + 25, y - 2);
            bullet.flipX = false;
            bullet.setVelocityX(500);
        }
        setTimeout(() => {
            bullet.setActive(false);
        }, 2000);
    },

    resetBullet() {
        bullet.anims.play("impactB", false);

        setTimeout(() => {
            bullet.body.reset(player.body.x, player.body.y);
            bullet.setActive(false);
            bullet.setVisible(false);
        }, 2000);
    },

    enemyHit(enemy, bullet) {
        enemy.pauseFollow();
        enemy.setTint(0xff0000);
        enemy.clearTint();

        enemy.play("dieE", false);
        this.blastSFX.play();

        enemy.body.enable = false;

        score += 10;
        scoreText.setText("Score: " + score);

        setTimeout(() => {
            enemy.setActive(false);
            enemy.setVisible(false);
        }, 2000);
    },
});

const highScore = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function highScore() {
        Phaser.Scene.call(this, { key: "highScore" });
    },
    preload: function () {
        this.load.html("highscore", "assets/highScore.html");
    },

    create: function () {
        document.querySelector(".login").innerHTML = "";
        // element = this.add.dom(400, 600).createFromCache("highscore");
        // element.setPerspective(800);
    },
    update: function () {},
});

let player;
let cards;
let bombs;
let cursors;
let eKey;
let score = 0;
let gameOver = false;
let scoreText;
let stateText;
let gameStart = true;
let element;
let lastKeyPress = "right";
let animationPlayed = false;
let playButton;
let bullet;
let laserPower1 = true;
let laserPower2 = true;

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#27174a",
    scene: [MainMenu, Level, UI, highScore],
    parent: "login-page",
    dom: {
        createContainer: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
};

let game = new Phaser.Game(config);
