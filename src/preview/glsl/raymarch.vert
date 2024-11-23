attribute vec2 aPosition;

varying vec2 vPos;

void main() {
  vec2 zeroToTwo = aPosition * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  vPos = clipSpace;
  gl_Position = vec4(clipSpace, 0, 1);
}
