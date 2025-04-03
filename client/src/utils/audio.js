const notification = new Audio(require('./../assets/sounds/notification.mp3'));

export const playNotificationSound = () => {
    notification.play().catch(error => console.error("Error playing sound:", error));
};
