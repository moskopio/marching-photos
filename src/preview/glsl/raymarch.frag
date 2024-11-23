precision mediump float;

uniform vec2 uResolution; // TODO: pass it and react to resolution change

// Scene distance
float map(vec3 p) {
  return length(p) - 1.; // distance to a sphere of radius 1
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  
  // TOOD: use uniform!
  vec2 resolution = vec2(1000, 1000);
  vec2 uv = (fragCoord * 2. - resolution.xy) / resolution.y;
  
  // Initialization
  vec3 ro = vec3(0, 0, -3);         // ray origin
  vec3 rd = normalize(vec3(uv, 1)); // ray direction
  vec3 col = vec3(0);               // final pixel color
  
  float t = 0.; // total distance travelled
  
  // Raymarching
  for (int i = 0; i < 80; i++) {
    vec3 p = ro + rd * t;     // position along the ray

    float d = map(p);         // current distance to the scene

    t += d;                   // "march" the ray

    if (d < .001) break;      // early stop if close enough
    if (t > 100.) break;      // early stop if too far
  }
  
  col = vec3(t * .2);           // color based on distance
  
    
  // gl_FragColor = vec4(1, 0, 0, 1);
  gl_FragColor = vec4(col, 1);
}
