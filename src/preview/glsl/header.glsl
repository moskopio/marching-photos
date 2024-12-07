#version 300 es
precision highp float;

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

#define FLAG_SHADING_DISABLED 1
#define FLAG_SCALING_DISABLED 2
#define FLAG_SCALING_REVERSE  4
#define FLAG_COLOR_REVERSE    8
#define FLAG_PUSH_DISABLED    16
#define FLAG_PUSH_REVERSE     32
uniform int uFlags;

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
