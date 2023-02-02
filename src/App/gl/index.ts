import { vec2 } from 'gl-matrix';
import { Clock } from './clock';
import { ProgramLoader } from './programLoader';
import { throwErrorIfInvalid } from './utils';

export abstract class Application {
  protected canvas!: HTMLCanvasElement;
  protected gl!: WebGL2RenderingContext;
  protected programLoader = new ProgramLoader();
  private timer = 0;
  private clock = new Clock();
  private extensions = [];
  private _pointer = vec2.create();
  constructor(protected container: HTMLElement) {
    this.initWindow();
    this.initWebGL();
    this.clock.reset();
  }
  public run = () => {
    this.timer = requestAnimationFrame(this.mainLoop);
  }
  private initWindow = () => {
    this.canvas = document.createElement('canvas');
    const { clientWidth, clientHeight } = this.container;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.container.appendChild(this.canvas);
  }
  private initWebGL = () => {
    this.gl = throwErrorIfInvalid(this.canvas.getContext('webgl2'));
    this.extensions.forEach(extension => {
      const ext = this.gl.getExtension(extension);
      if (!ext) {
        console.log(`failed to get ${extension}`);
      }
    });
  }
  private mainLoop = () => {
    this.clock.update();
    this.update(this.clock.current);
    this.timer = requestAnimationFrame(this.mainLoop);
  }
  public cleanup = () => {
    cancelAnimationFrame(this.timer);
  }
  protected abstract update: (time: number) => void;
  public setup = () => { };
  public get pointer(){
    return this._pointer;
  }
}