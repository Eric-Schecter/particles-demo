export class Clock {
  public timestamp = 0;
  public current = 0;
  private start = 0;
  private pre = performance.now();
  public reset = () =>{
    this.current = 0;
    this.timestamp = 0;
    this.pre = performance.now();
    this.start = performance.now();
  }
  public update = () => {
    this.timestamp = (performance.now() - this.pre)/1000;
    this.current = (performance.now()-this.start)/1000;
    this.pre = performance.now();
  }
}