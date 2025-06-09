'use client';

import { useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { generatePagination } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  query?: string;
  filter?: string;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  query,
  filter,
}: PaginationControlsProps) => {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    if (query) params.set('query', query);
    if (filter) params.set('filter', filter);
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              onClick={(e) => {
                if (currentPage <= 1) {
                  e.preventDefault();
                }
              }}
              className={
                currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {allPages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageURL(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              onClick={(e) => {
                if (currentPage >= totalPages) {
                  e.preventDefault();
                }
              }}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
