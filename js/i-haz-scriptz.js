/* globals Konva */

/*
    This file is part of DigDes.

    Copyright (C) 2017 Emil Hemdal <opensource+digdes@hemdal.se>

    DigDes is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    DigDes is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with DigDes.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var startOrientation = window.orientation;

var width = window.innerWidth;
var height = window.innerHeight;

var tween = null;

function addStar(layer, stage) {
    var scale = Math.random();

    var star = new Konva.Star({
        x: Math.random() * stage.getWidth(),
        y: Math.random() * stage.getHeight(),
        numPoints: 5,
        innerRadius: 30,
        outerRadius: 50,
        fill: '#89b717',
        opacity: 0.8,
        draggable: true,
        scale: {
            x : scale,
            y : scale
        },
        rotation: Math.random() * 180,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {
            x : 5,
            y : 5
        },
        shadowOpacity: 0.6,
        // custom attribute
        startScale: scale,
        lastX: 0,
        lastY: 0
    });

    layer.add(star);
}

function addSquare(layer, stage, x, y, width, height) {
    var line = new Konva.Line({
        x: x,
        y: y,
        points: [0, 0, width, 0, width, height, 0, height, 0, 0],
        stroke: 'red',
        draggable: false
    });

    layer.add(line);
}
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var staticLayer = new Konva.Layer();
var dynamicLayer = new Konva.Layer();
var dragLayer = new Konva.Layer();

var size = 50;

for(var n = 0; n < 7; n++) {
    for(var m = 0; m <= n; m++) {
        addSquare(staticLayer, stage, m*size, n*size, size, size);
    }
}


for(var n = 0; n < 30; n++) {
    addStar(dynamicLayer, stage);
}

stage.add(staticLayer, dynamicLayer, dragLayer);

dynamicLayer.on('dragstart', function(evt) {
    var shape = evt.target;
    // moving to another layer will improve dragging performance
    shape.moveTo(dragLayer);
    stage.draw();

    if (tween) {
        tween.pause();
    }

    shape.setAttr('lastX', shape.getAttr('x'));
    shape.setAttr('lastY', shape.getAttr('y'));

    shape.setAttrs({
        shadowOffset: {
            x: 15,
            y: 15
        },
        scale: {
            x: shape.getAttr('startScale') * 1.2,
            y: shape.getAttr('startScale') * 1.2
        }
    });
});

dragLayer.on('dragend', function(evt) {
    var shape = evt.target;
    shape.moveTo(dynamicLayer);
    stage.draw();
    shape.to({
        duration: (stage.getWidth() < 400 ? 0 : 0.5),
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: shape.getAttr('startScale'),
        scaleY: shape.getAttr('startScale'),
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        //x: shape.getAttr('lastX'),
        //y: shape.getAttr('lastY')
        x: (shape.getAttr('x') <= 0 ? 25 : Math.round((shape.getAttr('x') - size / 2) / size) * size + size / 2),
        y: (shape.getAttr('y') <= 0 ? 25 : Math.round((shape.getAttr('y') - size / 2) / size) * size + size / 2)
    });
});

window.addEventListener('orientationchange', function() {
    if(window.orientation != startOrientation) {
        alert('You rotated your device! It\'s not supported therefore you have to rotate back or reload the page to get a valid view!'); // jshint ignore:line
    }
}, false);
