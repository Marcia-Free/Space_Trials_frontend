const MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'menu' });

        this.pic;
    },

    preload: function ()
    {
        this.load.image("button-bg", "assets/button-bg.png");
        this.load.image("button-text", "assets/button-text.png");
    },

    create: function ()
    {
        playButton = this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "button-bg"
        );
        // .setDepth(1);

        let text = this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "button-text"
        );

        var container = this.add.container(0, 0).setDepth(1);

        container.add(playButton);
        container.add(text);

        playButton.setInteractive();

        playButton.once(
            "pointerup",
            function () {
                playButton.visible = false;
                text.visible = false;
                    this.scene.pause();
                    this.scene.launch('level1');
                //console.log(this);
            },
            this
        );


        // this.pic = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);

        // this.input.once('pointerup', function () {

        //     this.scene.pause();
        //     this.scene.launch('level1');

        // }, this);

        // this.events.on('pause', function () {
        //     console.log('Main Menu paused');
        // })

        // this.events.on('resume', function () {
        //     console.log('Main Menu resumed');
        // })
    },

    update: function ()
    {
       // this.pic.rotation += 0.01;
    }

});

const UI = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UI ()
    {
        Phaser.Scene.call(this, { key: 'ui' });
    },

    preload: function ()
    {
;
    },

    create: function ()
    {
        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "24px",
            fill: "#000",
        });


        // this.pic = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);

        // this.input.once('pointerup', function () {

        //     this.scene.pause();
        //     this.scene.launch('level1');

        // }, this);

        // this.events.on('pause', function () {
        //     console.log('Main Menu paused');
        // })

        // this.events.on('resume', function () {
        //     console.log('Main Menu resumed');
        // })
    },

    update: function ()
    {
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

            this.data.set("score", score);

            var text = this.add.text(player.x + 30, player.y + 30, "", {
                fontSize: "35px",
                fill: "#00ff00",
                fontFamily: "Arial",
            });

            text.setText(["SCORE: " + this.data.get("score")]);
            scoreText.visible = false;
        }

         //  Add and update the score
        score += 10;
        scoreText.setText("Score: " + score);

    }

});

