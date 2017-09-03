import {$, C, rndInt, updateNeighbours, cellIsFree} from './helpers';
import Player from "./Player";

export default class Dungeon {
    constructor(side) {
        this.player = new Player();
        this.side = side;        // length of side (room is square)
        this.cells = 0;          // minimal amount of free cells you can move within
        this.exit = {};          // exit coordinates and its state
        this.chunks = [];        // chunks of space to interconnect
        this.actionHistory = []; // action text holder
    }

    initialize() {
        const holder = $(".holder");
        for (let i = 0; i < this.side * this.side; i++) {
            const e = C();
            e.className = "cell fade";
            // generating id in `x-y` format
            e.id = `c${Math.floor(i % this.side)}-${Math.floor(i / this.side)}`;
            holder.appendChild(e);
        }
    };

    buildNewRoom(cells) {

        /* 'cells' is the number of "free cells" we want to have in the the room
        * Free cells are generated by 'chunks' and then connected by tunnels / passages */

        /*  keep generating chunks until we have enough space to finish the room */
        while (document.querySelectorAll(".free").length <= cells) this.generateChunks();

        start:
            for (let x = 0; x < 20; x++) {
                for (let y = 0; y < 20; y++) {
                    if ([...$(`#c${x}-${y}`).classList].indexOf('free') >= 0) {
                        $(`#c${x}-${y}`).className = ("cell player");
                        this.player.x = x;
                        this.player.y = y;
                        break start;
                    }
                }
            }

        finish:
            for (let x = 19; x >= 0; x--) {
                for (let y = 19; y >= 0; y--) {
                    if ([...$(`#c${x}-${y}`).classList].indexOf('free') >= 0) {
                        $(`#c${x}-${y}`).classList.add("finish");
                        this.exit.x = x;
                        this.exit.y = y;
                        break finish;
                    }
                }
            }
        for (let r = 0; r < this.chunks.length - 1; r++) {
            Dungeon.buildHorizontalTunnel(this.chunks[r].cx, this.chunks[r + 1].cx, this.chunks[r].cy);
            Dungeon.buildVerticalTunnel(this.chunks[r].cy, this.chunks[r + 1].cy, this.chunks[r + 1].cx);
        }

        this.cells = document.querySelectorAll(".free").length;
        this.player.movePlayerTo(this.player.x, this.player.y);
        updateNeighbours(this.player.x, this.player.y);
    };

    generateChunks() {

        /* minimal side length of a chunk is 3 cells */
        let w = Math.floor(Math.random() * 4) + 3;
        let h = Math.floor(Math.random() * 4) + 3;

        /* chunks of cells must have an odd width and height to get the proper center */
        if (!(w % 2)) w += 1;
        if (!(h % 2)) h += 1;

        /* randomly position a chunk of cells in a room, overlapping is allowed */
        let x = Math.floor(Math.random() * (this.side - 1 - w)) + 1;
        let y = Math.floor(Math.random() * (this.side - 1 - h)) + 1;
        for (let i = y; i < y + h; i++) {
            for (let j = x; j < x + w; j++) {
                $(`#c${j}-${i}`).classList.add("free");
            }
        }

        /* adding chunk center position to chunks array to build tunnels later on */
        this.chunks.push({cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2)});
    };

    static buildHorizontalTunnel(x1, x2, y) {
        let fromX = Math.min(x1, x2);
        let toX = Math.max(x1, x2);
        for (let x = fromX; x <= toX; x++) {
            $(`#c${x}-${y}`).classList.add("free")
        }
    };

    static buildVerticalTunnel(y1, y2, x) {
        let fromY = Math.min(y1, y2);
        let toY = Math.max(y1, y2);
        for (let y = fromY; y <= toY; y++) {
            $(`#c${x}-${y}`).classList.add("free")
        }
    };

    populateRoom() {
        let itemNumber = Math.floor(this.cells / 20);
        while (itemNumber) {
            const x = rndInt(2, this.side - 2);
            const y = rndInt(2, this.side - 2);
            if (cellIsFree(x, y)) {
                const cell = $(`#c${x}-${y}`);
                Math.random() <= 0.75 ? cell.classList.add("item"): cell.classList.add("enemy");
                cell.classList.remove("free");
                itemNumber--;
            }
        }
    }



}
