let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};
let game = new Phaser.Game(config);

let player;
let stars;
let bombs;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;
let stateText;

function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet("pixel", "assets/Pixel.png", {
        frameWidth: 25,
        frameHeight: 37,
    });

    this.load.image("tiles", "assets/tilesets/tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/Level-Blockout2.json");
}

function create() {
    //  A simple background for our game
    this.add.image(0, 0, "sky").setOrigin(0, 0);

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("space-station", "tiles");

    map.createStaticLayer("background", tileset, 0, -8);

    const walls = map.createStaticLayer("walls", tileset, 0, -8);

    const platforms = map.createStaticLayer("platforms", tileset, 0, -8);

    //map.createStaticLayer('foreground', tileset, 0, -8);

    walls.setCollisionByExclusion(-1, true);
    platforms.setCollisionByExclusion(-1, true);

    player = this.physics.add.sprite(40, 570, "pixel");

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("pixel", {
            start: 0,
            end: 7,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "turn",
        frames: [{ key: "pixel", frame: 8 }],
        frameRate: 20,
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("pixel", {
            start: 9,
            end: 16,
        }),
        frameRate: 10,
        repeat: -1,
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, "score: 0", {
        fontSize: "24px",
        fill: "#000",
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, walls);
    this.physics.add.collider(stars, walls);
    this.physics.add.collider(bombs, walls);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.cameras.main.zoom = 1.5;
    this.cameras.main.startFollow(player);
}

function update() {
    if (gameOver) {
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
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);

        player.anims.play("turn");
    }

    //if (cursors.up.isDown && player.body.touching.down)
    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
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
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;
}
