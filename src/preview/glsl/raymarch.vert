attribute vec2 aPosition;

void main() {
  vec2 zeroToTwo = aPosition * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  gl_Position = vec4(clipSpace, 0, 1);
  // gl_Position = vec4(aPosition.xy,0.0,1.0); 
}
