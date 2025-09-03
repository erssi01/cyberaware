import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/dashboard' }
  ];
  
  // Build breadcrumb items from current path
  pathnames.forEach((name, index) => {
    const href = `/${pathnames.slice(0, index + 1).join('/')}`;
    let label = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Custom labels for specific routes
    if (name === 'modules') {
      label = 'Learning Modules';
    } else if (name === 'password') {
      label = 'Password Security';
    } else if (name === 'phishing') {
      label = 'Phishing Defense';
    } else if (name === 'privacy') {
      label = 'Privacy Protection';
    }
    
    breadcrumbs.push({ label, href });
  });

  // Don't show breadcrumb on home/dashboard
  if (pathnames.length === 0 || location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === 0 && <Home className="h-4 w-4 mr-2" />}
          {item.href && index < breadcrumbs.length - 1 ? (
            <Link 
              to={item.href} 
              className={cn(
                "hover:text-foreground transition-colors duration-200",
                index === 0 && "flex items-center"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};