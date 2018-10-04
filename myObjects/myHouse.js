var grobjects = grobjects || [];
var House = undefined;

(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    House = function House(name, position, size, color1, color2) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1.0;
        this.color1 = [1, 1, 1];
        this.color2 = [1, 0, 0];
    }

    House.prototype.init = function (drawingState) {
        var x1 = this.color1[0];
        var y1 = this.color1[1];
        var z1 = this.color1[2];
        var x2 = this.color2[0];
        var y2 = this.color2[1];
        var z2 = this.color2[2];
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["house-vs", "house-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3, data: [
                        -1,1,1,  1,1,1,  1,-1,1,    1,-1,1,  -1,-1,1,  -1,1,1, //z=1
                        1,1,1,  1,1,-1,  1,-1,-1,    1,-1,-1,  1,-1,1,  1,1,1, //x=1
                        1,1,-1,  -1,1,-1,  -1,-1,-1,    -1,-1,-1,  1,-1,-1,  1,1,-1, //z=-1
                        -1,1,-1,  -1,1,1,  -1,-1,1,     -1,-1,1,  -1,-1,-1,  -1,1,-1, //x=-1
                        -1,-1,-1,  1,-1,-1,  1,-1,1,    1,-1,1,  -1,-1,1,  -1,-1,-1, //y=0
                        -1,1,1,  0,2,1,  1,1,1, //front triangle
                        -1,1,-1,  0,2,-1,  1,1,-1, //back triangle
                        1.25,0.75,1.25,  0,2,1.25,  0,2,-1.25,    0,2,-1.25,  1.25,0.75,-1.25,  1.25,0.75,1.25, //right roof
                        0,2,1.25,  0,2,-1.25,  -1.25,0.75,-1.25,    -1.25,0.75,-1.25,  -1.25,0.75,1.25,  0,2,1.25//left roof

                ]},
                vnormal: {
                    numComponents: 3, data: [
                        0,0,1,  0,0,1,  0,0,1,    0,0,1,  0,0,1,  0,0,1,
                        1,0,0,  1,0,0,  1,0,0,    1,0,0,  1,0,0,  1,0,0,
                        0,0,-1, 0,0,-1, 0,0,-1,   0,0,-1, 0,0,-1, 0,0,-1,
                        -1,0,0, -1,0,0, -1,0,0,   -1,0,0, -1,0,0, -1,0,0,
                        0,-1,0, 0,-1,0, 0,-1,0,   0,-1,0, 0,-1,0, 0,-1,0,
                        0,0,1,  0,0,1,  0,0,1,
                        0,0,-1, 0,0,-1, 0,0,-1,
                        1,1,0,  1,1,0,  1,1,0,    1,1,0,  1,1,0,  1,1,0,
                        -1,1,0, -1,1,0, -1,1,0,   -1,1,0, -1,1,0, -1,1,0
                    ]},

                vcolor: {
                    numComponents: 3, data: [
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,    x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,    x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,    x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,    x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,    x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x1,y1,z1, x1,y1,z1, x1,y1,z1,
                        x2,y2,z2, x2,y2,z2, x2,y2,z2,    x2,y2,z2, x2,y2,z2, x2,y2,z2,
                        x2,y2,z2, x2,y2,z2, x2,y2,z2,    x2,y2,z2, x2,y2,z2, x2,y2,z2
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    House.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    House.prototype.center = function(drawingState) {
        return this.position;
    }

})();

grobjects.push(new House("h1",[-2,0.5,2],0.5));
grobjects.push(new House("h2",[2,0.5,2],0.5));
grobjects.push(new House("h3",[2, 1,-2],1));
grobjects.push(new House("h4",[-2,1,-2],1));