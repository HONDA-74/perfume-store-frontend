import * as React from 'react';
import { cn } from '@/lib';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

/**
 * PageHeader — top-of-page header with title, description, and breadcrumbs.
 * Provides consistent page-level hierarchy and navigation context.
 */
const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, breadcrumbs, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-8 space-y-4', className)}
        {...props}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div>
          <h1 className="font-serif text-h1 font-bold text-neutral-900">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-body-lg text-neutral-600">{description}</p>
          )}
        </div>
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';

export { PageHeader };
