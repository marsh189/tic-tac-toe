import { useState } from 'react';
import { io } from 'socket.io-client';

function Login({ setIsAuth, setUser, user }) {
  const socket = io(process.env.REACT_APP_API_URL);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    console.log(
      'trying to log in as ' + username + ' with password ' + password
    );
    socket.emit('login_register', { user: username, pass: password });
    /*Axios.post(process.env.REACT_APP_LOCAL_URL + '/login', {
      username,
      password,
    }).then((res) => {
      console.log(res.data);
      const { token, userId, firstName, lastName, username } = res.data;

      cookies.set('token', token);
      cookies.set('userId', userId);
      cookies.set('username', username);
      cookies.set('firstName', firstName);
      cookies.set('lastName', lastName);
      setIsAuth(true);
    });*/
  };

  socket.on('logged_in', (data) => {
    console.log('Logged in as ' + data.user);
    alert('Logged in as ' + data.user);
    setIsAuth(true);
    setUser(data.user);
  });

  socket.on('error', () => {
    alert('There was an error logging on, please try again!');
  });

  socket.on('invalid', () => {
    alert('Username or Password are invalid, Please try again!');
  });

  return (
    <div className="login">
      <label>Login</label>
      <input
        placeholder="Username"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
export default Login;
