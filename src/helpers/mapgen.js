export default class Mapgen {

    constructor(config, scene, level) {

        this.level = level;
        this.tileSize = config.tileSize;
        this.screenHeightInTiles = config.height / this.tileSize;
        this.mapWidth = scene.cameras.main.width / this.tileSize;

        this.mapData = [];
        this.segments = this.getSegments();
        window.M = this;
        this.mapData = this.createMap();
        this.mapData = this.polishMap(this.mapData);
        this.mapHeight = this.mapData.length * this.tileSize;

        scene.map = scene.make.tilemap({ data: this.mapData, tileWidth: 32, tileHeight: 32 });
        this.tiles = scene.map.addTilesetImage('tiles');
        scene.mapData = this.mapData;
        scene.layer = scene.map.createLayer(0, this.tiles, 0, 0);
    }


    polishMap(data) {

        let solidTiles = [2,3,4,16,17,18,19];
        data.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) {
                    let above = (y > 0) ?  data[y-1][x] : 0;
                    data[y][x] = (solidTiles.includes(above))
                        ? 1 : 0;
                }
            })
        });

        return data;
    }


    randomTile() {
        let tile = 0;
        if (Math.random() > 0.95) {
            tile = 16;
        } else {
            tile = Math.random() > 0.8 ? 0 : 2;
        }

        return tile;
    }


    createMap() {

        let keys = Object.keys(this.segments);
        keys.push('rnd');

        if (this.level === 1) {
            keys = ['face0', 'bridge0', 'rnd'];
        } else {
            keys.splice(this.level + 1);
        }


        keys = this.shuffle(keys);
        window.keys = keys;
        console.log('KEYS: ', keys);

        let data = [];

        data = data.concat(this.insertStartSegment());
        while(keys.length > 0) {
            let segment = keys.pop();
            console.log('ADDING SEGMENT:', segment);
            data = data.concat(this.insert(segment));
        }

        data = data.concat(this.insertEndSegment());
        return data;

    }

    insert(label) {

        let data = [];
        let segment = this.segments[label];
        if (!segment) {
            this.insertRandomSegment();
        } else {
            segment.forEach((row) => {
                data.push(row);
            });
        }

        return data;
    }


    insertStartSegment() {
        let start = [];
        for (let i = 0; i < 5; i++) {
            start.push(Array(10).fill(2));
        }
        start[0] = Array(10).fill(7);

        return start;
    }


    insertRandomSegment(height = 5) {
        let data = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < this.mapWidth; x++) {
                row.push(this.randomTile());
            }
            data.push(row);
        }

        return data;
    }

    insertEndSegment() {

        let C = 17;
        let S = 16;
        let E = 18;
        let L = 19;

        const end = [
            [S,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,8,2,2,2],
        ];

        const from = this.mapData.length;
        let data = [];
        this.mapData.splice(from, end.length);
        end.forEach((row) => {
            data.push(row);
        });

        return data;

    }

    getSegments() {

        let segments = {};
        let C = 17;
        let S = 16;
        let E = 18;
        let L = 19;


        segments.face0 = [
            [2,2,2,2,2,2,2,2,2,2],
            [2,0,0,2,2,2,2,0,0,2],
            [2,0,0,2,2,2,2,0,0,2],
            [2,2,2,L,2,2,L,2,2,2],
            [2,S,2,2,2,2,2,2,S,2],
            [2,5,5,5,5,5,5,5,5,2],
            [2,2,2,2,2,2,2,2,2,2],
        ];

        segments.move0 = [
            [3,2,2,2,2,2,2,2,2,3],
            [5,5,5,5,5,5,5,5,5,5],
            [6,6,6,6,6,6,6,6,6,6],
            [2,3,2,2,2,2,2,2,3,2],
            [S,2,2,2,2,2,2,2,2,2],
            [5,5,5,5,5,5,5,5,5,5],
            [6,6,6,6,6,6,6,6,6,6],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
        ];

        segments.sparks0 = [
            [3,4,3,4,3,4,3,4,3,4],
            [4,3,4,3,4,3,4,3,4,3],
            [3,4,3,4,3,4,3,4,3,4],
            [4,3,4,3,4,3,4,3,4,3],
            [3,4,3,4,3,4,3,4,3,4],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,L,2,S,2,2,L,2,2],
        ];

        segments.sparks1 = [
            [3,4,3,4,3,4,3,4,3,4],
            [L,3,4,3,4,3,4,3,4,3],
            [3,4,3,4,3,4,3,4,3,L],
            [2,3,4,3,4,3,4,3,4,3],
            [3,4,3,4,3,4,3,4,3,2],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,L,2,S,2,2,L,2,2],
        ];

        segments.brige0 = [
            [2,2,2,2,2,2,2,2,2,2],
            [2,0,0,0,2,2,0,0,0,2],
            [2,0,0,0,2,2,0,0,0,2],
            [C,0,0,0,2,2,0,0,0,C],
            [2,0,0,0,2,2,0,0,0,2],
            [2,2,2,2,S,S,2,2,2,2],
            [2,0,0,2,2,2,2,0,0,2],
            [2,0,0,2,2,2,2,0,0,2],
            [2,2,2,2,2,2,2,2,2,2],
        ];

        segments.eye0 = [
            [2,2,2,2,2,2,2,2,2,2],
            [2,0,2,0,2,0,2,0,2,0],
            [0,2,0,2,0,2,0,2,0,2],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,2,3,2,3,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,E,2,2,2,2,E,2,2],
        ];


        segments.brige1 = [
            [L,2,2,2,2,2,2,2,2,L],
            [2,2,2,3,2,3,2,2,2,2],
            [2,0,2,0,0,0,0,2,0,2],
            [2,0,2,0,0,0,0,2,0,2],
            [2,0,L,0,0,0,0,L,0,2],
            [2,0,5,0,0,0,0,5,0,2],
            [2,0,2,0,0,0,0,2,0,2],
            [C,0,2,0,0,0,0,2,0,C],
            [2,0,2,0,0,0,0,2,0,2],
            [2,2,2,S,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
        ];

        segments.brige2 = [
            [2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2],
            [C,2,2,2,2,2,2,2,2,C],
            [2,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,2],
            [2,2,2,E,2,2,2,2,2,2],
        ];


        return segments;
    }


    shuffle(array) {
        let currentIndex = array.length;

        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;

    }
}
