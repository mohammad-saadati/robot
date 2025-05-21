// Rename the interface to avoid conflict with the built-in Location interface
interface MapLocation {
  x: number;
  y: number;
  name: string;
}

interface Parcel {
  location: MapLocation;
  destination: MapLocation;
}

// Define the map and locations
const locations: MapLocation[] = [
  { x: 50, y: 50, name: 'A' },
  { x: 200, y: 50, name: 'B' },
  { x: 200, y: 200, name: 'C' },
  { x: 50, y: 200, name: 'D' },
];

const parcels: Parcel[] = [
  { location: locations[0], destination: locations[2] },
  { location: locations[1], destination: locations[3] },
];

// Initialize the map with locations and parcels
function initializeMap(): void {
  const map = document.getElementById('map');

  locations.forEach((location) => {
    const locationElement = document.createElement('div');
    locationElement.className = 'location';
    locationElement.style.left = `${location.x}px`;
    locationElement.style.top = `${location.y}px`;
    map?.appendChild(locationElement);

    const labelElement = document.createElement('div');
    labelElement.className = 'location-label';
    labelElement.style.left = `${location.x}px`;
    labelElement.style.top = `${location.y - 15}px`;
    labelElement.textContent = location.name;
    map?.appendChild(labelElement);
  });

  parcels.forEach((parcel, index) => {
    const parcelElement = document.createElement('div');
    parcelElement.className = 'parcel';
    parcelElement.style.left = `${parcel.location.x}px`;
    parcelElement.style.top = `${parcel.location.y + 15}px`; // Position below the location label
    parcelElement.id = `parcel-${index}`; // Assign a unique ID to each parcel
    map?.appendChild(parcelElement);
  });
}

// Move the robot to a specific location
function moveRobotTo(x: number, y: number, callback: () => void): void {
  const robot = document.getElementById('robot') as HTMLDivElement;
  if (!robot) return;

  const currentX = parseInt(robot.style.left || '0');
  const currentY = parseInt(robot.style.top || '0');

  const dx = x - currentX;
  const dy = y - currentY;
  const steps = 50;
  let step = 0;

  function animate() {
    step++;
    if (step >= steps) {
      robot.style.left = `${x}px`;
      robot.style.top = `${y}px`;
      callback();
      return;
    }

    const progress = step / steps;
    robot.style.left = `${currentX + dx * progress}px`;
    robot.style.top = `${currentY + dy * progress}px`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Start the delivery process
function startDelivery(): void {
  let currentParcelIndex = 0;
  let carriedParcel: Parcel | null = null;

  function deliverNextParcel(): void {
    if (currentParcelIndex >= parcels.length) {
      console.log('All parcels processed!');
      return;
    }

    const parcel = parcels[currentParcelIndex];

    if (carriedParcel === null) {
      console.log(`Moving to pick up parcel at ${parcel.location.name}`);

      moveRobotTo(parcel.location.x, parcel.location.y, () => {
        console.log(`Picked up parcel at ${parcel.location.name}`);
        carriedParcel = parcel;

        // Remove the parcel from the map
        const parcelElement = document.getElementById(`parcel-${currentParcelIndex}`);
        parcelElement?.remove();

        deliverNextParcel();
      });
    } else {
      console.log(`Moving to deliver parcel at ${carriedParcel.destination.name}`);

      moveRobotTo(carriedParcel!.destination.x, carriedParcel!.destination.y, () => {
        console.log(`Delivered parcel at ${carriedParcel!.destination.name}`);

        // Create a new parcel element at the destination
        const parcelElement = document.createElement('div');
        parcelElement.className = 'parcel';
        parcelElement.style.left = `${carriedParcel!.destination.x}px`;
        parcelElement.style.top = `${carriedParcel!.destination.y + 15}px`;
        parcelElement.id = `parcel-${currentParcelIndex}`;
        document.getElementById('map')?.appendChild(parcelElement);

        carriedParcel = null;
        currentParcelIndex++;
        deliverNextParcel();
      });
    }
  }

  deliverNextParcel();
}

// Initialize the map and set up the start button
document.addEventListener('DOMContentLoaded', () => {
  initializeMap();

  const startButton = document.getElementById('startButton');
  startButton?.addEventListener('click', startDelivery);
});
