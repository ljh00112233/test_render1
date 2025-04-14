import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // axios.get('http://localhost:5000/users')
    axios.get('https://aidiary.onrender.com/users')
      .then((res) => {
        setUsers(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>회원 목록</h2>
      <ul>
        {users.map((user) => (
          <div>{user.id} {user.password} {user.nickname} {user.profile}</div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
