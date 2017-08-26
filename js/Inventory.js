import {$} from "./helpers";
import {game} from "./index";

export default class Inventory {
    constructor() {
        this.slots = 30;
        this.visible =false
    }

    toggle() {
        if (this.visible) {
            this.visible = false;
            document.body.removeChild($(".inventory"));
            return;
        }
        const inv = document.createElement('div');
        inv.className = "inventory";

        game.player.loot.forEach(item => {
            const image = require(`../images/${item.slot}.png`);
            const e = document.createElement('div');
            e.className = "inventory-object";
            e.style.backgroundColor = item.color;
            e.style.backgroundImage = `url("${image}")`;
            inv.appendChild(e);
        });
        document.body.appendChild(inv);
        this.visible = true;
    }
}