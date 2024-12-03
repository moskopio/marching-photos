#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vPos;
out vec2 vTexPos;

void main() {
  vec2 zeroToTwo = aPosition * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  vPos = clipSpace;
  vTexPos = vec2(aTexCoord.s, 1.0 - aTexCoord.t);
  gl_Position = vec4(clipSpace, 0, 1);
}
