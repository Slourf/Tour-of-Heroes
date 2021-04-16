import React from "react";
import "./Notification.css";
import store from "./Store";

export interface iNotification {
  id?: string;
  message: string;
  type: string;
}

export { store };

interface Props {}

interface State {
  notifications: Array<iNotification>
}

export default class Notification extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
        notifications: []
    };
  }

  addNotification = (notification: iNotification) => {
    this.state.notifications.push(notification);
    this.setState({ notifications: this.state.notifications });
  }

  removeNotification = (id: string) => {
    const n = this.state.notifications.filter((notif) => {
      return notif.id != id;
    });

    console.log(n);

    this.setState({ notifications: n});
  }

  removeAllNotifications = () => {
    this.setState({notifications: []});
  }

  componentWillMount = () => {
    store.register({
      addNotification: this.addNotification,
      removeNotification: this.removeNotification,
      removeAllNotifications: this.removeAllNotifications
    })
  };

  handleRemoveButton = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget.parentElement) {
      console.log(event.currentTarget.parentElement.id);
      this.removeNotification(event.currentTarget.parentElement.id);
    }
  }

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
                  <div id={notification.id} key={`notification${index}`} className={`notification notification-${notification.type}`}>
                    <div>
                      {notification.message}
                    </div>
                    <div onClick={this.handleRemoveButton} >&#10005;</div>
                  </div>
              )
            })}
          </div>
        </div>
    );
  }
}