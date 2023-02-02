import { Application } from "../gl";
import psVS from './shader/ps.vs';
import psFS from './shader/ps.fs';
import bypassFS from './shader/bypass.fs';
import positionVS from './shader/position.vs';

export class ParticleSystem extends Application {
  private vaoPos: WebGLVertexArrayObject[] = [];
  private tfs: WebGLTransformFeedback[] = [];
  private positionBuffers: WebGLBuffer[] = [];
  private velocityBuffers: WebGLBuffer[] = [];
  private ps: WebGLProgram;
  private position: WebGLProgram;
  private particleCount = 20000;
  private index = 0;
  private targetLoc!: WebGLUniformLocation;
  constructor(container: HTMLDivElement) {
    super(container);
    this.position = this.programLoader.load(this.gl, positionVS, bypassFS, ['newPosition', 'newVelocity']);
    this.ps = this.programLoader.load(this.gl, psVS, psFS);
  }
  public setup = async () => {
    const { clientWidth, clientHeight } = this.canvas;

    this.gl.useProgram(this.ps);

    const resolutionLoc = this.gl.getUniformLocation(this.ps, 'u_resolution');
    this.gl.uniform2fv(resolutionLoc, [clientWidth, clientHeight]);

    this.gl.useProgram(this.position);

    this.targetLoc = this.gl.getUniformLocation(this.position, 'u_target') as WebGLUniformLocation;

    this.gl.useProgram(null);

    const positions = new Array(this.particleCount * 3).fill(0).map(() => (Math.random() - 0.5) * 2);

    this.buildVAO(positions, 0);
    this.buildVAO(positions, 1);

    this.tfs[0] = this.buildTransformFeedback(this.positionBuffers[0],this.velocityBuffers[0]);
    this.tfs[1] = this.buildTransformFeedback(this.positionBuffers[1],this.velocityBuffers[1]);
  }
  private buildVAO = (data: number[], index: number) => {
    // init
    this.vaoPos[index] = this.gl.createVertexArray() as WebGLVertexArrayObject;
    // bind
    this.gl.bindVertexArray(this.vaoPos[index]);

    this.positionBuffers[index] = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffers[index]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.DYNAMIC_DRAW);
    const positionLoc = this.gl.getAttribLocation(this.position, 'a_position');
    this.gl.enableVertexAttribArray(positionLoc);
    this.gl.vertexAttribPointer(positionLoc, 3, this.gl.FLOAT, false, 12, 0);

    this.velocityBuffers[index] = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.velocityBuffers[index]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.length * 4), this.gl.DYNAMIC_DRAW);
    const velocityLoc = this.gl.getAttribLocation(this.position, 'a_velocty');
    this.gl.enableVertexAttribArray(velocityLoc);
    this.gl.vertexAttribPointer(velocityLoc, 3, this.gl.FLOAT, false, 12, 0);

    // reset
    this.gl.bindVertexArray(null);
  }
  private buildTransformFeedback = (buffer1: WebGLBuffer,buffer2:WebGLBuffer) => {
    // create transform feedback
    const tf = this.gl.createTransformFeedback() as WebGLTransformFeedback;
    // bind transform feedback
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, tf);

    // create buffer to optain results
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer1);
    this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer1);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer2);
    this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffer2);

    // unbind transform feedback
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); // very important

    return tf;
  }
  private printBuffer = (buffer: WebGLBuffer) => {
    const result = new Float32Array(this.particleCount * 3);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, result);
    console.log(result);
  }
  protected update = (time: number) => {
    const { clientWidth, clientHeight } = this.canvas;
    this.gl.viewport(0, 0, clientWidth, clientHeight);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // update position
    this.gl.enable(this.gl.RASTERIZER_DISCARD);
    this.gl.useProgram(this.position);
    this.gl.uniform2fv(this.targetLoc, [this.pointer[0], this.pointer[1]]);
    this.gl.bindVertexArray(this.vaoPos[this.index % this.vaoPos.length]);
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.tfs[(this.index + 1) % this.vaoPos.length]);
    this.gl.beginTransformFeedback(this.gl.POINTS);
    this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
    this.gl.endTransformFeedback();
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
    this.gl.disable(this.gl.RASTERIZER_DISCARD);
    // this.printBuffer(this.buffers[(this.index+1)%this.vaoPos.length]);

    // draw particles
    this.gl.useProgram(this.ps);
    this.gl.bindVertexArray(this.vaoPos[(this.index + 1) % this.vaoPos.length]);
    this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);

    this.gl.bindVertexArray(null);
    this.gl.useProgram(null);

    this.index++;
  }
}