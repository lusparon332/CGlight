
const vsSource = `#version 300 es
    precision highp float;

    uniform mat4 mvMatrix;
    uniform mat3 nMatrix;
    uniform mat4 pMatrix;
    uniform mat4 vMatrix;

    uniform vec3 lightLocation;
    uniform vec3 ambientLightColor;
    uniform vec3 diffuseLightColor;
    uniform vec3 specularLightColor;

    in vec3 a_position;
    in vec4 a_color;
    in vec3 a_normal;

    out vec4 v_color;

    out vec3 vLightWeighting;
    out lowp vec4 vColor;

    const float shininess = 0.5f;

    void main() {
        vec4 vertexPositionEye4 = vMatrix * mvMatrix * vec4(a_position, 1.0);
        vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

        vec3 lightDirection = normalize(lightLocation - vertexPositionEye3);
        //vec3 normal = normalize(nMatrix * a_normal);
        vec3 normal = normalize(nMatrix * a_position.xyz);


        float lightDist = length(lightDirection);
        float lightIntens = 1.0f / (1.0f + 0.1f * lightDist + 0.01f * lightDist * lightDist);

        float diffuseLightDot = max(dot(normal, lightDirection), 0.0);
        vec3 reflectionVector = normalize(reflect(-lightDirection, normal));
        vec3 viewVectorEye = -normalize(vertexPositionEye3);
        float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
        float specularLightParam = pow(specularLightDot, shininess);

        gl_Position = pMatrix * vMatrix * mvMatrix * vec4(a_position, 1.0);
        v_color = a_color;
        vLightWeighting = ambientLightColor + (diffuseLightColor * diffuseLightDot + specularLightColor * specularLightParam) * lightIntens;
    }
`;

const fsSource = `#version 300 es
    precision highp float;

    in vec4 v_color;
    in vec3 vLightWeighting;
    out vec4 color;
    void main() {
        color = vec4(vLightWeighting.rgb * v_color.rgb, v_color.a);
    }
`;

function initShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

var rand_offset = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];


const faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [1.0, 0.0, 0.0, 1.0], // Top face: green
        [1.0, 0.0, 0.0, 1.0], // Bottom face: blue
        [1.0, 0.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 0.0, 1.0], // Left face: purple
    ];
const faceColors1 = [
        [1.0, 1.0, 0.0, 1.0], // Front face: white
        [1.0, 1.0, 0.0, 1.0], // Back face: red
        [1.0, 1.0, 0.0, 1.0], // Top face: green
        [1.0, 1.0, 0.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 1.0, 0.0, 1.0], // Left face: purple
    ];
const faceColors2 = [
        [0.0, 1.0, 0.0, 1.0], // Front face: white
        [0.0, 1.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 1.0, 0.0, 1.0], // Bottom face: blue
        [0.0, 1.0, 0.0, 1.0], // Right face: yellow
        [0.0, 1.0, 0.0, 1.0], // Left face: purple
    ];
const faceColors3 = [
        [0.0, 1.0, 1.0, 1.0], // Front face: white
        [0.0, 1.0, 1.0, 1.0], // Back face: red
        [0.0, 1.0, 1.0, 1.0], // Top face: green
        [0.0, 1.0, 1.0, 1.0], // Bottom face: blue
        [0.0, 1.0, 1.0, 1.0], // Right face: yellow
        [0.0, 1.0, 1.0, 1.0], // Left face: purple
    ];
    

const vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
    
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];

const indices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23 // left
    ];

const facesNormales = [
        // Front face
        [0.0, 0.0, 1.0],
        // Back face
        [0.0, 0.0, -1.0],
        // Top face
        [0.0, 1.0, 0.0],
        // Bottom face
        [0.0, -1.0, 0.0],
        // Right face
        [1.0, 0.0, 0.0],
        // Left face
        [-1.0, 0.0, 0.0]
    ];

const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl2');

var angle = 0;
var angle1 = 0;
var angle2 = 0;
var angle3 = 0;
var oyAngle = 0;
var centAngle = 0;

var angleInRadians = angle * 1.0 * Math.PI / 180.0;

var colors = [];
for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
}
var colors1 = [];
for (var j = 0; j < faceColors1.length; ++j) {
    const c = faceColors1[j];
    colors1 = colors1.concat(c, c, c, c);
}
var colors2 = [];
for (var j = 0; j < faceColors2.length; ++j) {
    const c = faceColors2[j];
    colors2 = colors2.concat(c, c, c, c);
}
var colors3 = [];
for (var j = 0; j < faceColors3.length; ++j) {
    const c = faceColors3[j];
    colors3 = colors3.concat(c, c, c, c);
}

var normales = [];
for (var j = 0; j < normales.length; ++j) {
    const c = normales[j];
    normales = normales.concat(c, c, c, c);
}

const vertexShader = initShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const normalBufer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normales), gl.STATIC_DRAW);

const indexBuffer1 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer1); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
const vertexBuffer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
const colorBuffer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors1), gl.STATIC_DRAW);
const normalBufer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normales), gl.STATIC_DRAW);

const indexBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
const vertexBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
const colorBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors2), gl.STATIC_DRAW);
const normalBufer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normales), gl.STATIC_DRAW);

