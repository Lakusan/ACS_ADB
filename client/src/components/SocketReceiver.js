import React from 'react';
import io from 'socket.io-client';

class SocketReceiver extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      data: '',
    };
  }

  componentDidMount() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      const socketId = this.socket.id;
      console.log('Connected to socket server with ID:', socketId);

      this.socket.on('message', (receivedData) => {
        this.setState({ data: receivedData });
        this.props.onDataReceived(receivedData);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  handleReconnect = () => {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  };

  handleDisconnect = () => {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  };

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {this.socket ? (
          <div>
            <p>Connected to socket server with ID: {this.socket.id}</p>
            <button onClick={this.handleReconnect}>Reconnect</button>
            <button onClick={this.handleDisconnect}>Disconnect</button>
            {/* <p>Data received: {data}</p> */}
          </div>
        ) : (
          <p>Connecting to socket server...</p>
        )}
      </div>
    );
  }
}

export default SocketReceiver;