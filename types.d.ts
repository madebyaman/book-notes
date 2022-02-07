export type SignupProps = {
  name: string;
  email: string;
  password: string;
};

export type SigninProps = {
  email: string;
  password: string;
};

export type Signup = ({ name, email, password }: SignupProps) => {
  status: 'LOADING' | 'SUCCESS' | 'ERROR';
  errorMessage: string;
};
export type Signin = ({ email, password }: SigninProps) => Promise<
  | {
      type: 'SUCCESS';
      message?: undefined;
    }
  | {
      type: 'FAILURE';
      message: string;
    }
>;
