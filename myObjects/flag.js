var grobjects = grobjects || [];
var Flag = undefined;

(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    Flag = function Quarts(name, position, size) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1;
    }

    Flag.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["quartz-vs", "quartz-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        0, 0, 1,  0, 1, 1,  1, 1, 1,    1, 1, 1,  1, 0, 1,  0, 0, 1,
                        1, 0, 1,  1, 1, 1,  1, 1, 0,    1, 1, 0,  1, 0, 0,  1, 0, 1,
                        1, 1, 0,  0, 1, 0,  0, 0, 0,    0, 0, 0,  1, 0, 0,  1, 1, 0,
                        0, 1, 0,  0, 1, 1,  0, 0, 1,    0, 0, 1,  0, 0, 0,  0, 1, 0
                    ]},

                vcolor: {
                    numComponents: 3, data: [
                        0, 0, 0,  0, 0, 0,  0, 0, 0,    0, 0, 0,  0, 0, 0,  0, 0, 0,
                        0, 0, 0,  0, 0, 0,  0, 0, 0,    0, 0, 0,  0, 0, 0,  0, 0, 0,
                        0, 0, 0,  0, 0, 0,  0, 0, 0,    0, 0, 0,  0, 0, 0,  0, 0, 0,
                        0, 0, 0,  0, 0, 0,  0, 0, 0,    0, 0, 0,  0, 0, 0,  0, 0, 0
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Flag.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([0.1,3,0.1]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            vcolor:this.color,model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Flag.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new Flag("f1",[2,0,4]));