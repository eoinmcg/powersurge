export default class Swiper {
    constructor() {
        if (!Swiper.instance) {
            Swiper.instance = this;
            this.init();
        }
        return Swiper.instance;
    }


    init() {
        console.log('INIT SWIPER');

        document.addEventListener('touchstart', (e) => {
            this.touchStart(e);
        }, false);
        document.addEventListener('touchmove', (e) => {
            this.touchMove(e);
        }, false);

        document.addEventListener('touchend', (e) => {
            this.touchEnd(e);
        }, false);

        this.clear();
    }

    touchStart(e) {
        this.active = true;
        let t = e.touches[0];
        this.start.x = t.clientX;
        this.start.y = t.clientY;
    }


    touchMove(e) {
        let t = e.touches[0];
        this.last.x = t.clientX;
        this.last.y = t.clientY;
    }

    touchEnd() {
        let dir = null;
        let x = this.start.x - this.last.x;
        let y = this.start.y - this.last.y;

        let travel = null;

        if (Math.abs(x) > Math.abs(y)) {
            travel = this.getTravel(this.start.x, this.last.x);
            dir = (travel > 0) ? 'left' : 'right';
        } else {
            travel = this.getTravel(this.start.y, this.last.y);
            dir = (travel > 0) ? 'up' : 'down';
        }

        if (Math.abs(travel) < 20 || (!this.last.x || !this.last.y)) {
            dir = 'x';
        }

        this.dir = dir;
        console.log(dir, travel, this.start, this.last);

    }

    clear() {
        this.start = {x: null, y: null }
        this.last = {x: null, y: null }
        this.dir = null;
    }

    getTravel(a, b) {
        return a - b;
    }

};
