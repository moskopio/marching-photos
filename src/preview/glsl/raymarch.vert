#version 300 es

in vec2 aPosition;
out vec2 vPos;

void main() {
  vec2 zeroToTwo = aPosition * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  vPos = clipSpace;
  gl_Position = vec4(clipSpace, 0, 1);
}
