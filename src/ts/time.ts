import { Parameters } from "./parameters";

let speed = 1;
let lastCheckpoint: number; // in relative time
let lastCheckpointTime: number; // in actual time

function updateCheckpoint(newCheckpoint: number): void {
    lastCheckpoint = newCheckpoint;
    lastCheckpointTime = Date.now();
}
updateCheckpoint(0);

function currentTimeInMs(): number {
    return lastCheckpoint + speed * (Date.now() - lastCheckpointTime);
}

function updateSpeed(): void {
    const newSpeed = Parameters.speed;
    updateCheckpoint(currentTimeInMs());
    speed = newSpeed;
}
Parameters.addSpeedChangeObserver(updateSpeed);

/* Elapsed time in seconds since the application start.
 * This time is relative and can be slowed down and made quicker with controls. */
function getTime(): number {
    return 0.001 * currentTimeInMs();
}

export { getTime }