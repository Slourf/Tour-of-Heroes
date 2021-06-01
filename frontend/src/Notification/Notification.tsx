import React from "react";
import "./Notification.css";
import store from "./Store";

export interface iNotification {
  id?: string;
  message: string;
  type: string;
  timer?: number;
}

export { store };

interface Props {}

interface State {
  notifications: iNotification[];
}

export default class Notification extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  addNotification = (notification: iNotification) => {
    this.state.notifications.push(notification);
    this.setState({ notifications: this.state.notifications });
    if (notification.timer) {
      setTimeout(() => {
        //Start the timer
        const notifs: iNotification[] = this.state.notifications.filter(
          (notif) => notif.id !== notification.id
        );

        this.setState({ notifications: notifs }); //After 1 second, set render to true
      }, notification.timer);
    }
  };

  removeNotification = (id: string) => {
    const n = this.state.notifications.filter((notif) => {
      return notif.id !== id;
    });

    this.setState({ notifications: n });
  };

  removeAllNotifications = () => {
    this.setState({ notifications: [] });
  };

  componentDidMount = () => {
    store.register({
      addNotification: this.addNotification,
      removeNotification: this.removeNotification,
      removeAllNotifications: this.removeAllNotifications,
    });
  };

  handleRemoveButton = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget.parentElement) {
      this.removeNotification(event.currentTarget.parentElement.id);
    }
  };

  render() {
    const { notifications } = this.state;

    if (!notifications || !notifications.length) {
      return null;
    }

    return (
      <div className="notifications-wrapper">
        <div className="notifications-mid-wrapper">
          {notifications.map((notification, index) => {
            return (
              <div
                id={notification.id}
                key={`notification${index}`}
                className={`notification notification-${notification.type}`}
              >
                <div>{notification.message}</div>
                <div onClick={this.handleRemoveButton}>&#10005;</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
