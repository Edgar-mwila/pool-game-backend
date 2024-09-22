// src/controllers/userController.ts
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { firestore } from '../config/firebase';
import { User, createUser, getUserById, } from '../models/user';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    // Create a new user with Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: username,
    });

    // Create a user document in Firestore
    const user: User = {
      id: userRecord.uid,
      email: userRecord.email || '',
      username: userRecord.displayName || '',
      stats: {
        gamesPlayed: 0,
        gamesWon: 0
      }
    };

    await createUser(user);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login a user (client-side authentication)
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Firebase handles authentication, so no explicit login is needed.
    // The client-side will handle this with Firebase Auth SDK.
    const userRecord = await getAuth().getUserByEmail(email);

    // Fetch user data from Firestore
    const userDoc = await firestore.collection('users').doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    } else if(userDoc?.data()?.password !== password) {
      return res.status(201).json({ error: 'Wrong password' });
    }

    const user = userDoc.data() as User;
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};


// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const user = await getUserById(uid);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

