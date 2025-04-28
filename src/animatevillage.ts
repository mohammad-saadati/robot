(function () {
  'use strict';

  // Define interfaces for our data structures
  interface Place {
    x: number;
    y: number;
  }

  interface Places {
    [name: string]: Place;
  }

  interface Parcel {
    place: string;
    address: string;
  }

  interface WorldState {
    place: string;
    parcels: Parcel[];
    move(direction: string): WorldState;
  }

  interface RobotResult {
    direction: string;
    memory: any;
  }

  type RobotFunction = (state: WorldState, memory: any) => RobotResult;

  let active: Animation | null = null;

  const places: Places = {
    "Alice's House": { x: 279, y: 100 },
    "Bob's House": { x: 295, y: 203 },
    Cabin: { x: 372, y: 67 },
    "Daria's House": { x: 183, y: 285 },
    "Ernie's House": { x: 50, y: 283 },
    Farm: { x: 36, y: 118 },
    "Grete's House": { x: 35, y: 187 },
    Marketplace: { x: 162, y: 110 },
    'Post Office': { x: 205, y: 57 },
    Shop: { x: 137, y: 212 },
    'Town Hall': { x: 202, y: 213 },
  };
  const placeKeys: string[] = Object.keys(places);

  const speed: number = 2;

  class Animation {
    worldState: WorldState;
    robot: RobotFunction;
    robotState: any;
    turn: number;
    node: HTMLDivElement;
    map: HTMLImageElement;
    imgPath: string;
    robotElt: HTMLDivElement;
    parcels: HTMLDivElement[];
    text: HTMLSpanElement;
    button: HTMLButtonElement;
    timeout: number | null;

    constructor(worldState: WorldState, robot: RobotFunction, robotState: any) {
      this.worldState = worldState;
      this.robot = robot;
      this.robotState = robotState;
      this.turn = 0;
      this.timeout = null;

      const outer = document.body,
        doc = outer.ownerDocument;
      this.node = outer.appendChild(doc.createElement('div'));
      this.node.style.cssText = 'position: relative; line-height: 0.1; margin-left: 10px';
      this.map = this.node.appendChild(doc.createElement('img'));
      this.imgPath = 'img/';
      if (/\/code($|\/)/.test(outer.ownerDocument.defaultView!.location.toString()))
        this.imgPath = '../' + this.imgPath;
      console.log(
        outer.ownerDocument.defaultView!.location.toString(),
        /\/code($|\/)/.test(outer.ownerDocument.defaultView!.location.toString()),
        this.imgPath
      );
      this.map.src = this.imgPath + 'village2x.png';
      this.map.style.cssText = 'vertical-align: -8px';
      this.robotElt = this.node.appendChild(doc.createElement('div'));
      this.robotElt.style.cssText = `position: absolute; transition: left ${0.8 / speed}s, top ${0.8 / speed}s;`;
      const robotPic = this.robotElt.appendChild(doc.createElement('img'));
      robotPic.src = this.imgPath + 'robot_moving2x.gif';
      this.parcels = [];

      this.text = this.node.appendChild(doc.createElement('span'));
      this.button = this.node.appendChild(doc.createElement('button'));
      this.button.style.cssText =
        'color: white; background: blue; border: none; border-radius: 2px; padding: 2px 5px; line-height: 1.1; font-family: sans-serif; font-size: 80%';
      this.button.textContent = 'Stop';

      this.button.addEventListener('click', () => this.clicked());
      this.schedule();

      this.updateView();
      this.updateParcels();

      this.robotElt.addEventListener('transitionend', () => this.updateParcels());
    }

    updateView(): void {
      const pos = places[this.worldState.place];
      this.robotElt.style.top = pos.y - 38 + 'px';
      this.robotElt.style.left = pos.x - 16 + 'px';

      this.text.textContent = ` Turn ${this.turn} `;
    }

    updateParcels(): void {
      while (this.parcels.length) this.parcels.pop()!.remove();
      const heights: { [place: string]: number } = {};
      for (const { place, address } of this.worldState.parcels) {
        const height = heights[place] || (heights[place] = 0);
        heights[place] += 14;
        const node = document.createElement('div');
        const offset = placeKeys.indexOf(address) * 16;
        node.style.cssText = `position: absolute; height: 16px; width: 16px; background-image: url(${this.imgPath}parcel2x.png); background-position: 0 -${offset}px`;
        if (place == this.worldState.place) {
          node.style.left = '25px';
          node.style.bottom = 20 + height + 'px';
          this.robotElt.appendChild(node);
        } else {
          const pos = places[place];
          node.style.left = pos.x - 5 + 'px';
          node.style.top = pos.y - 10 - height + 'px';
          this.node.appendChild(node);
        }
        this.parcels.push(node as HTMLDivElement);
      }
    }

    tick(): void {
      const { direction, memory } = this.robot(this.worldState, this.robotState);
      this.worldState = this.worldState.move(direction);
      this.robotState = memory;
      this.turn++;
      this.updateView();
      if (this.worldState.parcels.length == 0) {
        this.button.remove();
        this.text.textContent = ` Finished after ${this.turn} turns`;
        (this.robotElt.firstChild as HTMLImageElement).src = this.imgPath + 'robot_idle2x.png';
      } else {
        this.schedule();
      }
    }

    schedule(): void {
      this.timeout = window.setTimeout(() => this.tick(), 1000 / speed);
    }

    clicked(): void {
      if (this.timeout == null) {
        this.schedule();
        this.button.textContent = 'Stop';
        (this.robotElt.firstChild as HTMLImageElement).src = this.imgPath + 'robot_moving2x.gif';
      } else {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.button.textContent = 'Start';
        (this.robotElt.firstChild as HTMLImageElement).src = this.imgPath + 'robot_idle2x.png';
      }
    }
  }

  (window as any).runRobotAnimation = function (
    worldState: WorldState,
    robot: RobotFunction,
    robotState: any
  ): void {
    if (active && active.timeout != null) clearTimeout(active.timeout);
    active = new Animation(worldState, robot, robotState);
  };
})();
