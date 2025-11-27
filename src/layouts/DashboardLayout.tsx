import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  LayoutDashboard,
  User,
  Receipt,
  ShoppingCart,
  Users,
  Factory,
  Warehouse,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ROUTES, SUCCESS_MESSAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const DashboardLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: SUCCESS_MESSAGES.LOGOUT
    });
    navigate(ROUTES.LOGIN);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD,
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Profile',
      href: ROUTES.PROFILE,
      icon: User,
      show: true,
    },
  ];

  const activityLinks = [
    { name: 'Expense Receipt', icon: Receipt, href: '/dashboard/activities/expense' },
    { name: 'Sales Receipt', icon: ShoppingCart, href: '/dashboard/activities/sales' },
    { name: 'Customer Service', icon: Users, href: '/dashboard/activities/customer' },
    { name: 'Production Activity', icon: Factory, href: '/dashboard/activities/production' },
    { name: 'Storage Information', icon: Warehouse, href: '/dashboard/activities/storage' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems
        .filter((item) => item.show)
        .map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}

      {/* Activity quick links for employees */}
      {!isAdmin && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="px-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </p>
          <div className="space-y-1">
            {activityLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => mobile && setMobileMenuOpen(false)}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-gray-200 p-5">
                <SheetTitle className="text-left font-bold text-lg">
                  Business Activity Tracker
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 px-4 py-6">
                <NavLinks mobile />
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block font-semibold text-lg">
              Business Activity Tracker
            </span>
            <span className="sm:hidden font-semibold text-lg">BAT</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                aria-label="User menu"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-medium">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={ROUTES.PROFILE} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:bg-white lg:shadow-sm">
          {/* Sidebar Brand */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">BAT</h2>
                <p className="text-xs text-gray-500">Activity Tracker</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2 px-4 py-6">
            <NavLinks />
          </nav>
          
          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-sm font-semibold">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-gray-900 text-sm">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-auto" role="main" aria-label="Main content">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
