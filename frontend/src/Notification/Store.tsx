import { iNotification } from "./Notification";

interface iStore {
  addNotification: ((notification: iNotification) => void) | null;
  removeNotification: ((id: string) => void) | null;
  register: (param: iRegisterParams) => void;
}

interface iRegisterParams {
  addNotification: (notification: iNotification) => void;
  removeNotification: ((id: string) => void) | null;
  removeAllNotifications: (() => void) | null;
}

class Store implements iStore {
  constructor() {
    this.counter = 0;
    this.add = null;
    this.removeNotification = null;
    this.removeAllNotifications = null;
  }

  public removeNotification: ((id: string) => void) | null;
  public removeAllNotifications: (() => void) | null;

  private add: ((notification: iNotification) => void) | null;
  private counter: number;

  private incrementCounter = () => (this.counter += 1);

  public addNotification(notification: iNotification) {
    if (!notification.id) {
      notification.id = `notification-${this.counter}`;
    }

    this.incrementCounter();

    if (this.add) {
      this.add(notification);
    }
  }

  public getCounter = () => this.counter;

  public register(parameters: iRegisterParams) {
    const {
      addNotification,
      removeNotification,
      removeAllNotifications,
    } = parameters;

    this.add = addNotification;
    this.removeNotification = removeNotification;
    this.removeAllNotifications = removeAllNotifications;
  }
}

export default new Store();
