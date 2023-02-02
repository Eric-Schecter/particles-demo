import React, { useRef, useEffect } from 'react';
import { Application } from './gl';
import styles from './index.module.scss';

type Props = {
  GL_App: new (container: HTMLDivElement) => Application
}

export const App = ({ GL_App }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const refApp = useRef<Application>();
  useEffect(() => {
    if (!ref.current) { return }
    const container = ref.current;
    const app = new GL_App(container);
    refApp.current = app;
    const start = async () => {
      await app.setup();
      try {
        app.run();
      } catch (error) {
        console.log(error);
      }
    }
    start();
    return () => app.cleanup();
  }, [ref, GL_App])

  const move = (e:React.MouseEvent<HTMLDivElement>) =>{
    if(!refApp.current){
      return;
    }
    const { clientX, clientY, currentTarget:{clientWidth, clientHeight } } = e;
    refApp.current.pointer[0] = (clientX / clientWidth) * 2 - 1;
    refApp.current.pointer[1] = -(clientY / clientHeight) * 2 + 1;
  }

  return <div
    ref={ref}
    className={styles.main}
    onMouseMove={move}
  />
}