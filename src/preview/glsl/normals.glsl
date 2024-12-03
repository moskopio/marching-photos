#define EPSILON 0.0001

vec3 calculateNormals(in vec3 p) {
    const vec2 k = vec2(1, -1);
    vec3 part0 = k.xyy * sdScene(p + k.xyy * EPSILON);
    vec3 part1 = k.yyx * sdScene(p + k.yyx * EPSILON);
    vec3 part2 = k.yxy * sdScene(p + k.yxy * EPSILON);
    vec3 part3 = k.xxx * sdScene(p + k.xxx * EPSILON);
    return normalize(part0 + part1 + part2 + part3);
}
