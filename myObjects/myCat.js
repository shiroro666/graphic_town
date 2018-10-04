var grobjects = grobjects || [];
var Cat = undefined;
var jumpCat = undefined;

(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    Cat = function Cat(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1.0;
        this.color = color || [1, 1, 1];
    }

    Cat.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        -1,0,1,  -1,0,-1,  1,0,-1,    1,0,-1,  1,0,1,  -1,0,1,
                        -1,0,1,  0,2,0,  -1,0,-1,
                        -1,0,-1,  0,2,0,  1,0,-1,
                        1,0,-1,  0,2,0,  1,0,1,
                        1,0,1,  0,2,0,  -1,0,1,
                        -1,2,1, -1,4,1, 1,4,1,    1,4,1, 1,2,1, -1,2,1,
                        1,2,1, 1,4,1, 1,4,-1,    1,4,-1, 1,2,-1, 1,2,1,
                        1,4,-1, -1,4,-1, -1,2,-1,    -1,2,-1, 1,2,-1, 1,4,-1,
                        -1,2,1, -1,4,1, -1,4,-1,    -1,4,-1, -1,2,-1, -1,2,1,
                        -1,4,-1, 1,4,-1, 1,4,1,    1,4,1, -1,4,1, -1,4,-1,
                        -1,2,-1, 1,2,-1, 1,2,1,    1,2,1, -1,2,1, -1,2,-1,
                        -1,4,1, -1/2,4.5,1, 0,4,1,    0,4,1, 1/2,4.5,1, 1,4,1,
                        0,0,-1, 0,1,-3, 0,2,-3
                    ]},
                vnormal: {
                    numComponents: 3, data: [
                        0,-1,0, 0,-1,0, 0,-1,0,    0,-1,0, 0,-1,0, 0,-1,0,
                        -2,1,0, -2,1,0, -2,1,0,
                        0,1,-2, 0,1,-2, 0,1,-2,
                        2,1,0, 2,1,0, 2,1,0,
                        0,1,2, 0,1,2, 0,1,2,
                        0,0,1, 0,0,1, 0,0,1,    0,0,1, 0,0,1, 0,0,1,
                        1,0,0, 1,0,0, 1,0,0,    1,0,0, 1,0,0, 1,0,0,
                        0,0,-1, 0,0,-1, 0,0,-1,    0,0,-1, 0,0,-1, 0,0,-1,
                        -1,0,0, -1,0,0, -1,0,0,    -1,0,0, -1,0,0, -1,0,0,
                        0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                        0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                        0,0,1, 0,0,1, 0,0,1,    0,0,1, 0,0,1, 0,0,1,
                        0,0,1, 0,0,1, 0,0,1
                    ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Cat.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cat.prototype.center = function(drawingState) {
        return this.position;
    }

    jumpCat = function jumpCat(name, position, size, color, speed) {
        Cat.apply(this,arguments);
        this.speed = speed || 0.1;
    }
    jumpCat.prototype = Object.create(Cat.prototype);
    jumpCat.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var temp = Number(drawingState.realtime * this.speed)%200.0;
        if(temp < 100) this.position[1] += temp/100;
        else this.position[1] += (200-temp)/100;
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        if(temp < 100) this.position[1] -= temp/100;
        else this.position[1] -= (200-temp)/100;
    };
    jumpCat.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new jumpCat("c1",[0,0,0],0.5,[0,1,1],0.2));
grobjects.push(new Cat("c2",[0,0,3],0.3,[1,1,0]));