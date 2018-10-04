var grobjects = grobjects || [];
var Quartz = undefined;
var spinQuartz = undefined;
var flyQuartz = undefined;

(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    Quartz = function Quarts(name, position, size) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
    }

    Quartz.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["quartz-vs", "quartz-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        0,0,0, 0,1,0, 0.25,0.25,0,    0,0,0, 0.25,0.25,0, 1,0,0,
                        0,0,0, 1,0,0, 0.25,-0.25,0,    0,0,0, 0.25,-0.25,0, 0,-1,0,
                        0,0,0, 0,-1,0, -0.25,-0.25,0,    0,0,0, -0.25,-0.25,0, -1,0,0,
                        0,0,0, -1,0,0, -0.25,0.25,0,    0,0,0, -0.25,0.25,0, 0,1,0

                    ]},

                vcolor: {
                    numComponents: 3, data: [
                        1,1,0, 1,1,0, 1,1,0,    1,0.7,0, 1,0.7,0, 1,0.7,0,
                        1,1,0, 1,1,0, 1,1,0,    1,0.7,0, 1,0.7,0, 1,0.7,0,
                        1,1,0, 1,1,0, 1,1,0,    1,0.7,0, 1,0.7,0, 1,0.7,0,
                        1,1,0, 1,1,0, 1,1,0,    1,0.7,0, 1,0.7,0, 1,0.7,0
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Quartz.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            vcolor:this.color,model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Quartz.prototype.center = function(drawingState) {
        return this.position;
    }

    spinQuartz = function spinQuartz(name, position, size) {
        Quartz.apply(this,arguments);
    }
    spinQuartz.prototype = Object.create(Quartz.prototype);
    spinQuartz.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        twgl.m4.rotateY(modelM, theta, modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            vcolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    spinQuartz.prototype.center = function(drawingState) {
        return this.position;
    }

    flyQuartz = function flyQuzrtz(name, position, size, time) {
        Quartz.apply(this, arguments);
        this.time = time || 0;
    }

    flyQuartz.prototype = Object.create(Quartz.prototype);
    flyQuartz.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var t = Number(drawingState.realtime)%3000.0 + this.time;
        var curveValue = [2 * Math.cos(2.0*Math.PI*t/1000), 2 * t /1000, 2 * Math.sin(2.0*Math.PI*t/1000)];
        var temp = [0, 0, 0];
        temp[0] = curveValue[0] + this.position[0];
        temp[1] = curveValue[1] + this.position[1];
        temp[2] = curveValue[2] + this.position[2];
        twgl.m4.setTranslation(modelM,temp,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            vcolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    flyQuartz.prototype.center = function(drawingState) {
        return this.position;
    }



})();

grobjects.push(new flyQuartz("s1",[0,0,0], 0.5, 500));
grobjects.push(new spinQuartz("s2",[1,3,1], 0.25));
grobjects.push(new spinQuartz("s3",[-1,5,1]));
grobjects.push(new spinQuartz("s4",[0,5,2]), 0.9);
grobjects.push(new spinQuartz("s5",[-1,3,2], 1));
grobjects.push(new flyQuartz("s6",[1,2,0.5], 0.5, 1500));
grobjects.push(new flyQuartz("s7",[-3,1,-3]));
grobjects.push(new flyQuartz("s8",[-3,0,3], 0.8, 2500));
grobjects.push(new flyQuartz("s9",[3,0,-3], 0.3, 1500));