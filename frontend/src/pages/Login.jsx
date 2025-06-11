import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    setIsLoading(false);
    if (success) {
      navigate('/explore');
    }
  };

  return (
    <div className='flex h-screen w-screen items-center p-2 gap-4'>
      <div className='flex flex-col items-start h-full w-1/2 rounded-xl px-36 pt-24'>
        <img src="fetchr-logo.svg" alt="Fetchr" className='h-14'/>

        <div className='flex flex-col mt-16 mb-8 gap-2'>
          <h1 className='font-semibold text-6xl text-text-primary'>Welcome Back!</h1>
          <h2 className='text-lg text-text-secondary'>Welcome back to your best partner in getting clients.</h2>
        </div>

        <form className="mt-8 w-full h-full pe-52" onSubmit={handleSubmit}>

          <div className='flex flex-col justify-center items-start gap-4 mb-8'>
            <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full text-md rounded-md py-2 px-3 text-text-primary  border border-border-dark placeholder:text-gray-400 focus:z-10 focus:outline-none ring-inset focus:ring-2 focus:ring-accent"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md py-2 px-3 text-md text-text-primary border border-border-dark placeholder:text-gray-400 focus:z-10 focus:outline-none ring-inset focus:ring-2 focus:ring-accent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            <div className='flex justify-between items-center w-full'>
              <div className='flex items-center gap-3'>
                <input type="checkbox" className="w-5 h-5 rounded-xl border border-border-dark accent-accent" name='rememberMe' id='rememberMe' />
                <label htmlFor="rememberMe" className='text-text-secondary-dark text-md'>Remember me</label>
              </div>

              <a href="#" className='text-text-secondary-dark text-md font-normal hover:text-accent'>Forgot password?</a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-accent py-2 px-3 text-md font-semibold text-white disabled:bg-accent"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-danger px-2 py-3 border border-border-danger flex items-center gap-3 mt-6">
              <ExclamationCircleIcon className='h-4 w-5 text-text-danger stroke-2'/>
              <div className="text-sm text-text-danger">{error}</div>
            </div>
          )}

        </form>

        <h3 className='text-md text-text-secondary mb-24 mt-6'>Don't have an account? <Link to="/signup" className='text-accent hover:text-accent'>Sign Up</Link></h3>

      </div>

      <div className='relative h-full w-1/2 bg-gradient-to-br from-violet-200 to-pink-200 rounded-xl overflow-hidden flex justify-center items-end'>
          <h1 className='absolute text-accent font-bold text-8xl text-center top-16 select-none'>Getting clients has never been easier!</h1>
          <img src="business-analysis.svg" alt=""  className='h-4/5 mb-8'/>
      </div>
    </div>
  );
} 

