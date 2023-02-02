#version 300 es

layout(location=0)in vec3 a_position;
layout(location=1)in vec3 a_velocity;

uniform vec2 u_target;

out vec3 newPosition;
out vec3 newVelocity;

void main(){
  vec3 target = vec3(u_target,0.);
  float dis = distance(a_position,target);
  vec3 dir = normalize(target - a_position);
  float ratio = 0.01;
  vec3 velocity = a_velocity + dir/dis * ratio;
  vec3 position = a_position + velocity;
  newPosition=position;
  newVelocity=velocity;
}
