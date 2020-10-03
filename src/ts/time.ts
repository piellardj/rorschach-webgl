import { Parameters } from "./parameters";


let lastCheckpoint: number; // in relative time
let lastCheckpointTime: number; // in actual time

function updateCheckpoint(newCheckpoint: number): void {
    lastCheckpoint = newCheckpoint;
    lastCheckpointTime = Date.now();
}
updateCheckpoint(0);

let speed = Parameters.speed;
function updateSpeed(): void {
    const newSpeed = Parameters.speed;
    updateCheckpoint(currentTimeInMs());
    speed = newSpeed;
}
Parameters.addSpeedChangeObserver(updateSpeed);

function currentTimeInMs(): number {
    return lastCheckpoint + speed * (Date.now() - lastCheckpointTime);
}

/* Elapsed time in seconds since the application start.
 * This time is relative and can be slowed down and made quicker with controls. */
function getTime(): number {
    return 0.001 * currentTimeInMs();
}

export { getTime }