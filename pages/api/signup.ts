import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../firebase';
import cookie from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, name } = req.body as {
    email: string;
    password: string;
    name: string;
  };

  // Check password length
  if (password.length < 6) {
    res.status(400);
    res.json({
      message: 'Password must be at least 6 characters long',
    });
    return;
  }

  // Else create user and add a name
  let user: User | undefined;
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredentials.user;
    await updateProfile(user, { displayName: name });
  } catch (err) {
    res.status(401);
    res.json({ message: 'User already exists' });
  }

  if (user) {
    const token = await user.getIdToken();
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('ACCESS_TOKEN', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    );
    return res.json(user);
  }
};
