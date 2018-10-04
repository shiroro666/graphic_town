var grobjects = grobjects || [];

(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 pos;" +
        "attribute vec3 inColor;" +
        "attribute vec3 vNormal;" + //
        "attribute vec2 vTexCoord;" +
        "varying vec3 fPosition;" + //
        "varying vec3 outColor;" +
        "varying vec3 fNormal;" +
        "varying vec2 fTexCoord;" +
        "uniform mat4 view;" +
        "uniform mat4 proj;" +
        "void main(void) {" +
        "  gl_Position = proj * view * vec4(pos, 1.0);" +
        "  fPosition = (view * vec4(pos, 1.0)).xyz;" +
        "  fNormal = vNormal;" +
        "  outColor = inColor;" +
        "  fTexCoord = vTexCoord;" +
        "}";
    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec3 fPosition;" +
        "varying vec3 outColor;" +
        "varying vec3 fNormal;" +
        "varying vec2 fTexCoord;" +
        "uniform sampler2D uText;" +
        "const vec3  lightV    = vec3(1.0,0.0,1.0);" +
        "const float lightI    = 1.0;" +
        "const float ambientC  = 0.15;" +
        "const float diffuseC  = 0.3;" +
        "const float specularC = 2.0;" +
        "const float specularE = 16.0;" +
        "const vec3  lightCol  = vec3(1.0,1.0,1.0);" +
        "const vec3  objectCol = vec3(1.0,0.6,0.0);" +
        "vec2 blinnPhongDir(vec3 lightDir, vec3 n, float lightInt, float Ka," +
                    "float Kd, float Ks, float shininess) {" +
        "vec3 s = normalize(lightDir);" +
        "vec3 v = normalize(-fPosition);" +
        "vec3 h = normalize(v+s);" +
        "float diffuse = Ka + Kd * lightInt * max(0.0, dot(n, s));" +
        "float spec =  Ks * pow(max(0.0, dot(n,h)), shininess);" +
        "return vec2(diffuse, spec);" +
        "}" +
        "void main(void) {" +
        "vec3 texColor=texture2D(uText,fTexCoord).xyz;" +
        "vec3 n = fNormal;" +
        "vec3 ColorS  = blinnPhongDir(lightV,n,0.0,0.0,0.0,specularC,specularE).y*lightCol;" +
        "vec3 ColorAD = blinnPhongDir(lightV,n,lightI,ambientC,diffuseC,0.0,1.0).x*texColor;" +
        "gl_FragColor = vec4(ColorAD+ColorS,1.0);" +
        "}";

    var vertexPos = [
        -0.5, 0.0, 4,
         0.5, 0.0, 4,
         0.0, 1.0, 4.5,
         0.5, 0.0, 4,
         0.5, 0.0, 5,
         0.0, 1.0, 4.5,
         0.5, 0.0, 5,
        -0.5, 0.0, 5,
         0.0, 1.0, 4.5,
        -0.5, 0.0, 5,
        -0.5, 0.0, 4,
         0.0, 1.0, 4.5,

        -0.5, 2.0, 4,
        0.5, 2.0, 4,
        0.0, 1.0, 4.5,
        0.5, 2.0, 4,
        0.5, 2.0, 5,
        0.0, 1.0, 4.5,
        0.5, 2.0, 5,
        -0.5, 2.0, 5,
        0.0, 1.0, 4.5,
        -0.5, 2.0, 5,
        -0.5, 2.0, 4,
        0.0, 1.0, 4.5,

        -0.5, 2.0, 4,
        0.5, 2.0, 4,
        0.5, 2.0, 5,

        0.5, 2.0, 5,
        -0.5, 2.0, 5,
        -0.5, 2.0, 4
    ];
    var vertexColors = [
        1, 1, 1,   1, 1, 0,   1, 0, 1,
        0, 1, 1,   1, 1, 1,   0, 1, 0,
        1, 1, 0,   0, 0, 1,   1, 0, 1,
        1, 0, 0,   1, 1, 0,   0, 1, 0,

        1, 1, 1,   1, 1, 0,   1, 0, 1,
        0, 1, 1,   1, 1, 1,   0, 1, 0,
        1, 1, 0,   0, 0, 1,   1, 0, 1,
        1, 0, 0,   1, 1, 0,   0, 1, 0,

        1, 1, 0,   0, 0, 1,   1, 0, 1,
        1, 0, 0,   1, 1, 0,   0, 1, 0
    ];
 
    var vertexNormal = [
        0, 2, -1,
        0, 2, -1,
        0, 2, -1,
                        
        1, 2, 0,
        1, 2, 0,
        1, 2, 0,
                        
        0, 2, 1,
        0, 2, 1,
        0, 2, 1,
                        
        -1, 2, 0,
        -1, 2, 0,
        -1, 2, 0,

        0, -2, -1,
        0, -2, -1,
        0, -2, -1,

        1, -2, 0,
        1, -2, 0,
        1, -2, 0,

        0, -2, 1,
        0, -2, 1,
        0, -2, 1,

        -1, -2, 0,
        -1, -2, 0,
        -1, -2, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    var textureCoor = [
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0
    ];

    var obj = {
        name : "obj",
        init : function(drawingState) {
            var gl = drawingState.gl;

            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader,vertexSource);
            gl.compileShader(vertexShader);
              if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                      alert(gl.getShaderInfoLog(vertexShader));
                      return null;
                  }
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader,fragmentSource);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                  alert(gl.getShaderInfoLog(fragmentShader));
                  return null;
            }
            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);
            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                alert("Could not initialize shaders");
            }
            this.posLoc = gl.getAttribLocation(this.shaderProgram, "pos");
            this.colorLoc = gl.getAttribLocation(this.shaderProgram, "inColor");
            this.normalInfo = gl.getAttribLocation(this.shaderProgram, "vNormal");
            this.textInfo = gl.getAttribLocation(this.shaderProgram, "vTexCoord");
            this.projLoc = gl.getUniformLocation(this.shaderProgram,"proj");
            this.viewLoc = gl.getUniformLocation(this.shaderProgram,"view");

            this.posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormal), gl.STATIC_DRAW);
            this.textureBuffer = gl.createBuffer(); //Todo
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoor), gl.STATIC_DRAW);

            this.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            var image = new Image();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            image.crossOrigin = "anonymous";
            image.src = "data:image/png;base64,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";
        },

        draw : function(drawingState) {
            var gl = drawingState.gl;
            gl.useProgram(this.shaderProgram);
            gl.enableVertexAttribArray(this.posLoc);
            gl.enableVertexAttribArray(this.colorLoc);
            gl.enableVertexAttribArray(this.normalInfo);
            gl.enableVertexAttribArray(this.textInfo);
            gl.uniformMatrix4fv(this.viewLoc,false,drawingState.view);
            gl.uniformMatrix4fv(this.projLoc,false,drawingState.proj);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(this.colorLoc, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(this.normalInfo, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.vertexAttribPointer(this.textInfo, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 30);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

        },
        center : function(drawingState) {
            return [0,.5,4.5];
        },

        shaderProgram : undefined,
        posBuffer : undefined,
        colorBuffer : undefined,
        normalBuffer: undefined,
        texture: -1,
        posLoc : -1,
        colorLoc : -1,
        normalInfo: -1,
        textInfo : -1,
        projLoc : -1,
        viewLoc : -1
    };

    grobjects.push(obj);
})();
