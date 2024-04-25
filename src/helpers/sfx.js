import zzfx from "../lib/zzfx";
import sounds from '../data/sounds.js';

function sfx(key) {

    zzfx(...sounds[key])
}
export default sfx;


