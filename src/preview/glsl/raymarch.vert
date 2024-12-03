attribute vec2 aPosition;
attribute vec2 aTexCoord;

varying vec2 vPos;
varying vec2 vTexPos;

void main() {
  vec2 zeroToTwo = aPosition * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  vPos = clipSpace;
  vTexPos = vec2(aTexCoord.s, 1.0 - aTexCoord.t);
  gl_Position = vec4(clipSpace, 0, 1);
}
