import User from './User'

export enum UserSortAttribute {
  LastName = 'lastName',
}

interface UserInList extends User {}

export default UserInList