const Level = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Level ()
    {
        Phaser.Scene.call(this, { key: 'level1' });
    },

    preload: function ()
    {
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.spritesheet('char', 'assets/spritesheets/entities/player_spritesheet-recolor.png', { frameWidth: 56, frameHeight: 50 });
        this.load.spritesheet('robo', 'assets/spritesheets/entities/bi-pedal_spritesheet.png', { frameWidth: 72, frameHeight: 79 });
        this.load.spritesheet('blob', 'assets/spritesheets/entities/blob_spritesheet.png', { frameWidth: 64, frameHeight: 47 });
        this.load.spritesheet('bug', 'assets/spritesheets/entities/bug_spritesheet.png', { frameWidth: 70, frameHeight: 41 });

        this.load.spritesheet('keycard', 'assets/spritesheets/objects/keycards.png', { frameWidth: 16, frameHeight: 16, endFrame: 47 });
        this.load.spritesheet('laser', 'assets/spritesheets/objects/electro barrier.png', { frameWidth: 48, frameHeight: 16, endFrame: 5 });
        
        this.load.image('tiles', 'assets/tilesets/tileset-merged.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/space_station-tilesetMerged.json');
    },

    create: function ()
    {
        //this.add.image(0, 0, 'sky').setOrigin(0,0);

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('space-station', 'tiles', 16,16, 0,0);

        map.createLayer('sky', tileset, 0, -8);
        map.createLayer('background', tileset, 0, -8);
        map.createLayer('keycards', tileset, 0, -8);
        map.createLayer('tanks', tileset, 0, -8);

        robo = this.add.sprite('robo');
        blob = this.add.sprite('blob');
        bug = this.add.sprite('bug');

        blob2 = this.physics.add.sprite(287, 230,'blob');

        player = this.physics.add.sprite(40, 570, 'char');
        player.body.setSize(20, 40, 28)
        player.body.setOffset(20, 10)
        player.setCollideWorldBounds(true);

        //---------------------------------------------------Hazard Setup
        let hazardCollision_top = this.add.rectangle(424, 120, 560, 32, 0x29d911)
        let hazardCollision_bottom = this.add.rectangle(448, 592, 640, 16, 0x29d911)
        
        const walls = map.createLayer('walls', tileset, 0, -8);
        const platforms = map.createLayer('platforms', tileset, 0, -8);
        walls.setCollisionByExclusion(-1, true);
        platforms.setCollisionByExclusion(-1, true);
        map.createLayer('foreground', tileset, 0, -8);

        this.physics.world.enable(hazardCollision_top)
        this.physics.world.enable(hazardCollision_bottom)
        hazardCollision_bottom.body.moves = false
        hazardCollision_top.body.moves = false

        key = this.physics.add.sprite(275, 380, 'keycard');
        key.body.moves = false

        laser = this.physics.add.sprite(167, 320, 'laser');
        laser.body.moves = false

        //------------Hazard Glow
        this.tweens.add
        ({
            targets: hazardCollision_top,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add
        ({
            targets: hazardCollision_bottom,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

    this.enemyPaths()

    this.createAnimations()
    




        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        stars = this.physics.add.group({
            key: 'star',
            repeat: 4,
            setXY: { x: 12, y: 0, stepX: 100 }
        });

        stars.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));

        });

        bombs = this.physics.add.group();

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '24px', fill: '#000' });

    this.startColliders(platforms, walls, hazardCollision_bottom, hazardCollision_bottom)
        

       //this.cameras.main.zoom = 1.5;
       //this.cameras.main.startFollow(player);
       this.cameras.main.setBounds(0, 0, 800, 600);

        this.input.once('pointerdown', function () {

            this.scene.resume('menu');

        }, this);
    },

    update: function ()
    {
        key.anims.play('key-rotate', true)
        laser.anims.play('laser1', true)

    this.playerMove()
    this.enemyAnim()
    },

    
    createAnimations() {
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('char', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('char', { start: 4, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'crouch',
            frames: this.anims.generateFrameNumbers('char', { start: 16, end: 18 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('char', { start: 31, end: 38 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('char', { start: 39, end: 42 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'robo-walk',
            frames: this.anims.generateFrameNumbers('robo', { start: 0, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'blob-walk',
            frames: this.anims.generateFrameNumbers('blob', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'blob-attack',
            frames: this.anims.generateFrameNumbers('blob', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'bug-walk',
            frames: this.anims.generateFrameNumbers('bug', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'key-rotate',
            frames: this.anims.generateFrameNumbers('keycard', { start: 8, end: 15 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'laser1',
            frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'laser2',
            frames: this.anims.generateFrameNumbers('laser', { start: 3, end: 5 }),
            frameRate: 15,
            repeat: -1
        });
    },
    startColliders(platforms, walls, hazardCollision_top, hazardCollision_bottom) {
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

        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(stars, walls);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(bombs, walls);



        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.physics.add.collider(player, bombs, this.hitBomb, null, this);
        this.physics.add.collider(player, roboE, this.hitBomb, null, this);
        this.physics.add.collider(player, blob1, this.hitBomb, null, this);
        this.physics.add.collider(player, blob2, this.hitBomb, null, this);
        this.physics.add.collider(player, bug1, this.hitBomb, null, this);
        this.physics.add.collider(player, bug2, this.hitBomb, null, this);
        this.physics.add.collider(player, bug3, this.hitBomb, null, this);

        this.physics.add.collider(player, hazardCollision_bottom, this.hitBomb, null, this);
        this.physics.add.collider(player, hazardCollision_top, this.hitBomb, null, this);
    },

    collectStar (player, star)
    {
        star.disableBody(true, true);

        //  Add and update the score
        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            let bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    },
    hitBomb (player, bomb)
    {
        gameOver = true;
        player.setTint(0xff0000);
        player.anims.play('die');
        this.physics.pause();
        
        this.time.delayedCall(800, this.playerDeath, [], this);
    },

    
    playerDeath() {
        this.scene.pause()
        this.scene.start('menu') 
        gameOver = false;  
    },
    playerMove() {
    if(!gameOver) {
        if (cursors.left.isDown) 
        {
            player.body.setVelocityX(-160);
            player.body.onFloor() && player.anims.play('run', true) && this.playerCollider('default')
            player.flipX = true;

            lastKeyPress = 'left';
            animationPlayed = false;
        }
        else if (cursors.right.isDown)
        {
            player.body.setVelocityX(160);
            player.body.onFloor() && player.anims.play('run', true) && this.playerCollider('default')
            player.flipX = false;

            lastKeyPress = 'right';
            animationPlayed = false;
        }
        else if (cursors.down.isDown)
        {
            
            if (animationPlayed == false && player.body.onFloor())
            {
                animationPlayed = true;
                player.anims.play('crouch') && this.playerCollider('crouch')
            }
            player.body.setVelocityX(0);
        }
        else 
        {
            if (lastKeyPress === 'left' && player.body.onFloor()) 
            {   
                player.anims.play('idle', true) && this.playerCollider('default')
            }
            else if (lastKeyPress === 'right' && player.body.onFloor())
            {
                player.anims.play('idle', true) && this.playerCollider('default')
            }
            else
            {
                    player.anims.play('jump', true)
            }
            player.body.setVelocityX(0);
        }

        if (cursors.space.isDown && player.body.onFloor())
        {
            player.body.setVelocityY(-330);
            player.anims.play('jump', true) && this.playerCollider('jump')
            animationPlayed = false;
            
        }
    }
    },
    playerCollider (animationKey) {
        switch(animationKey) 
        {
            default:
            player.body.setSize(20, 40, 28)
            player.body.setOffset(20, 10) 
                break;
            case 'jump':
                player.body.setSize(20, 25, 28)
                break;
            case 'crouch':
                player.body.setSize(20, 30, 28)
                player.body.setOffset(20, 20)
                break;
        }
    },

    
    enemyPaths () {
   let enemyPath  = this.add.graphics();
   enemyPath.lineStyle(3, 0xffffff, 1);

   // path.draw(enemyPath);
//------------------BLOB1----------------------
   blob1Path = this.add.path(640, 275);
   blob1Path.lineTo(775, 275);
   
   blob1 =  this.add.follower(blob1Path, 0, 0, 'blob')
   this.physics.world.enable(blob1)
   blob1.body.setSize(50, 45, 32)
   blob1.body.setOffset(8, 0)

   blob1.startFollow
   ({
       positionOnPath: true,
       duration: 12000,
       yoyo: true,
       loop: -1,
   });
//------------------BLOB2----------------------
   blob2.body.setSize(50, 45, 32)
   blob2.body.setOffset(8, 0)
//-------------------BUG1----------------------

bug1Path = this.add.path(630, 350);
bug1Path.splineTo([ 766,347, 754,447, 688,413, 642,411, 575,480, 515,456, 562,439]);

bug1 =  this.add.follower(bug1Path, 0, 0, 'bug')
this.physics.world.enable(bug1)
bug1.setScale(.75)
bug1.body.moves = false
bug1.setSize(1/2)
bug1.body.setSize(30, 30, 45)
bug1.body.setOffset(20, 5)

bug1.startFollow
({
    positionOnPath: true,
    duration: 14000,
    rotateToPath: true,
    rotationOffset: -90,
    ease: 'Sine.easeInOut',
    yoyo: true,
    loop: -1,
});
//-------------------BUG2----------------------

bug2Path = this.add.path(450, 165);
bug2Path.splineTo([ 590, 250, 475, 340, 490, 470]);

bug2 =  this.add.follower(bug2Path, 0, 0, 'bug')
this.physics.world.enable(bug2)
bug2.setScale(.75)
bug2.body.moves = false
bug2.setSize(1/2)
bug2.body.setSize(30, 30, 45)
bug2.body.setOffset(20, 5)

bug2.startFollow
({
    positionOnPath: true,
    duration: 12000,
    rotateToPath: true,
    rotationOffset: -90,
    ease: 'Sine.easeInOut',
    yoyo: true,
    loop: -1,
});
//-------------------BUG3----------------------
bug3Path = this.add.path(776, 554);
bug3Path.splineTo([ 639, 535, 552, 560, 451, 546]);

bug3 =  this.add.follower(bug3Path, 0, 0, 'bug')
this.physics.world.enable(bug3)
bug3.setScale(.75)
bug3.body.moves = false
bug3.setSize(1/2)
bug3.body.setSize(30, 30, 45)
bug3.body.setOffset(20, 5)

bug3.startFollow
({
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
   
   roboE =  this.add.follower(roboPath, 0, 0, 'robo')
   this.physics.world.enable(roboE)
   roboE.body.setSize(60, 70, 36)
   roboE.body.setOffset(5, 9)

   roboE.startFollow
   ({
       positionOnPath: true,
       duration: 8000,
       yoyo: true,
       loop: -1,
   });

    },
    enemyAnim() {
    //400 625
    if (roboE.x >= 625) 
    {
        roboE.anims.play('robo-walk', true)
        roboE.flipX = true;
    } 
    else if (roboE.x <= 400) 
    {
        roboE.anims.play('robo-walk', true)
        roboE.flipX = false;
    }

    //640 775
    if (blob1.x >= 775) 
    {
        blob1.anims.play('blob-walk', true)
        blob1.flipX = true;
    } 
    else if (blob1.x <= 640) 
    {
        blob1.anims.play('blob-walk', true)
        blob1.flipX = false;
    }

    blob2.anims.play('blob-walk', true)
    bug1.anims.play('bug-walk', true)
    bug2.anims.play('bug-walk', true)
    bug3.anims.play('bug-walk', true)




    }



});

let player;
let stars;
let bombs;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;
let stateText;
let gameStart = true;
let lastKeyPress = 'right';
let animationPlayed = false;
let playButton;


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#27174a',
    scene: [ MainMenu, Level ],
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            gravity: { y: 600 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
