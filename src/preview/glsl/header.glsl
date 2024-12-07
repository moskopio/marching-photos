#version 300 es
precision mediump float;

in vec2 vPos;
out vec4 outColor;

uniform float uTime;
uniform float uAspectRatio;
uniform vec2 uResolution;
uniform vec2 uRotation;
uniform float uDolly;

uniform vec2 uSamples;
uniform float uPush;

uniform sampler2D uImage;
uniform float uImgAspectRatio;
uniform float uShape;
uniform float uColoring;


struct Scene {
  vec3 cameraPosition;
  vec3 lightPosition;
  vec3 normal;
  vec3 elementColor;
};

struct Result {
  vec4  color;
  float size;
  float distance;
};

mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}
