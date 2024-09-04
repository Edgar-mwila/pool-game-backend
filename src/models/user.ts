import { firestore } from '../config/firebase'

export interface User {
  id: string
  username: string
  email: string
  stats: {
    gamesPlayed: number
    gamesWon: number
  }
}

export const createUser = async (user: User) => {
  const userRef = firestore.doc(`users/${user.id}`)
  await userRef.set(user)
}

export const getUserById = async (id: string): Promise<User | null> => {
  const userDoc = await firestore.doc(`users/${id}`).get()
  if (userDoc.exists) {
    return userDoc.data() as User
  }
  return null
}

export const updateUser = async (id: string, updates: Partial<User>) => {
  const userRef = firestore.doc(`users/${id}`)
  await userRef.update(updates)
}
