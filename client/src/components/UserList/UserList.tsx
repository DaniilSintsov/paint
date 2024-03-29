import { observer } from 'mobx-react-lite'
import React from 'react'
import connectionState from '../../store/connectionState/connectionState'
import User from '../User/User'

const UserList = observer(() => {
  const lenOfRandomUserId: number = 18 // given the characters "0" and "."

  return (
    <div className="flex gap-[var(--bar-indent)]">
      {connectionState.allUsers
        .filter(user => user !== connectionState.userId)
        .map(user => (
          <User
            key={user}
            description={user.slice(0, user.length - lenOfRandomUserId)}
          />
        ))}
    </div>
  )
})

export default UserList
