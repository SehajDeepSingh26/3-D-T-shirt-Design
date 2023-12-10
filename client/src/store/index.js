import {proxy} from 'valtio';

const state = proxy({
    intro : true,
    color: '#EFBD48',
    isLogoTexture: true,        //^ This turns on or off the logo on the shirt
    isFullTexture: false,       //^ this turn on or off the texture of the shirt
    logoDecal: './threejs.png',
    fullDecal: './threejs.png'
});

export default state;