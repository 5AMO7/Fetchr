import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import { 
    PlusIcon, 
    TrashIcon, 
    EnvelopeIcon, 
    UserIcon, 
    CameraIcon, 
    AtSymbolIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { initiateGoogleOAuth, handleGoogleCallback, exchangeCodeForTokens } from '../utils/googleOAuth';

function Profile() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectedEmail, setConnectedEmail] = useState(null);

    useEffect(() => {
        checkConnectionStatus();
        handleOAuthCallback();
    }, []);

    const checkConnectionStatus = () => {
        // Check if user has OAuth tokens stored
        if (user?.gmail_access_token) {
            setIsConnected(true);
            setConnectedEmail(user.email); // You might want to store the connected Gmail separately
        }
    };

    const handleOAuthCallback = async () => {
        const callbackResult = handleGoogleCallback();
        
        if (callbackResult?.error) {
            showToast('OAuth authentication failed', 'error');
            setIsConnecting(false);
            return;
        }

        if (callbackResult?.code) {
            setIsConnecting(true);
            try {
                // Exchange the authorization code for tokens via backend
                const result = await exchangeCodeForTokens(callbackResult.code);
                
                if (result.message) {
                    showToast(result.message, 'success');
                    setIsConnected(true);
                    
                    // Use the Gmail account email from the backend response
                    if (result.account_info?.email) {
                        setConnectedEmail(result.account_info.email);
                    } else {
                        // Fallback to user's email if no Gmail account email provided
                        setConnectedEmail(user.email);
                    }
                    
                    console.log('Gmail account connected:', result.account_info);
                } else {
                    showToast('Failed to connect Gmail account', 'error');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                showToast(error.message || 'Failed to connect Gmail account', 'error');
            } finally {
                setIsConnecting(false);
            }
        }
    };

    const handleConnectGoogleEmail = async () => {
        setIsConnecting(true);
        try {
            // Initiate OAuth flow - redirects to Google
            initiateGoogleOAuth();
        } catch (error) {
            console.error('Error initiating OAuth:', error);
            showToast('Failed to connect Google account', 'error');
            setIsConnecting(false);
        }
    };

    const handleDisconnectEmail = async () => {
        try {
            // Clear tokens in backend by sending empty tokens
            await api.post('/oauth/tokens', {
                access_token: '',
                refresh_token: ''
            });
            
            setIsConnected(false);
            setConnectedEmail(null);
            showToast('Gmail account disconnected successfully', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to disconnect Gmail account', 'error');
        }
    };

    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />
            <main className='flex flex-col bg-background-primary w-full h-full pt-4 overflow-hidden large-section-shadow z-10'>
                {/* Header */}
                <div className="mb-8 ps-64">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="space-y-8 overflow-y-auto px-64 py-5 w-full">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Picture */}
                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <UserIcon className="w-16 h-16 text-white" />
                                </div>
                                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <CameraIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="mt-4 text-center">
                                    <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
                                        Coming Soon
                                    </span>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {user?.name} {user?.lastname}
                                </h2>
                                <p className="text-gray-600 text-lg mb-6">{user?.email}</p>

                                {/* Stats */}
                                <div className="flex justify-center md:justify-start gap-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{isConnected ? 1 : 0}</div>
                                        <div className="text-sm text-gray-600">Connected Accounts</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${
                                            isConnected ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                            {isConnected ? 'Active' : 'Inactive'}
                                        </div>
                                        <div className="text-sm text-gray-600">Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                <p className="text-sm text-gray-600">Your account details</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <span className="text-gray-900 font-medium">{user?.name}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <span className="text-gray-900 font-medium">{user?.lastname}</span>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <span className="text-gray-900 font-medium">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Integration */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <EnvelopeIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Email Integration</h3>
                                    <p className="text-sm text-gray-600">Connect your Gmail account for email campaigns</p>
                                </div>
                            </div>
                        </div>

                        {!isConnected ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <EnvelopeIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No connected accounts</h4>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Connect your Gmail account to start sending automated email campaigns to your leads.
                                </p>
                                <button
                                    onClick={handleConnectGoogleEmail}
                                    disabled={isConnecting}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    {isConnecting ? 'Connecting...' : 'Connect Gmail Account'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{connectedEmail}</p>
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircleIcon className="w-3 h-3" />
                                                    Connected
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Gmail Account
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDisconnectEmail}
                                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 group"
                                        title="Disconnect account"
                                    >
                                        <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Notice */}
                        <div className="mt-6">
                            <Alert 
                                type="info" 
                                message="We use secure OAuth authentication to connect your Gmail account. Your login credentials are never stored or seen by us. The connection is used solely to send emails on your behalf." 
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile; 