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

const Level = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Level ()
    {
        Phaser.Scene.call(this, { key: 'level1' });
    },

    preload: function ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.spritesheet('char', 'assets/player_spritesheet-recolor.png', { frameWidth: 56, frameHeight: 50 });
        this.load.spritesheet('robo', 'assets/bi-pedal_spritesheet.png', { frameWidth: 72, frameHeight: 79 });

        this.load.image('tiles', 'assets/tilesets/tileset-merged.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/space_station-tilesetMerged.json');
    },

    create: function ()
    {
               //  A simple background for our game
        //this.add.image(0, 0, 'sky').setOrigin(0,0);

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('space-station', 'tiles');

        map.createStaticLayer('sky', tileset, 0, -8);
        map.createStaticLayer('background', tileset, 0, -8);
        map.createStaticLayer('keycards', tileset, 0, -8);
        map.createStaticLayer('tanks', tileset, 0, -8);
    
        robo = this.add.sprite('robo');
        player = this.physics.add.sprite(40, 570, 'char');
        player.body.setSize(20, 40, 28)
        player.body.setOffset(20, 10)
        player.setCollideWorldBounds(true);

        //---------------------------------------------------Hazard Setup
        let hazardCollision_top = this.add.rectangle(424, 120, 560, 32, 0x29d911)
        let hazardCollision_bottom = this.add.rectangle(448, 592, 640, 16, 0x29d911)
        
        const walls = map.createStaticLayer('walls', tileset, 0, -8);
        const platforms = map.createStaticLayer('platforms', tileset, 0, -8);
        walls.setCollisionByExclusion(-1, true);
        platforms.setCollisionByExclusion(-1, true);
        map.createStaticLayer('foreground', tileset, 0, -8);

        this.physics.world.enable(hazardCollision_top)
        this.physics.world.enable(hazardCollision_bottom)
        hazardCollision_bottom.body.moves = false
        hazardCollision_top.body.moves = false

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
        //---------------------------------------------ENEMY PATHING


        //let enemyPath  = this.add.graphics();
        path = this.add.path(400, 66);
        path.lineTo(625, 66);
        // enemyPath.lineStyle(3, 0xffffff, 1);
        // path.draw(enemyPath);

        roboE =  this.add.follower(path, 0, 0, 'robo')
        this.physics.world.enable(roboE)
        roboE.body.setSize(60, 70, 36)
        roboE.body.setOffset(5, 9)

        roboE.startFollow({
            positionOnPath: true,
            duration: 8000,
            yoyo: true,
            loop: -1,
        });

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

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(roboE, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        
        
        this.physics.add.collider(player, walls);
        this.physics.add.collider(roboE, walls);
        this.physics.add.collider(stars, walls);
        this.physics.add.collider(bombs, walls);



        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.physics.add.collider(player, bombs, this.hitBomb, null, this);
        this.physics.add.collider(player, roboE, this.hitBomb, null, this);
        this.physics.add.collider(player, hazardCollision_bottom, this.hitBomb, null, this);
        this.physics.add.collider(player, hazardCollision_top, this.hitBomb, null, this);

       this.cameras.main.zoom = 1.5;
       this.cameras.main.startFollow(player);
       this.cameras.main.setBounds(0, 0, 800, 600);

        this.input.once('pointerdown', function () {

            this.scene.resume('menu');

        }, this);
    },

    update: function ()
    {
                //400 625
                if (roboE.x >= 625) {
                    roboE.anims.play('robo-walk', true)
                    roboE.flipX = true;
                    } else if (roboE.x <= 400) {
                        roboE.anims.play('robo-walk', true)
                        roboE.flipX = false;
                    }
            
                    if (gameOver)
                    {
                        return;
                    }
            
            
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
        this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play('die');
    
        gameOver = true;
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
            debug: true
        }
    }
};

var game = new Phaser.Game(config);
