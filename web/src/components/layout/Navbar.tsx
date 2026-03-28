import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Wallet, ShieldCheck } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { useMetaMask } from "@hooks/useMetaMask";
import { Button } from "@components/common/Button";
import { Badge } from "@components/common/Badge";

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { account, isConnected, connect, isLoading } = useMetaMask();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const truncateAddress = (add: string) => `${add.substring(0, 6)}...${add.substring(add.length - 4)}`;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                AyurChain
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated && user && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                
                {isConnected ? (
                  <Badge 
                    stage="metaMask" 
                    label={account ? truncateAddress(account) : "Connected"} 
                    colorClass="bg-green-100 text-green-800 border border-green-200"
                    showDot
                  />
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={connect} 
                    loading={isLoading}
                    className="gap-2 border-accent text-accent-dark hover:bg-accent hover:text-white transition-colors"
                  >
                    <Wallet size={16} />
                    Connect Wallet
                  </Button>
                )}

                <div className="flex items-center gap-3 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100 ml-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900 leading-none">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize leading-tight mt-0.5">{user.role}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-light/10 text-primary flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated && user && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-primary bg-primary/5 rounded-md mx-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light/10 text-primary flex items-center justify-center font-bold mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-col gap-2">
                    {isConnected ? (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-md">
                        <Wallet size={16} />
                        {account ? truncateAddress(account) : "Connected"}
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full justify-center" 
                        onClick={connect} 
                        loading={isLoading}
                      >
                        Connect MetaMask
                      </Button>
                    )}
                    
                    <Button 
                      variant="danger" 
                      className="w-full justify-center mt-2 group" 
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="px-4 py-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