const indexBuffer3 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer3); 
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
const vertexBuffer3 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer3);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
const colorBuffer3 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer3);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors3), gl.STATIC_DRAW);
const normalBufer3 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer3);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normales), gl.STATIC_DRAW);

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'q':
            angle += 3
            angle %= 360
            break;
        case 'w':
            angle -= 3
            angle %= 360
            break;
        case 'e':
            angle1 += 3
            angle1 %= 360
            break;
        case 'r':
            angle1 -= 3
            angle1 %= 360
            break;
        case 't':
            angle2 += 3
            angle2 %= 360
            break;
        case 'y':
            angle2 -= 3
            angle2 %= 360
            break;
        case 'u':
            angle3 += 3
            angle3 %= 360
            break;
        case 'i':
            angle3 -= 3
            angle3 %= 360
            break;
        case 'a':
            centAngle += 3
            centAngle %= 360
            break;
        case 's':
            centAngle -= 3
            centAngle %= 360
            break;
        case 'z':
            oyAngle += 3
            oyAngle %= 360
            break;
        case 'x':
            oyAngle -= 3
            oyAngle %= 360
            break;
    }
});

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');

    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45*Math.PI/180, gl.canvas.height / gl.canvas.width, 0.01, 100.0);
    var vMatrix = mat4.create();
    mat4.lookAt(vMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
    
    var mvMatrix = mat4.create();
    mat4.rotate(mvMatrix, mvMatrix, oyAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, rand_offset);
    mat4.rotate(mvMatrix, mvMatrix, centAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [0.2, 0, 0]);
    mat4.rotate(mvMatrix, mvMatrix, angle * Math.PI / 180.0, [0, 1, 0]);
    mat4.scale(mvMatrix, mvMatrix, [0.1, 0.1, 0.1]);
    var nMatrix = mat3.create();
    mat3.normalFromMat4(nMatrix, mvMatrix);

    var mvMatrix1 = mat4.create();
    mat4.rotate(mvMatrix1, mvMatrix1, oyAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix1, mvMatrix1, rand_offset);
    mat4.rotate(mvMatrix1, mvMatrix1, centAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix1, mvMatrix1, [0, 0, 0]);
    mat4.rotate(mvMatrix1, mvMatrix1, angle1 * Math.PI / 180.0, [0, 1, 0]);
    mat4.scale(mvMatrix1, mvMatrix1, [0.1, 0.1, 0.1]);
    var nMatrix1 = mat3.create();
    mat3.normalFromMat4(nMatrix1, mvMatrix1);
    
    var mvMatrix2 = mat4.create();
    mat4.rotate(mvMatrix2, mvMatrix2, oyAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix2, mvMatrix2, rand_offset);
    mat4.rotate(mvMatrix2, mvMatrix2, centAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix2, mvMatrix2, [-0.2, 0, 0]);
    mat4.rotate(mvMatrix2, mvMatrix2, angle2 * Math.PI / 180.0, [0, 1, 0]);
    mat4.scale(mvMatrix2, mvMatrix2, [0.1, 0.1, 0.1]);
    var nMatrix2 = mat3.create();
    mat3.normalFromMat4(nMatrix2, mvMatrix2);
    
    var mvMatrix3 = mat4.create();
    mat4.rotate(mvMatrix3, mvMatrix3, oyAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix3, mvMatrix3, rand_offset);
    mat4.rotate(mvMatrix3, mvMatrix3, centAngle * Math.PI / 180.0, [0, 1, 0]);
    mat4.translate(mvMatrix3, mvMatrix3, [0, 0.2, 0]);
    mat4.rotate(mvMatrix3, mvMatrix3, angle3 * Math.PI / 180.0, [0, 1, 0]);
    mat4.scale(mvMatrix3, mvMatrix3, [0.1, 0.1, 0.1]);
    var nMatrix3 = mat3.create();
    mat3.normalFromMat4(nMatrix3, mvMatrix3);
    
    const uniformLightLocation = gl.getUniformLocation(program, 'lightLocation');
    gl.uniform3fv(uniformLightLocation, [10.0, 0.0, 10.0]);
    const uniformAmbientLightColorLocation = gl.getUniformLocation(program, 'ambientLightColor');
    gl.uniform3fv(uniformAmbientLightColorLocation, [0.5, 0.5, 0.5]);
    const uniformDiffuseLightColorLocation = gl.getUniformLocation(program, 'diffuseLightColor');
    gl.uniform3fv(uniformDiffuseLightColorLocation, [0.5, 0.5, 0.5]);
    const uniformSpecularLightColorLocation = gl.getUniformLocation(program, 'specularLightColor');
    gl.uniform3fv(uniformSpecularLightColorLocation, [0.5, 0.5, 0.5]);

    const mvMatrixLocation = gl.getUniformLocation(program, 'mvMatrix');
    const nMatrixLocation = gl.getUniformLocation(program, 'nMatrix');
    const pMatrixLocation = gl.getUniformLocation(program, 'pMatrix');
    const vMatrixLocation = gl.getUniformLocation(program, 'vMatrix');
    gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix);
    gl.uniformMatrix3fv(nMatrixLocation, false, nMatrix);
    gl.uniformMatrix4fv(pMatrixLocation, false, pMatrix);
    gl.uniformMatrix4fv(vMatrixLocation, false, vMatrix);


    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
 
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);    

    gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix1);
    gl.uniformMatrix3fv(nMatrixLocation, false, nMatrix1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer1);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);   
    
    gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix2);
    gl.uniformMatrix3fv(nMatrixLocation, false, nMatrix2);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer2);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);  

    gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix3);
    gl.uniformMatrix3fv(nMatrixLocation, false, nMatrix3);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer3);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer3);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufer3);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);  

    requestAnimationFrame(render);
}

window.onload = render;